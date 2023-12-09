import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

const ViewGroup = () => {
  const [isPartOfGroup, setIsPartOfGroup] = useState(true);
  const [leaveMessage, setLeaveMessage] = useState("");

  const handleLeaveGroup = () => {
    // Perform actions to leave the group
    // For demonstration, updating state to simulate leaving the group
    localStorage.setItem('joinedGroup', 'false'); // Set 'joinedGroup' in localStorage to false
    setIsPartOfGroup(false);
    setLeaveMessage("You have left the group.");
  };

  return (
    <div className="container">
      <h1>Group View</h1>
      {isPartOfGroup ? (
        <div>
          <button className="btn btn-danger" onClick={handleLeaveGroup}>
            Leave Group
          </button>
          {leaveMessage && <p>{leaveMessage}</p>}
        </div>
      ) : (
        <p>You are not currently part of the group.</p>
      )}
    </div>
  );
};

export default ViewGroup;
