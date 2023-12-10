import React, { useState, useEffect } from "react";

const NameList = () => {
  const [initialNames, setInitialNames] = useState([]);
  const [names, setNames] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getNames = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/listName', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const groupData = await response.json();
          setInitialNames(groupData.membersId);
          setNames(groupData.members); // Set both initial and current names
        } else {
          console.error('Error fetching group data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching group data:', error.message);
      }
    };

    getNames();
  }, []); // Empty dependency array to run the effect only once on mount

  const handleDelete = async (index, userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/removeUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // If the removal is successful, update the state to reflect the change
        const updatedNames = [...names];
        updatedNames.splice(index, 1);
        setNames(updatedNames);
      } else {
        console.error('Error removing user from the group:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing user from the group:', error.message);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: '30px' }}>Name List</h2>
      <ul className="list-group" style={{ marginBottom: '30px' }}>
        {names.map((name, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {name}
            <button className="btn btn-danger" onClick={() => handleDelete(index, initialNames)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NameList;
