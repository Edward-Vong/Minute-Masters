import React from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Perform any additional cleanup if needed
    // For example, resetting user state or other stored data

    // Redirect the user to the login page
    navigate("/home");
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
