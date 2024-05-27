// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Axios from "axios";
// import Form from "./Form";
// // import '../src/style/UserPage.css';

// function UserPage() {
//   const { username } = useParams();
//   const [userData, setUserData] = useState([]);
//   const [total,setTotal] = useState(0);
//   const [sortedField, setSortedField] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5); // You can adjust the number of items per page
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user-specific form data
//     Axios.get(`http://localhost:3001/form/${username}`)
//       .then((response) => {
//         // Sort the data alphabetically by 'type' field
//         const sortedData = response.data.slice().sort((a, b) => a.type.localeCompare(b.type));
//         setUserData(sortedData);
//         console.log("Fetched and sorted user data:", sortedData); // Logging for debugging
//         let sum = 0;
//         response.data.forEach((data)=>{
//           sum += data.amount;
//         });

//         setTotal(sum);
//         console.log(sum);
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//       });
//   }, [username]);

//   useEffect(() => {
//     // Apply sorting logic whenever sortedField or sortDirection changes
//     if (sortedField) {
//       const sortedData = userData.slice().sort((a, b) => {
//         const comparison = a[sortedField].localeCompare(b[sortedField]);
//         return sortDirection === 'asc' ? comparison : -comparison;
//       });
//       setUserData(sortedData);
//     }
//   }, [sortedField, sortDirection]);

//    // Function to handle status change
//    const handleStatusChange = (id, status) => {
//     setUserData((prevUserData) =>
//       prevUserData.map((form) => (form.id === id ? { ...form, status } : form))
//     );
//   };

//   // Sorting function
//   const handleSort = (field) => {
//     if (sortedField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortedField(field);
//       setSortDirection('asc');
//     }
//   };

//   // Search function
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Filtered and sorted data
//   const sortedData = userData
//     .filter((item) =>
//       searchTerm
//         ? item.type.toLowerCase().includes(searchTerm.toLowerCase())
//         : true
//     )
//     .sort((a, b) => {
//       if (!sortedField) return 0;
//       const comparison = a[sortedField].localeCompare(b[sortedField]);
//       return sortDirection === 'asc' ? comparison : -comparison;
//     });

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const handleFormButtonClick = () => {
//     // navigate("/Form");
//     setModalOpen(true)

//   };

//   const handleLogout = () => {
//     // Perform logout actions here, such as clearing session/local storage
//     // Then redirect to the login page
//     navigate("/");
//   };

//   return (
//     <div className="userPage">
//       {
//         modalOpen && <div className="Modal"><Form setModalOpen={setModalOpen}/></div>
//       }
//       <h1>Hi {username}</h1>
//       <button onClick={handleLogout} className="logoutbtn">Logout</button> {/* Logout button */}
//       <h2>Welcome to Reimbursement DashBoard</h2>
//       <button onClick={handleFormButtonClick} className='add'>&#43; Add New</button>
//       <input
//         type="text"
//         placeholder="Search by type..."
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <table>
//         <thead>
//           <tr>
//           ))}
//       </ul>
//     </div>
//   );
// }

// export default UserPage;//             <th onClick={() => handleSort('type')}>Type</th>
//             <th onClick={() => handleSort('amount')}>Amount</th>
//             <th onClick={() => handleSort('date')}>Date</th>
            

//             <th>Upload File</th>
//             <th onClick={() => handleSort('actionbtn')}>Action</th>

//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.map((item, index) => (
//             <tr key={index}>
//               <td>{item.type}</td>
//               <td>{item.amount}</td>
//               <td>{item.date}</td>
//               <td>
//                 {item.uploadFile ? (
//                   <a href={`http://localhost:3001/public/image/${item.uploadFile}`} download>
//                     Download
//                   </a>
//                 ) : (
//                   "No file uploaded"
//                 )}
//               </td>
//               <td>{item.actionbtn}</td>

//             </tr>
//           ))}
//           <tr>
//                <td>total</td>
//                <td>{total}</td>
//             </tr>
//         </tbody>
//       </table>
//       {/* Pagination */}
//       <ul className="pagination">
//         {Array(Math.ceil(sortedData.length / itemsPerPage))
//           .fill()
//           .map((_, index) => (
//             <li key={index} onClick={() => paginate(index + 1)}>
//               {index + 1}
//             </li>



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Form from "./Form";
//import '../src/style/UserPage.css';

function UserPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState([]);
  const [total, setTotal] = useState(0);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    let ws = new WebSocket('ws://localhost:3002');
    let reconnectInterval;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const { id, status } = JSON.parse(event.data);
      setUserData(prevData => prevData.map(item => item.id === id ? { ...item, status } : item));
      console.log('WebSocket message received:', event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      reconnectInterval = setInterval(() => {
        ws = new WebSocket('ws://localhost:3002');
        ws.onopen = () => {
          clearInterval(reconnectInterval);
          console.log("WebSocket reconnected");
        };
      }, 5000); // Attempt to reconnect every 5 seconds
    };

    Axios.get(`http://localhost:3001/form/${username}`)
      .then((response) => {
        const sortedData = response.data.slice().sort((a, b) => a.type.localeCompare(b.type));
        setUserData(sortedData);
        let sum = 0;
        response.data.forEach((data) => {
          sum += data.amount;
        });
        setTotal(sum);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    return () => {
      ws.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, [username]);

  useEffect(() => {
    if (sortedField) {
      const sortedData = [...userData].sort((a, b) => {
        const comparison = a[sortedField].localeCompare(b[sortedField]);
        return sortDirection === "asc" ? comparison : -comparison;
      });
      setUserData(sortedData);
    }
  }, [sortedField, sortDirection]);

  const handleSort = (field) => {
    if (sortedField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = userData.filter((item) =>
    searchTerm ? item.type.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFormButtonClick = () => {
    setModalOpen(true);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="userPage">
      {modalOpen && <div className="Modal"><Form setModalOpen={setModalOpen} /></div>}
      <h1>Hi {username}</h1>
      <button onClick={handleLogout} className="logoutbtn">Logout</button>
      <h2>Welcome to Reimbursement DashBoard</h2>
      <button onClick={handleFormButtonClick} className="add">&#43; Add New</button>
      <input
        type="text"
        placeholder="Search by type..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("type")}>Type</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("date")}>Date</th>
            <th>Upload File</th>
            <th onClick={() => handleSort("status")}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
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
              <td>{item.status}</td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td>{total}</td>
          </tr>
        </tbody>
      </table>
      <ul className="pagination">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
          <li key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;





