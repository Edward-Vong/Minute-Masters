import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const Register = () => {
    const mainStyle = {
        // Define your styles here
        // For example:
        backgroundColor: "#f0f0f0",
        padding: "20px",
        maxWidth: "400px"
    };

    const formStyle = {
        // Define your styles here
        // For example:
        maxWidth: "400px",
    };

    return (
    <main style={mainStyle} className="form-signin d-flex align-items-center">
        <form className="w-100 max-width-form">
          <h1 className="h3 mb-3 fw-normal">Register</h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingFullName"
              placeholder="Your Full Name"
            />
            <label htmlFor="floatingFullName">Full Name</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>
          <p className="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </form>
    </main>
    );
};

export default Register;


