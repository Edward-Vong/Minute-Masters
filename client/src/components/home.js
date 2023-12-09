import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const Home = ({ joinedGroup }) => {
  return (
    <div className="container">
      <h2>Welcome to Your Home Page</h2>
      {joinedGroup ? (
        <p>Congratulations on joining a group!</p>
      ) : (
        <p>You haven't joined any group yet.</p>
      )}
      {/* Other content for the home page */}
    </div>
  );
};

export default Home;
