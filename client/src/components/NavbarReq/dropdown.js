import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the server
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Replace the API endpoint with your actual endpoint to fetch user data
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/dropdown', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user); // Assuming the user data is available in the "user" property
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const checkIsManager = () => {
    if (userData && userData.managerGroupId == null) {
      return true;
    }
    return false;
  };

  const toggleDropdown = () => {
    fetchUserData();
    setIsOpen(!isOpen);
  };

  return (
    <li className={`nav-item dropdown ${isOpen ? 'show' : ''}`}>
      <a className="nav-link dropdown-toggle" href="#" onClick={toggleDropdown} data-bs-toggle="dropdown" aria-expanded={isOpen}>
        Timesheets
      </a>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} data-bs-popper="static">
      <li><a className="dropdown-item" href="/timesheet">My Calendar</a></li>
        {!userData?.managerGroupId && (
          <li><a className="dropdown-item" href="/creategroup">Create a Group</a></li>
        )}
        {!userData?.employeeGroupId && (
          <li><a className="dropdown-item" href="/joingroup">Join a Group</a></li>
        )}
        {!checkIsManager() && (
          <li><a className="dropdown-item" href="/managegroup">Manage a Group</a></li>
        )}
      </ul>
    </li>
  );
};

export default Dropdown;
