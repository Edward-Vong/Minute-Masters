import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import RightArrow from "../../Timesheet/calendarAssets/arrowR.png";

const ManageGroupLeft = () => {
    return (
        <div className="container">
            <h2 className="text-left" style={{ marginBottom: '10px' }}>Manage Group</h2>
            <h3 className="text-left" style={{ marginBottom: '30px' }}>Group Name Here</h3>
            
            <h3 className="text-left">Group Name:</h3>
            <form className="d-flex" style={{ marginBottom: '30px' }}>
                <input className="form-control me-2" placeholder="New Name" aria-label="groupName" />
                <button className="btn" style={{ marginLeft: '5px' }}>
                    <img src={RightArrow} className="bi" width="16" height="18" alt="Right Arrow" />
                </button>
            </form>
            <h3 className="text-left">Add Code:</h3>
            <h5 className="text-left">SOME CODE HERE</h5>
        </div>
    );
};

export default ManageGroupLeft;