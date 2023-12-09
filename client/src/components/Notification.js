import React from "react";

const Notification = ({ message, isSuccess }) => {
  const notificationStyle = {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    color: isSuccess ? "#155724" : "#721c24",
    backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
    border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
