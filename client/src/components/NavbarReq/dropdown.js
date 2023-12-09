import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inGroup, setInGroup] = useState(false);

  useEffect(() => {
    // Check if the user is in a group
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Replace this condition with your logic to determine if the user is in a group
    // For demonstration purposes, checking if the user is logged in as a mock condition
    if (isLoggedIn) {
      setInGroup(true); // Set inGroup to true if the user is in a group
    } else {
      setInGroup(false); // Set inGroup to false if the user is not in a group
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`nav-item dropdown ${isOpen ? 'show' : ''}`}>
      <a className="nav-link dropdown-toggle" href="#" onClick={toggleDropdown} data-bs-toggle="dropdown" aria-expanded={isOpen}>
        Timesheets
      </a>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} data-bs-popper="static">
        <li><a className="dropdown-item" href="/timesheet">My Calendar</a></li>
        <li><a className="dropdown-item" href="/creategroup">Create a Group</a></li>
        <li><a className="dropdown-item" href="#">Join a Group</a></li>
        <li><a className="dropdown-item" href="/managegroup">Manage a Group</a></li>
      </ul>
    </li>
  );
};

export default Dropdown;
