import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TimesheetForm = ({ selectedDate, onClose }) => {
  const [formData, setFormData] = useState({
    date: selectedDate ? `${selectedDate.month} ${selectedDate.day}, ${selectedDate.year}` : '',
    checkIn: '',
    checkOut: '',
  });

  

  const [isCheckIn, setIsCheckIn] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleCheckInOut = () => {
    setIsCheckIn(!isCheckIn);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission, e.g., send data to the server or update state
    console.log({ ...formData, ...selectedDate });
    onClose(); // Close the form after submission
  };

  return (
    <div className="dropdown-menu d-block position-static p-2 mx-0 shadow rounded-3 w-340px" data-bs-theme="light">
      <div className="overlay">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label" >
              Date:
            </label>
            {/* Display formatted and larger date underneath the label */}
            <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {selectedDate ? `${selectedDate.day} ${selectedDate.month} ${selectedDate.year}` : ''}
            </p>
          </div>

          <div className="mb-3">
            <label htmlFor="checkIn" className="form-label">
              {isCheckIn ? 'Check-in' : 'Check-out'}:
            </label>
            <input
              type="time"
              name={isCheckIn ? 'checkIn' : 'checkOut'}
              value={isCheckIn ? formData.checkIn : formData.checkOut}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          {/* <div className="mb-3">
            <label htmlFor="timeWorked" className="form-label">
              Amount time worked:
            </label>
            <input
              type="text"
              name="timeWorked"
              value={formData.timeWorked}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div> */}

          <div className="col text-center">
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  onClick={handleToggleCheckInOut}
                  className={`btn ${isCheckIn ? 'btn-primary' : 'btn-danger'} mb-2`}
                >
                  {isCheckIn ? 'Check-in' : 'Check-out'}
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <a href="#" className="btn btn-link text-dark mb-2">
                  Submit
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetForm;
