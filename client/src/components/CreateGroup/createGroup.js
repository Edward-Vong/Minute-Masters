import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import RightArrow from "../Timesheet/calendarAssets/arrowR.png";

const CreateGroup = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    return (
        <div className={`container${isLoggedIn ? '' : ' hidden'}`}>
            {!isLoggedIn && (
                <div className="overlay">
                    <h3>Please login to use this feature</h3>
                </div>
            )}

            {isLoggedIn && (
                <div>
                    <div className="row">
                        <h4>Enter a Group Name:</h4>
                    </div>
                    <div className="row">
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Name" aria-label="Search" />
                            <button className="btn" style={{ marginBottom: '5px' }}>
                                <img src={RightArrow} className="bi" width="16" height="18" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroup;
