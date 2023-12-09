// Dropdown.js
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <li><a className="dropdown-item" href="#">Create a Group</a></li>
        <li><a className="dropdown-item" href="#">Join a Group</a></li>
      </ul>
    </li>
  );
};

export default Dropdown;
