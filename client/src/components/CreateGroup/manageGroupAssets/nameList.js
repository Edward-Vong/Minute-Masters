import React, { useState } from "react";

const NameList = () => {
  const initialNames = ["John", "Jane", "Bob", "Alice"];
  const [names, setNames] = useState(initialNames);

  const handleDelete = (index) => {
    // Create a copy of the names array
    const updatedNames = [...names];
    // Remove the name at the specified index
    updatedNames.splice(index, 1);
    // Update the state with the new array
    setNames(updatedNames);
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: '30px' }}>Name List</h2>
      <ul className="list-group" style={{ marginBottom: '30px' }}>
        {names.map((name, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {name}
            <button className="btn btn-danger" onClick={() => handleDelete(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NameList;
