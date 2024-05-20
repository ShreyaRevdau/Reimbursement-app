import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './style/Login.css'; // Ensure this path is correct

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
    setErrorMsg("");

    let valid = true;

    if (!validateEmail(username)) {
      setEmailError("Invalid email format or domain. Email must end with @revdau.com.");
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    if (username === "admin@revdau.com" && password === "Admin@123") {
      navigate("/adminPanel");
      return;
    }

    Axios.post("http://localhost:3001/login", {
      email: username,
      password: password,
    })
      .then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
          setErrorMsg("");
        } else if (response.status === 200) {
          navigate(`/user/${username}`);
        } else {
          setErrorMsg("Wrong username or password.");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setLoginStatus("");
        setErrorMsg("Error logging in. Please try again.");
      });
  };

  const handleCloseMsg = () => {
    setErrorMsg("");
  };

  return (
    <div className="login-container">
      <div className="left-side">
      <img src={`${process.env.PUBLIC_URL}/business-people-working-laptop-development_1262-18907.jpg`} alt="People working on laptops" />
      </div>
      <div className="right-side">
        <h2>Login</h2>
        <form className="login-form" onSubmit={login}>
          <div className="input-group">
            <label htmlFor="username">Email <span style={{color:"red"}}>*</span></label>
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
            <label htmlFor="password">Password <span style={{color:"red"}}>*</span></label>
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
          {loginStatus && (
            <h1 style={{color: "red", fontSize: "15px", textAlign: "center", marginTop: "20px"}}>{loginStatus}</h1>
          )}
          {errorMsg && (
            <div>
              <p>{errorMsg}</p>
              <button onClick={handleCloseMsg}>Close</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
