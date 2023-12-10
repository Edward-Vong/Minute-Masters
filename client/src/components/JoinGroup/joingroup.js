import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Notification from "../Notification"; // Update the path to your Notification component

const JoinGroup = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const checkCodeValidity = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/joinGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ joinCode: code }),
      });

      const groupData = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(groupData.message);
      } else {
        setIsSuccess(false);
        setMessage(`Error: ${groupData.message}`);
      }
    } catch (error) {
      console.error("Error joining group:", error);
      setIsSuccess(false);
      setMessage("Error joining group. Please try again.");
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
      {message && <Notification message={message} isSuccess={isSuccess} />}
    </div>
  );
};

export default JoinGroup;
