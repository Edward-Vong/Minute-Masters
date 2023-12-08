import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
//import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function App() {
  const [form, setForm] = useState({
    userName: "",
    emailAddress: "",
    password: "",
  });
  const navigate = useNavigate();
  
  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
  
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };
  
    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  
    setForm({ userName: "", emailAddress: "", password: "" });
    navigate("/login");
  }
  
  const mainStyle = {
      // Define your styles here
      // For example:
      backgroundColor: "#f0f0f0",
      padding: "20px",
      maxWidth: "400px"
  };
  
  return (
  <main style={mainStyle} className="form-signin d-flex align-items-center">
      <form className="w-100 max-width-form" onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Register</h1>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Your Full Name"
            value={form.userName}
            onChange={(e)=>updateForm({ userName: e.target.value })}
          />
          <label htmlFor="userName">Full Name</label>
        </div>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="emailAddress"
            placeholder="name@example.com"
            value={form.emailAddress}
            onChange={(e)=>updateForm({ emailAddress: e.target.value })}
          />
          <label htmlFor="email">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>updateForm({ password: e.target.value })}
          />
          <label htmlFor="password">Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <p className="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
      </form>
  </main>
  );
};

