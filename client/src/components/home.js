import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  const [joinedGroup, setJoinedGroup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const groupJoined = localStorage.getItem('joinedGroup');
    setIsLoggedIn(!!localStorage.getItem('token')); // Check if the user is logged in

    if (groupJoined === 'true') {
      setJoinedGroup(true);
    }
  }, []); // Run this effect only once on component mount

  return (
    <div className="container">
      <h2>Welcome to Your Home Page</h2>
      {isLoggedIn ? (
        joinedGroup ? (
          <p>Congratulations on joining a group!</p>
        ) : (
          <p>You haven't joined any group yet. <a href="/joingroup">Join a group</a> now!</p>
        )
      ) : (
        <p>Please <a href="/login">log in</a> to access group features.</p>
      )}
      {/* Other content for the home page */}
    </div>
  );
};

export default Home;
