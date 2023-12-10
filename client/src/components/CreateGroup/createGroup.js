import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import RightArrow from "../Timesheet/calendarAssets/arrowR.png";
import Notification from "../Notification"; // Update the path to your Notification component

const CreateGroup = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // State to hold the input value
    const [groupName, setGroupName] = useState('');
    // State for notification
    const [notification, setNotification] = useState({ message: '', isSuccess: false });

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input (add your own validation logic)
        if (!groupName.trim()) {
            setNotification({ message: 'Please enter a group name.', isSuccess: false });
            return;
        }

        try {
            // Make a POST request to your server with the group name
            const authToken = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/createGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                },
                body: JSON.stringify({ groupName }),
            });

            if (response.ok) {
                // Handle success, e.g., show a success message
                setNotification({ message: 'Group created successfully!', isSuccess: true });
                setGroupName(''); // Clear the input field
            } else {
                // Handle error, e.g., show an error message
                setNotification({ message: 'Error creating group. Please try again.', isSuccess: false });
            }
        } catch (error) {
            console.error('Error creating group:', error);
            setNotification({ message: 'Error creating group. Please try again.', isSuccess: false });
        }
    };

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
                        <form className="d-flex" onSubmit={handleSubmit}>
                            <input
                                className="form-control me-2"
                                placeholder="Name"
                                aria-label="groupName"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                            <button className="btn" style={{ marginBottom: '5px' }} type="submit">
                                <img src={RightArrow} className="bi" width="16" height="18" />
                            </button>
                        </form>
                        {notification.message && (
                            <Notification message={notification.message} isSuccess={notification.isSuccess} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroup;
