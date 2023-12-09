import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TimesheetForm = ({ selectedDate, onClose }) => {
  const [formData, setFormData] = useState({
    date: selectedDate ? `${selectedDate.day} ${selectedDate.month} ${selectedDate.year}` : '',
    checkIn: '',
    checkOut: '',
  });

  const [isCheckIn, setIsCheckIn] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [totalTime, setTotalTime] = useState("");
  const [isSameAsCurrentDate, setIsSameAsCurrentDate] = useState(false);
  const [hasData, setHasData] = useState(true);
  useEffect(() => {
    // Fetch check-in time when the component mounts
    refreshData();
    checkIfSameAsCurrentDate();
  }, [selectedDate]); // Trigger when selectedDate changes

  const refreshData = async () => {
    await getCheckInTime();
    checkIfSameAsCurrentDate();
  };

  const getCheckInTime = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/timesheet', {
        method: 'GET',
        headers: {
          Authorization: authToken,
        },
      });

      const monthNameToNumber = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
      };
  
      const selectedDateObject = new Date(
        selectedDate.year,
        monthNameToNumber[selectedDate.month],
        selectedDate.day
      );
      let data = null;
      if (response.ok) {
        const dataArray = await response.json();
        dataArray.timerData.forEach(dataVal => {
          console.log(dataVal.date);
          const dataDate = new Date(dataVal.date);
          console.log(dataDate); // Log the parsed date
        
          const selectedDateUTC = new Date(
            Date.UTC(
              selectedDateObject.getUTCFullYear(),
              selectedDateObject.getUTCMonth(),
              selectedDateObject.getUTCDate(),
              selectedDateObject.getUTCHours(),
              selectedDateObject.getUTCMinutes(),
              selectedDateObject.getUTCSeconds(),
              selectedDateObject.getUTCMilliseconds()
            )
          );
        
          if (
            selectedDateUTC.getUTCFullYear() === dataDate.getUTCFullYear() &&
            selectedDateUTC.getUTCMonth() === dataDate.getUTCMonth() &&
            selectedDateUTC.getUTCDate() === dataDate.getUTCDate()
          ) {
            data = dataVal;
          }
        });
        


        if(data != null)
        {
          console.log(data.startDate != null);
          if (data.startDate != null) {
            setIsCheckIn(false);
            const checkInDate = new Date(data.startDate);
            setStartDate(checkInDate);
            setCheckInTime(checkInDate.toLocaleTimeString()); // Format the time as a string
            setFormData((prevFormData) => ({
              ...prevFormData,
              checkIn: checkInDate.toISOString(),
          }));
          } else {
            setCheckInTime(null);
            const milliseconds = data.totalTime;

            const hours = Math.floor(milliseconds / (1000 * 60 * 60));
            const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

            const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
            setTotalTime(formattedTime);
            console.log("here");
            setHasData(true);
          }
        }
        else
        {
          setHasData(false);
        }

        
      }
    } catch (error) {
      console.error('Error getting start check-in data:', error);
    }
  };

  const saveCheckInTime = async () => {
    const currentDate = new Date();
    console.log(currentDate);
    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/timesheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          startDate: currentDate,
        }),
      });

      // Handle the response
      if (response.ok) {
        console.log('Check-in date saved successfully.');
        // You can perform additional actions here if needed
        refreshData(); // Refresh data after saving check-in time
      } else {
        console.error('Error saving check-in date:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving check-in date:', error);
    }
  };

  const setCheckOutTime = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/timesheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({
          startDate: null,
          totalTime: Date.now() - Date.parse(startDate),
        }),
      });
        console.log(Date.now() - Date.parse(startDate));
        console.log(Date.parse(startDate));
      // Handle the response
      if (response.ok) {
        console.log('Check-out date and time difference saved successfully.');
        setIsCheckIn(true);
        refreshData();
        // You can perform additional actions here if needed
      } else {
        console.error('Error saving check-out date and time difference:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving check-out date and time difference:', error);
    }
  };

  const checkIfSameAsCurrentDate = () => {
    const currentDate = new Date();
   // console.log(currentDate);
    const monthNameToNumber = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const selectedDateObject = new Date(
      selectedDate.year,
      monthNameToNumber[selectedDate.month],
      selectedDate.day
    );

    setIsSameAsCurrentDate(
      selectedDateObject.getFullYear() === currentDate.getFullYear() &&
      selectedDateObject.getMonth() === currentDate.getMonth() &&
      selectedDateObject.getDate() === currentDate.getDate()
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleToggleCheckInOut = () => {
    if (!isSameAsCurrentDate) {
      return; // Disable for dates other than the current date
    }
    console.log(isCheckIn);
    if(isCheckIn)
    {
      setIsCheckIn(false);
    }
    else
    {
      setIsCheckIn(true);
    }

    if (!isCheckIn) {
      
      setCheckOutTime();
      //getCheckInTime();
    } else {
      saveCheckInTime();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  return (
    <div className="dropdown-menu d-block position-static p-2 mx-0 shadow rounded-3 w-340px" data-bs-theme="light">
      <div className="overlay">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date:
            </label>
            <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {selectedDate ? `${selectedDate.day} ${selectedDate.month} ${selectedDate.year}` : ''}
            </p>
          </div>

          {/* <div className="mb-3">
            <label htmlFor="checkIn" className="form-label">
              {isCheckIn ? 'Check-in' : 'Check-out'}:
            </label>
            <input
              type="time"
              name={isCheckIn ? 'checkIn' : 'checkOut'}
              value={checkInTime ? checkInTime : '00:00:000'}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled={!isSameAsCurrentDate} // Disable for dates other than the current date
            />
          </div> */}

          <div className="mb-3">
            <label htmlFor="checkInTime" className="form-label">
              Check-in Time:
            </label>
            <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {!isCheckIn && hasData ? checkInTime : 'N/A'}
            </p>
          </div>

            <div className="mb-3">
              <label htmlFor="totalTime" className="form-label">
                Total Time:
              </label>
              <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {hasData ? totalTime : ""}
              </p>
            </div>

          <div className="col text-center">
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  onClick={handleToggleCheckInOut}
                  className={`btn ${isCheckIn ? 'btn-primary' : 'btn-danger'} mb-2`}
                  disabled={!isSameAsCurrentDate} // Disable for dates other than the current date
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
