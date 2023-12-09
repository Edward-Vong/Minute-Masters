// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const timeEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  startDate: {
    type: Date,
    default: null,
  },
  totalTime: {
    type: Number,
    default: 0,
  },
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    unique: true,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const userSchema = new mongoose.Schema({
  userName: String,
  emailAddress: {
    type: String,
    lowercase: true,
  },
  password: String,
  managerGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  employeeGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  timeEntries: {
    type: [timeEntrySchema],
    default: [
      {
        date: Date.now(),
        startDate: null,
        totalTime: 0,
      },
    ],
  },
});

const Group = mongoose.model('Group', groupSchema);
const User = mongoose.model('User', userSchema);

const saltRounds = 10;
const secretKey = 'thisIsSuperSecretAndMinuteMasterKey';

app.post('/register', async (req, res) => {
  console.log("Register Route Reached");
  const { userName, emailAddress, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });
    const existingEmail = await User.findOne({ emailAddress });
    console.log("check works");
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ userName, emailAddress, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful' });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const user = await User.findOne({ emailAddress });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.redirect('/login');
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
}

app.post('/timesheet', verifyToken, async (req, res) => {
  const { startDate, totalTime } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const timeEntryIndex = user.timeEntries.length - 1;

    function areDifferentDays(date1, date2) {
      return (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()
      );
    }

    if (timeEntryIndex === -1 || areDifferentDays(new Date(), user.timeEntries[timeEntryIndex].date)) {
      const newTimeEntry = {
        date: new Date(),
        startDate: startDate,
        totalTime: startDate ? 0 : totalTime,
      };

      user.timeEntries.push(newTimeEntry);
    } else {
      user.timeEntries[timeEntryIndex].startDate = startDate;
      if (startDate === null) {
        user.timeEntries[timeEntryIndex].totalTime += totalTime;
      }
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Time Entry saved successfully' });
  } catch (error) {
    console.error('Error saving time entry:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/timesheet', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const timerData = user.timeEntries.map((entry) => ({
      date: entry.date,
      startDate: entry.startDate,
      totalTime: entry.totalTime,
    }));

    res.status(200).json({ success: true, timerData });
    console.log(timerData[0]);
  } catch (error) {
    console.error('Error fetching timer data:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/createGroup', verifyToken, async (req, res) => {
  const { groupName } = req.body;
  const userId = req.userId;

  try {
    const existingManagerGroup = await Group.findOne({ manager: userId });

    if (existingManagerGroup != null) {
      return res.status(400).json({ success: false, message: 'You are already a manager of a group' });
    }

    const group = new Group({
      name: groupName,
      joinCode: generateJoinCode(),
      manager: userId,
      members: [],
    });

    if (group.manager.toString() !== userId) {
      group.members.push(userId);
    }

    await group.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.managerGroupId = group._id;
    await user.save();

    res.status(201).json({ success: true, message: 'Group created successfully', group });
  } catch (error) {
    console.error('Error creating group:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

function generateJoinCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let joinCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    joinCode += characters.charAt(randomIndex);
  }

  return joinCode;
}

app.post('/joinGroup', verifyToken, async (req, res) => {
  const { joinCode } = req.body;
  const userId = req.userId;

  try {
    const existingMemberGroup = await Group.findOne({ members: userId });

    if (existingMemberGroup) {
      return res.status(400).json({ success: false, message: 'You are already a member of a group' });
    }

    const groupToJoin = await Group.findOne({ joinCode });

    if (!groupToJoin) {
      return res.status(404).json({ success: false, message: 'Invalid join code' });
    }

    if (groupToJoin.manager.toString() === userId) {
      return res.status(400).json({ success: false, message: 'You cannot join a group you manage' });
    }

    groupToJoin.members.push(userId);
    await groupToJoin.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.employeeGroupId = groupToJoin._id;
    await user.save();

    const notificationMessage = `You have successfully joined the group "${groupToJoin.name}"`;
    res.status(200).json({ success: true, message: notificationMessage, group: groupToJoin });
  } catch (error) {
    console.error('Error joining group:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/dropdown', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Adjust the response format based on your user schema
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/manageGroup', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingManagerGroup = await Group.findById(user.managerGroupId);

    if (!existingManagerGroup) {
      return res.status(404).json({ success: false, message: 'User is not a manager of any group' });
    }

    res.status(200).json({
      success: true,
      name: existingManagerGroup.name,
      joinCode: existingManagerGroup.joinCode,
      // Add other relevant properties
    });
  } catch (error) {
    console.error('Error fetching manager group:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add this route to handle the group name update
app.post('/updateGroupName', verifyToken, async (req, res) => {
  const { newName } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const group = await Group.findById(user.managerGroupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.name = newName;
    await group.save();

    res.status(200).json({ success: true, message: 'Group name updated successfully', group });
  } catch (error) {
    console.error('Error updating group name:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/listName', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingManagerGroup = await Group.findById(user.managerGroupId);

    if (!existingManagerGroup) {
      return res.status(404).json({ success: false, message: 'User is not a manager of any group' });
    }

    const nameArr = [];
    for (const memName of existingManagerGroup.members) {
      try {
        const member = await User.findById(memName);
        nameArr.push(member.userName); // Assuming 'userName' is the property you want to extract
      } catch (error) {
        console.error('Error fetching member:', error.message);
      }
    }

    console.log(nameArr);

    res.status(200).json({
      success: true,
      members: nameArr,
      membersId: existingManagerGroup.members,
      // Add other relevant properties
    });
  } catch (error) {
    console.error('Error fetching manager group:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add this route to handle the removal of a member
app.post('/removeUser', verifyToken, async (req, res) => {
  const { userId } = req.body;
  const managerId = req.userId;

  try {
    // Find the group managed by the current user
    const managerGroup = await Group.findOne({ manager: managerId });

    if (!managerGroup) {
      return res.status(404).json({ success: false, message: 'Manager group not found' });
    }

    // Check if the current user is a manager of the group
    if (managerGroup.manager.toString() !== managerId) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }

    // Remove the user from the group's members array
    managerGroup.members.pull(userId);
    await managerGroup.save();

    const user = await User.findById(userId);
    user.employeeGroupId = null;
    await user.save();

    res.status(200).json({ success: true, message: 'User removed from the group' });
  } catch (error) {
    console.error('Error removing user from the group:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
