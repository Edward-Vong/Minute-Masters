import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    // Check if the timer was running before the page was refreshed
    const storedStartTime = localStorage.getItem('startTime');
    if (localStorage.getItem('running')) {
        
      const storedElapsedTime = Date.now() - storedStartTime;
      localStorage.setItem('elapsedTime', storedElapsedTime);
      setElapsedTime(storedElapsedTime);
      setTimerRunning(false);

      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    }

    if (!authToken) {
      // Redirect to login if no token is present
      navigate('/login');
    } else {
      // Fetch timer data when the component mounts
      fetchTimerData();
    }

    // Cleanup the interval and save timer data when the component unmounts or beforeunload
    return () => {
      clearInterval(intervalRef.current);
      saveTimerData();
    };
  }, [navigate]);

  const startTimer = () => {
    if (!timerRunning) {
      const startTime = Date.now() - elapsedTime;
      setTimerRunning(true);
      localStorage.setItem('running', true);
      // Store the start time in localStorage
      localStorage.setItem('startTime', elapsedTime);
      console.log('Start time stored:', startTime.toString);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
      }, 1000);
    }
  };

  const saveTimerData = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/timer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ elapsedTime, timeStopped: Boolean(timerRunning) }),
      });

      // Handle the response
    } catch (error) {
      console.error('Error saving timer data:', error);
    }
  };

  const stopTimer = () => {
    localStorage.setItem('elapsedTime', 0);
    localStorage.setItem('startTime', elapsedTime);
    localStorage.setItem('running', false);
    setTimerRunning(false);
    clearInterval(intervalRef.current);
    // Save timer data when stopping the timer
    saveTimerData();
  };

  const displayTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const fetchTimerData = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/timer', {
        method: 'GET',
        headers: {
          Authorization: authToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.timer.timeStopped) {
          setTimerRunning(true);
          setElapsedTime(data.timer.date - data.timer.elapsedTime);
        } else {
          setElapsedTime(data.timer.elapsedTime);
        }
      } else {
        console.error('Error fetching timer data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching timer data:', error);
    }
  };

  return (
    <div>
      <button onClick={startTimer}>Start Timer</button>
      <button onClick={stopTimer}>Stop Timer</button>
      <button>Reset Timer for Today</button>
      <p id="timerDisplay">Timer: {displayTime(elapsedTime)}</p>
    </div>
  );
}
