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
//console.log(process.env.ATLAS_URI);
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
    startDate: {
      type: Date,
      default: Date.now,
    },
    stopDate: {
      type: Date,
      default: null,
    },
    totalTime: {
      type: Number,
      default: 0,
    },
  });
  
  const userSchema = new mongoose.Schema({
    userName: String,
    emailAddress: {
      type: String,
      lowercase: true, // Ensures that the email is always stored in lowercase
    },
    password: String,
    timeEntries: {
      type: [timeEntrySchema],
      default: [
        {
          startDate: Date.now(),
          stopDate: null,
          timeStopped: 0,
        },
      ],
    },
  });
//console.log(userSchema);
const User = mongoose.model('User', userSchema);

const saltRounds = 10;
const secretKey = 'thisIsSuperSecretAndMinuteMasterKey';

app.post('/register', async (req, res) => {
  console.log("Register Route Reached");
  const { userName, emailAddress, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });
    const existingEmail = await User.findOne({ emailAddress});
    console.log("check works");
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    if(existingEmail)
    {
        return res.status(400).json({success: false, message: 'Email already exists'});
    }
    //alert(existingEmail + " " + existingUser);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ userName, emailAddress, password: hashedPassword});
    //alert(newUser);
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
      //throw error;
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

// Protected route for fetching user info
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
// Add this before app.listen
app.post('/timer', verifyToken, async (req, res) => {
  const { elapsedTime, timeStopped } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
   // Find the index of the time entry in the array based on the provided identifier
   const timeEntryIndex = user.timeEntries.length-1;

   if (timeEntryIndex === -1) {
     return res.status(404).json({ success: false, message: 'Time entry not found' });
   }

   // Update the properties of the found time entry
   user.timeEntries[timeEntryIndex].elapsedTime = elapsedTime;
   
   user.timeEntries[timeEntryIndex].timeStopped = timeStopped;
   console.log(user.timeEntries[timeEntryIndex]);
    await user.save();

    res.status(200).json({ success: true, message: 'Timer data saved successfully' });
  } catch (error) {
    console.error('Error saving timer data:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/timer', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const timerData = user.timeEntries.map((entry) => ({
      date: entry.date,
      elapsedTime: entry.elapsedTime,
      timeStopped: entry.timeStopped,
    }));

    res.status(200).json({ success: true, timer: timerData[user.timeEntries.length-1] });
    console.log(timerData[0]);
  } catch (error) {
    console.error('Error fetching timer data:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
