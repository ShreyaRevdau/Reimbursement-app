import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useHistory for redirecting

function AdminPanel() {
  const [forms, setForms] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState({});
  const navigate = useNavigate();// Initialize useHistory

  useEffect(() => {
    // Fetch all form data
    Axios.get("http://localhost:3001/api/formdata")
      .then((response) => {
        setForms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  }, []);

  const handleAccept = (id) => {
    const confirmed = window.confirm("Are you sure you want to accept this?");
    if (confirmed) {
      setDisabledButtons((prev) => ({ ...prev, [id]: "accepted" }));
      // Perform additional actions such as sending a request to the backend
    }
  };

  const handleReject = (id) => {
    const confirmed = window.confirm("Are you sure you want to reject this?");
    if (confirmed) {
      setDisabledButtons((prev) => ({ ...prev, [id]: "rejected" }));
      // Perform additional actions such as sending a request to the backend
    }
  };

  const handleLogout = () => {
    // Perform logout actions if any
    // For example, clearing local storage or removing authentication tokens
    // Then redirect to login page
    navigate("/");
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Type</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Amount</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Upload File</th>

            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id} style={{ backgroundColor: form.id % 2 === 0 ? "#f2f2f2" : "white" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd",color:"black"  }}>{form.email}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd",color:"black" }}>{form.type}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd",color:"black"  }}>{form.amount}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>{form.date}</td>
              <td>
                {form.uploadFile ? (
                  <a href={`http://localhost:3001/public/image/${form.uploadFile}`} download>
                    Download
                  </a>
                ) : (
                  "No file uploaded"
                )}
              </td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                <button
                  style={{
                    backgroundColor: disabledButtons[form.id] === "accepted" ? "#ccc" : "#28a745",
                    color: "white",
                    padding: "10px",
                    marginRight: "10px",
                    cursor: disabledButtons[form.id] === "accepted" ? "not-allowed" : "pointer",
                  }}
                  disabled={disabledButtons[form.id] === "accepted"}
                  onClick={() => handleAccept(form.id)}
                >
                  Accept
                </button>
                <button
                  style={{
                    backgroundColor: disabledButtons[form.id] === "rejected" ? "#ccc" : "#dc3545",
                    color: "white",
                    padding: "10px",
                    cursor: disabledButtons[form.id] === "rejected" ? "not-allowed" : "pointer",
                  }}
                  disabled={disabledButtons[form.id] === "rejected"}
                  onClick={() => handleReject(form.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
