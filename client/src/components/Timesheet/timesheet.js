import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Calendar from "./calendarAssets/calendar"

const Timesheet = () => {
  return (
    <div class="container text-center">
      <div class="row">
        <div class="col-8">
          <Calendar />
        </div>
        <div class="col-4">
          Data Bar
        </div>
      </div>
    </div>
  );
};

export default Timesheet;