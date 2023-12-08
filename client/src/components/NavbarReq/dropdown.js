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
        Dropdown
      </a>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`} data-bs-popper="static">
        <li><a className="dropdown-item" href="/timesheet">Timesheet</a></li>
        <li><a className="dropdown-item" href="#">Another action</a></li>
        <li><a className="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </li>
  );
};

export default Dropdown;
