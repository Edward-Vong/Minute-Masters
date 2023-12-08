import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./weekday.css";
import LeftArrow from "./arrowL.png";
import RightArrow from "./arrowR.png";

const Calendar = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();

  const [activeMonth, setActiveMonth] = useState("December"); // Initial active month
  const [activeYear, setActiveYear] = useState(currentYear); // Initial active year

  const handleMonthChange = (event) => {
    setActiveMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setActiveYear(parseInt(event.target.value, 10));
  };

  const getDaysInMonth = (month, year) => {
    const firstDayOfMonth = new Date(year, months.indexOf(month), 1).getDay();
    const daysInMonth = new Date(year, months.indexOf(month) + 1, 0).getDate();
  
    const leadingEmptyDays = (firstDayOfMonth) % 7; // Adjust to start from Sunday
  
    // Calculate trailing (ending) empty days
    const lastDayOfMonth = new Date(year, months.indexOf(month) + 1, 0).getDay();
    const endingEmptyDays = (6 - lastDayOfMonth) % 7;
  
    const prevMonthLastDate = new Date(year, months.indexOf(month), 0).getDate();
  
    // Generate arrays for the days of the previous month, current month, and next month
    const prevMonthDays = Array.from({ length: leadingEmptyDays }, (_, i) => prevMonthLastDate - leadingEmptyDays + i + 1);
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const nextMonthDays = Array.from({ length: endingEmptyDays }, (_, i) => i + 1);
  
    // Combine all arrays to get the total array of days
    const totalDays = prevMonthDays.concat(currentMonthDays, nextMonthDays);
  
    return totalDays;
  };

  const handlePrevMonth = () => {
    const currentIndex = months.indexOf(activeMonth);
    const newMonth = currentIndex === 0 ? months[11] : months[currentIndex - 1];
    const newYear = currentIndex === 0 ? activeYear - 1 : activeYear;
  
    setActiveMonth(newMonth);
    setActiveYear(newYear);
  };
  
  const handleNextMonth = () => {
    const currentIndex = months.indexOf(activeMonth);
    const newMonth = currentIndex === 11 ? months[0] : months[currentIndex + 1];
    const newYear = currentIndex === 11 ? activeYear + 1 : activeYear;
  
    setActiveMonth(newMonth);
    setActiveYear(newYear);
  };

  const daysInMonth = getDaysInMonth(activeMonth, activeYear);

  let oneCount = 0;

  return (
    <div className="dropdown-menu d-block position-static p-2 mx-0 shadow rounded-3 w-340px" data-bs-theme="light">
      <div className="d-grid gap-1">
        <div className="cal">
            <div className="cal-month d-flex align-items-center">
                {/* Month navigation buttons */}
                <button className="btn me-2" type="button" onClick={handlePrevMonth}>
                    <img src={LeftArrow} className="bi" width="16" height="16"/>
                </button>
                
                {/* Month selection dropdown */}
                <select className="form-select me-2 cal-month-name" value={activeMonth} onChange={handleMonthChange}>
                    {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                    ))}
                </select>

                {/* Year selection input */}
                <input
                    type="number"
                    className="form-control me-2 cal-year-input"
                    value={activeYear}
                    onChange={handleYearChange}
                />

                <button className="btn" type="button" onClick={handleNextMonth}>
                    <img src={RightArrow} className="bi" width="16" height="16"/>
                </button>
            </div>

          {/* Weekdays */}
          <div className="cal-weekdays text-body-secondary">
            {daysOfWeek.map((weekday) => (
              <div key={weekday} className="cal-weekday">{weekday}</div>
            ))}
          </div>

          {/* Days */}
          <div className="cal-days">
            {daysInMonth.map((day, index) => {
              let isDisabled = true;

              if (day > 1 && oneCount === 1) {
                isDisabled = false;
              }

              if (day === 1) {
                oneCount++;
                isDisabled = false;
              }

              if (oneCount > 1) {
                isDisabled = true;
              } 

              return (
                <button
                  key={index}
                  className={`btn cal-btn ${isDisabled ? 'disabled' : ''}`}
                  type="button"
                  disabled={isDisabled}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
