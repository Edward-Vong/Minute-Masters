import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';
import { useNavigate } from "react-router";

export default function App() {
  const [form, setForm] = useState({
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
  const onSubmit = async (e) => {
    e.preventDefault();
  
    // When a post request is sent to the create URL, we'll add a new record to the database.
    const newPerson = { ...form };
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });
  
      if (!response.ok) {
        console.error('Failed to log in');
        return;
      }
  
      const { token } = await response.json();
      localStorage.setItem('token', token); // Storing the token in local storage
      localStorage.removeItem('token');
      setForm({ emailAddress: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:5000/', {
        headers: {
          Authorization: token,
        },
      });

      const { success, user, message } = response.data;

      if (success) {
        console.log('User info:', user);
      } else {
        console.error('Failed to fetch user info:', message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const mainStyle = {
            // Define your styles here
            // For example:
            backgroundColor: "#f0f0f0",
            padding: "20px",
            maxWidth: "400px"
        };
    
        return (
        <main style={mainStyle} className="form-signin d-flex align-items-center" onSubmit={onSubmit}>
            <form className="w-100">
                <h1 className="h3 mb-3 fw-normal">Login</h1>
                <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={form.emailAddress} onChange={(e)=>updateForm({emailAddress: e.target.value})}/>
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password" placeholder="Password" value={form.password} onChange={(e)=> updateForm({password: e.target.value})}/>
                    <label htmlFor="password">Password</label>
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
  // return (
  //   <div>
  //     <h1>Login and Registration Page</h1>
  //     <div>
  //       <h2>Register</h2>
  //       <input
  //         type="text"
  //         placeholder="Username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //       />
  //       <input
  //         type="password"
  //         placeholder="Password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //       <button onClick={handleRegister}>Register</button>
  //     </div>
  //     <div>
  //       <h2>Login</h2>
  //       <input
  //         type="text"
  //         placeholder="Username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //       />
  //       <input
  //         type="password"
  //         placeholder="Password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //       <button onClick={handleLogin}>Login</button>
  //     </div>
  //     <div>
  //       <h2>Fetch User Info</h2>
  //       <button onClick={fetchUserInfo}>Fetch User Info</button>
  //     </div>
  //   </div>
  // );
}

// export default App;
//     
// };




