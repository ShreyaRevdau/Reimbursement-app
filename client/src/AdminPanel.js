// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useHistory for redirecting

// function AdminPanel() {
//   const [forms, setForms] = useState([]);
//   const [total,setTotal] = useState(0);
//   const [disabledButtons, setDisabledButtons] = useState({});
//   const navigate = useNavigate();// Initialize useHistory

//   useEffect(() => {
//     // Fetch all form data
//     Axios.get("http://localhost:3001/api/formdata")
//       .then((response) => {
//         setForms(response.data);

//         let sum = 0;
//         response.data.forEach((data)=>{
//           sum += data.amount;
//         });

//         setTotal(sum);
//         console.log(sum);
//       })
//       .catch((error) => {
//         console.error("Error fetching form data:", error);
//       });
//   }, []);

//   const handleAccept = (id) => {
//     const confirmed = window.confirm("Are you sure you want to accept this?");
//     if (confirmed) {
//       setDisabledButtons((prev) => ({ ...prev, [id]: "accepted" }));
//       // Perform additional actions such as sending a request to the backend
//     }
//   };

//   const handleReject = (id) => {
//     const confirmed = window.confirm("Are you sure you want to reject this?");
//     if (confirmed) {
//       setDisabledButtons((prev) => ({ ...prev, [id]: "rejected" }));
//       // Perform additional actions such as sending a request to the backend
//     }
//   };

//   const handleLogout = () => {
//     // Perform logout actions if any
//     // For example, clearing local storage or removing authentication tokens
//     // Then redirect to login page
//     navigate("/");
//   };

//   return (
//     <div>
//       <h1>Admin Panel</h1>
//       <button onClick={handleLogout}>Logout</button>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Type</th>
//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Amount</th>
//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Upload File</th>

//             <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {forms.map((form) => (
//             <tr key={form.id} style={{ backgroundColor: form.id % 2 === 0 ? "#f2f2f2" : "white" }}>
//               <td style={{ padding: "10px", border: "1px solid #ddd",color:"black"  }}>{form.email}</td>
//               <td style={{ padding: "10px", border: "1px solid #ddd",color:"black" }}>{form.type}</td>
//               <td style={{ padding: "10px", border: "1px solid #ddd",color:"black"  }}>{form.amount}</td>
//               <td style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>{form.date}</td>
//               <td>
//                 {form.uploadFile ? (
//                   <a href={`http://localhost:3001/public/image/${form.uploadFile}`} download>
//                     Download
//                   </a>
//                 ) : (
//                   "No file uploaded"
//                 )}
//               </td>
//               <td style={{ padding: "10px", border: "1px solid #ddd" }}>
//                 <button
//                   style={{
//                     backgroundColor: disabledButtons[form.id] === "accepted" ? "#ccc" : "#28a745",
//                     color: "white",
//                     padding: "10px",
//                     marginRight: "10px",
//                     cursor: disabledButtons[form.id] === "accepted" ? "not-allowed" : "pointer",
//                   }}
//                   disabled={disabledButtons[form.id] === "accepted"}
//                   onClick={() => handleAccept(form.id)}
//                 >
//                   Accept
//                 </button>
//                 <button
//                   style={{
//                     backgroundColor: disabledButtons[form.id] === "rejected" ? "#ccc" : "#dc3545",
//                     color: "white",
//                     padding: "10px",
//                     cursor: disabledButtons[form.id] === "rejected" ? "not-allowed" : "pointer",
//                   }}
//                   disabled={disabledButtons[form.id] === "rejected"}
//                   onClick={() => handleReject(form.id)}
//                 >
//                   Reject
//                 </button>
//               </td>
//             </tr>
            
//           ))}
//           <tr>
//               <td>total</td>
//               <td>{total}</td>
//             </tr>

//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AdminPanel;


import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom"; 
import '../src/style/AdminPanel.css';

function AdminPanel() {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [total, setTotal] = useState(0);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:3001/api/formdata")
      .then((response) => {
        setForms(response.data);
        setFilteredForms(response.data);
        let sum = 0;
        response.data.forEach((data) => {
          sum += data.amount;
        });
        setTotal(sum);
        console.log(sum);
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  }, []);

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    if (e.target.value === "") {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter((form) =>
        form.email.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredForms(filtered);
    }
  };


  const handleAccept = (id) => {
    const confirmed = window.confirm("Are you sure you want to accept this?");
    if (confirmed) {
        Axios.post(`http://localhost:3001/api/formdata/${id}/accept`)
            .then((response) => {
                console.log(`Accepted form with id: ${id}`);
                setDisabledButtons((prev) => ({ ...prev, [id]: "accepted" }));
                setForms((prevForms) => 
                    prevForms.map((form) => 
                        form.id === id ? { ...form, status: "accepted" } : form
                    )
                );
            })
            .catch((error) => {
                console.error("Error accepting form:", error);
            });
    }
};


  const handleReject = (id) => {
    const confirmed = window.confirm("Are you sure you want to reject this?");
    if (confirmed) {
        Axios.post(`http://localhost:3001/api/formdata/${id}/reject`)
            .then((response) => {
                console.log(`Rejected form with id: ${id}`);
                setDisabledButtons((prev) => ({ ...prev, [id]: "rejected" }));
                setForms((prevForms) => 
                    prevForms.map((form) => 
                        form.id === id ? { ...form, status: "rejected" } : form
                    )
                );
            })
            .catch((error) => {
                console.error("Error rejecting form:", error);
            });
    }
};

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button className="logoutbtn" onClick={handleLogout}>Logout</button>
      <input
        type="text"
        placeholder="Search by email"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007BFF", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => handleSort("email")}>Username</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => handleSort("type")}>Type</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => handleSort("amount")}>Amount</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", cursor: "pointer" }} onClick={() => handleSort("date")}>Date</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Upload File</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentForms.map((form) => (
            <tr key={form.id} style={{ backgroundColor: form.id % 2 === 0 ? "#f2f2f2" : "white" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>{form.email}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>{form.type}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", color:"black" }}>{form.amount}</td>
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
                  onClick={() => handleAccept(form.id)} 
                  disabled={disabledButtons[form.id] === "accepted"}
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
                  
                  onClick={() => handleReject(form.id)} 
                  disabled={disabledButtons[form.id] === "rejected"}
              >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
      <ul>
        {filteredForms.length > formsPerPage &&
          Math.ceil(filteredForms.length / formsPerPage) > 1 &&
          Array.from({ length: Math.ceil(filteredForms.length / formsPerPage) }, (_, index) => (
            <li key={index}>
              <button onClick={() => paginate(index + 1)}>{index + 1}</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
