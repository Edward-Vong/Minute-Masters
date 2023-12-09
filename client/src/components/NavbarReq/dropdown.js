import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inGroup, setInGroup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkGroupMembership = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn based on the presence of token

    const joinedGroup = localStorage.getItem('joinedGroup');
    const groupMember = joinedGroup === 'true'; // Check if joinedGroup is 'true'

    // Set inGroup to true only if the user is logged in and is part of the group
    setInGroup(!!token && groupMember);
  };

  useEffect(() => {
    checkGroupMembership();
  }, [isOpen]); // Re-run the check whenever isOpen changes

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={`nav-item dropdown ${isOpen ? 'show' : ''}`}>
      <a className="nav-link dropdown-toggle" href="#" onClick={toggleDropdown} data-bs-toggle="dropdown" aria-expanded={isOpen}>
        Timesheets
      </a>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} data-bs-popper="static">
        {isLoggedIn ? (
          <>
            {inGroup ? (
              <>
                <li><a className="dropdown-item" href="/timesheet">My Calendar</a></li>
                <li><a className="dropdown-item" href="/#">Manage Group</a></li>
                <li><a className="dropdown-item" href="/viewgroup">View Group</a></li>
              </>
            ) : (
              <>
                <li><a className="dropdown-item" href="/timesheet">My Calendar</a></li>
                <li><a className="dropdown-item" href="/#">Create Group</a></li>
                <li><a className="dropdown-item" href="/joingroup">Join Group</a></li>
              </>
            )}
          </>
        ) : (
          <>
            <li><a className="dropdown-item" href="/timesheet">My Calendar</a></li>
            <li><a className="dropdown-item" href="/#">Login to Interact</a></li>
          </>
        )}
      </ul>
    </li>
  );
};

export default Dropdown;
