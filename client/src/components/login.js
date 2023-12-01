import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

const Login = () => {
    const mainStyle = {
        // Define your styles here
        // For example:
        backgroundColor: "#f0f0f0",
        padding: "20px",
        maxWidth: "400px"
    };

    return (
    <main style={mainStyle} className="form-signin d-flex align-items-center">
        <form className="w-100">
            <h1 className="h3 mb-3 fw-normal">Login</h1>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="form-check text-start my-3">
                <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                    Remember me
                </label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
        </form>
    </main>
    );
};

export default Login;



