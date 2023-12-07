import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import calendarImage from "./NavbarReq/calendarImage.png";
import { Link } from 'react-router-dom';
import Dropdown from "./NavbarReq/dropdown";

// Here, we display our Navbar
export default function Navbar() {
  return (
    <div class="container">
      <nav class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" class="col-md-3 mb-2 mb-md-0 link-body-emphasis text-decoration-none">
          <img src={ calendarImage } class="bi me-2" width="40" height="40"/>
          <span class="fs-4">Minute Masters</span>
        </a>

        <div class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <Link to="/" class="nav-link px-2">Home</Link>
          <Dropdown />
        </div>

        <div class="col-md-3 text-end">
          <Link to="/login">
            <button　type="button" class="btn btn-primary me-2">Login</button>
          </Link>
          <Link to="/register">
            <button　type="button" class="btn btn-primary me-2">register</button>
          </Link>
        </div>
      </nav>
    </div>
  );
}