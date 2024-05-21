import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import './style/Login.css'; // Ensure this path is correct

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return false;
    }
    const domainPattern = /@revdau\.com$/;
    return domainPattern.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const login = (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    if (!validateEmail(username)) {
      setEmailError("Invalid email format or domain. Email must end with @revdau.com.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.");
      return;
    }
    if (username === "admin@revdau.com" && password === "Admin@123") {
      toast.success("Login Successful!");
      setTimeout(() => {
        navigate("/adminPanel");
        // navigate(`/user/${username}`);
      }, 2000);
      return;
    }
    Axios.post("http://localhost:3001/login", {
      email: username,
      password: password,
    })
      .then((response) => {
        console.log("Response data:", response.data);
        const userData = response.data.find(user => user.username.toLowerCase() === username.toLowerCase() || user.password === password);
        if (userData) {
          toast.success("Login Successful!"); // Display success toast
          setTimeout(() => {
            navigate(`/user/${username}`);
          }, 2000); // Delay navigation by 2 seconds (2000 milliseconds)
        } else {
          toast.error("Wrong username or password.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        toast.error("Error logging in. Please try again.");
      });
    
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <img src={`${process.env.PUBLIC_URL}/business-people-working-laptop-development_1262-18907.jpg`} alt="People working on laptops" />
      </div>
      <div className="right-side">
        <ToastContainer /> {/* ToastContainer component */}
        <h2>Login</h2>
        <form className="login-form" onSubmit={login}>
          <div className="input-group">
            <label htmlFor="username">Email <span style={{ color: "red" }}>*</span></label>
            <input
              className="textInput"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {emailError && <p className="errmsg">{emailError}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password <span style={{ color: "red" }}>*</span></label>
            <input
              className="textInput"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
            />
            {passwordError && <p className="errmsg">{passwordError}</p>}
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          <p className="create-account">
            <Link to="/register" className="createbtn">Create Account</Link>
          </p>
          <p className="social-login">Or login with</p>
          <div className="social-buttons">
            <button type="button" className="social-btn facebook">F</button>
            <button type="button" className="social-btn twitter">T</button>
            <button type="button" className="social-btn google">G</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
