import React from "react";
import { 
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from "./components/home"; // Import your Home component
import Login from "./components/login"; // Import your Login component
import Register from "./components/register"; // Import your Register component
import Navbar from "./components/navbar";
import Timesheet from "./components/Timesheet/timesheet";
 
const App = () => {
 return (
  <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/timesheet" element={<Timesheet />}/>
      </Routes>
  </div>
  
 );
};
 
export default App;