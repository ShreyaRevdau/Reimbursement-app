import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/style/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
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

  const register = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setRegisterStatus("");

    let valid = true;

    if (!validateEmail(email)) {
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

    Axios.post("http://localhost:3001/signup", {
      email: email,
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
        toast.error("Registration Failed!");
      } else {
        setRegisterStatus("ACCOUNT CREATED SUCCESSFULLY");
        setEmail("");
        setUsername("");
        setPassword("");
        toast.success("Registration Successful!");
        setTimeout(() => {
          navigate(`/user/${username}`);
        }, 2000); // Delay navigation by 2 seconds
      }
    }).catch((error) => {
      toast.error("Registration Failed!");
    });
  };

  return (
    <div className="registerForm">
      <ToastContainer /> {/* ToastContainer component */}
      <form>
        <h4>Register Here</h4>
        
        <label htmlFor="email">Email Address <span style={{color:"red"}}>*</span></label>
        <input
          className="textInput"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email Address"
          required
        />
        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        
        <label htmlFor="username">Username <span style={{color:"red"}}>*</span></label>
        <input
          className="textInput"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Username"
          required
        />
        
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
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        
        <button className="button" type="button" onClick={register}>
          Create an account
        </button>
        
        <h1
          style={{
            fontSize: "15px",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {registerStatus}
        </h1>
        
        <Link to="/">
          <button className="button" type="button">
            Login
          </button>
        </Link>
      </form>
    </div>
  );
}

export default Register;
