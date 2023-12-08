import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./weekday.css";

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
  
    const totalDays = Array.from({ length: leadingEmptyDays }, (_, i) => '')
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
      .concat(Array.from({ length: endingEmptyDays }, (_, i) => ''));
  
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

  return (
    <div className="dropdown-menu d-block position-static p-2 mx-0 shadow rounded-3 w-340px" data-bs-theme="light">
      <div className="d-grid gap-1">
        <div className="cal">
          <div className="cal-month">
            
            {/* Month navigation buttons */}
            <button className="btn" type="button" onClick={handlePrevMonth}>
                <svg className="bi" width="16" height="16"><use href="#arrow-left-short"></use></svg>
            </button>
            <strong className="cal-month-name">{`${activeMonth} ${activeYear}`}</strong>
            {/* Month selection dropdown */}
            <select className="form-select cal-month-name" value={activeMonth} onChange={handleMonthChange}>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            {/* Year selection input */}
            <input
              type="number"
              className="form-control cal-year-input"
              value={activeYear}
              onChange={handleYearChange}
            />
            <button className="btn" type="button" onClick={handleNextMonth}>
                <svg className="bi" width="16" height="16"><use href="#arrow-right-short"></use></svg>
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
            {daysInMonth.map((day, index) => (
              <button key={index} className={`btn cal-btn ${day === '' ? 'disabled' : ''}`} type="button" disabled={day === ''}>
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
