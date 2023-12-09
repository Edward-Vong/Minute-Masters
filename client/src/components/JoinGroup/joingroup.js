import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

const JoinGroup = () => {
  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [message, setMessage] = useState("");
  
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const checkCodeValidity = () => {
    if (isLoggedIn) {
      // If logged in, check the code validity
      if (code === "YOUR_VALID_CODE") {
        setValidCode(true);
        setMessage("Code is valid. You have joined the group!");
      } else {
        setValidCode(false);
        setMessage("Invalid code. Unable to join the group.");
      }
    } else {
      // If not logged in, display an appropriate message
      setMessage("Not logged in. Unable to join the group.");
    }
  };

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="container">
      <h2>Join Group</h2>
      <div className="form-group">
        <label>Enter Group Code:</label>
        <input
          type="text"
          className="form-control"
          value={code}
          onChange={handleInputChange}
        />
      </div>
      <button className="btn btn-primary" onClick={checkCodeValidity}>
        Join Group
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinGroup;
