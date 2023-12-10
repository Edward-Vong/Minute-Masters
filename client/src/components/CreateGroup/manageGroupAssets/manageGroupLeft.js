import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import RightArrow from "../../Timesheet/calendarAssets/arrowR.png";
import { useNavigate } from 'react-router-dom';

const ManageGroupLeft = () => {
  const [groupData, setGroupData] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (!authToken) {
      // Redirect to login if no token is present
      navigate("/login");
    } else {
      // Fetch group data when the component mounts
      getGroupData();
    }
  }, [navigate]);

  const getGroupData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/manageGroup', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const groupData = await response.json();
        setGroupData(groupData);
      }

    } catch (error) {
      console.error('Error fetching group data:', error.message);
    }
  };

  const handleNameChange = (e) => {
    setNewGroupName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/updateGroupName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ newName: newGroupName }),
      });

      if (response.ok) {
        // Handle success, update UI or show a notification
        console.log('Group name updated successfully');
        // Optionally, you can fetch updated group data after the name is updated
        getGroupData();
      } else {
        // Handle error, show an error message or log the error
        console.error('Error updating group name:', response.status);
      }
    } catch (error) {
      console.error('Error updating group name:', error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="text-left" style={{ marginBottom: '10px' }}>Manage Group</h2>
      {/* Check if groupData is available before displaying group name */}
      {groupData && groupData.name && (
        <>
          <h3 className="text-left">Group Name: {groupData.name}</h3>
          <form className="d-flex" style={{ marginBottom: '30px' }} onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              placeholder="New Name"
              aria-label="groupName"
              value={newGroupName}
              onChange={handleNameChange}
            />
            <button type="submit" className="btn" style={{ marginLeft: '5px' }}>
              <img src={RightArrow} className="bi" width="16" height="18" alt="Right Arrow" />
            </button>
          </form>
          <h3 className="text-left">Add Code:</h3>
          <h5 className="text-left">Join Code: {groupData.joinCode}</h5>
        </>
      )}
    </div>
  );
};

export default ManageGroupLeft;
