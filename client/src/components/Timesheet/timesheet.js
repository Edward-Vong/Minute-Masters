import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./calendarAssets/calendar"
import TimesheetForm from "./timesheetFormAssets/timesheetForm";

const Timesheet = () => {
  return (
    <div class="container text-center">
      <div class="row">
        <div class="col-8">
          <Calendar />
        </div>
        <div class="col-4">
          <TimesheetForm />
        </div>
      </div>
    </div>
  );
};

export default Timesheet;