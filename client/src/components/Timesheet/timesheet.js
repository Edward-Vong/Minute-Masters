import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./calendarAssets/calendar";
import TimesheetForm from "./timesheetFormAssets/timesheetForm";

const Timesheet = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const openTimesheetForm = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-8">
          <Calendar openTimesheetForm={openTimesheetForm} />
        </div>
        <div className="col-4">
          {selectedDate && (
            <TimesheetForm
              selectedDate={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
