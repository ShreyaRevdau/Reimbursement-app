import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import '../src/style/UserPage.css';

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user-specific form data
    Axios.get(`http://localhost:3001/form/${username}`)
      .then((response) => {
        setUserData(response.data);
        console.log("Fetched user data:", response.data); // Logging for debugging
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [username]);

  const handleFormButtonClick = () => {
    navigate("/Form");
  };

  const handleLogout = () => {
    // Perform logout actions here, such as clearing session/local storage
    // Then redirect to the login page
    navigate("/");
  };

  return (
    <div className="userPage">
      <h1>Hi {username}</h1>
      <button onClick={handleLogout} className="logoutbtn">Logout</button> {/* Logout button */}
      <h2>Your Data</h2>
      <button onClick={handleFormButtonClick} className='add'>&#43; Add New</button>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Upload File</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
              <td>
                {item.uploadFile ? (
                  <a href={`http://localhost:3001/public/image/${item.uploadFile}`} download>
                    Download
                  </a>
                ) : (
                  "No file uploaded"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;
