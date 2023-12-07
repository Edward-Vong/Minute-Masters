import React, { useState, useRef, useEffect } from 'react';
export default function Timer(){
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const intervalRef = useRef(null);

    // export default Timer;
    const startTimer = () => {
        if (!timerRunning) {
        fetchTimerData(); // Fetch timer data when starting the timer
        const startTime = Date.now() - elapsedTime;
        setTimerRunning(true);
    
        intervalRef.current = setInterval(() => {
            const currentTime = Date.now();
            const newElapsedTime = currentTime - startTime;
            setElapsedTime(newElapsedTime);
        }, 1000);
        }
    };
    
    const saveTimerData = async (elapsedTime) => {
        try {
        const authToken = localStorage.getItem('token');
    
        const response = await fetch('http://localhost:5000/timer', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
            },
            body: JSON.stringify({ elapsedTime }),
        });
    
        // Handle the response
        } catch (error) {
        console.error('Error saving timer data:', error);
        }
    };
    const stopTimer = () => {
        setTimerRunning(false);
        clearInterval(intervalRef.current);
    
        // Save timer data when stopping the timer
        saveTimerData(elapsedTime);
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
            setElapsedTime(data.elapsedTime);
          } else {
            console.error('Error fetching timer data:', response.status);
          }
        // Handle the response
        } catch (error) {
        console.error('Error fetching timer data:', error);
        }
    };
    return (
        <div>
          <button onClick={startTimer}>Start Timer</button>
          <button onClick={stopTimer}>Stop Timer</button>
          <p id="timerDisplay">Timer: {displayTime(elapsedTime)}</p>
        </div>
      );
    }