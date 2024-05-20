import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate } from "react-router-dom";

import './style/Table.css';

const Table = () => {
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/formdata');
      console.log('Fetched data:', response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFormButtonClick = () => {
    navigate("/Form");
  };

  return (
    <div className='table-container'>
      <h2>Reimbersement</h2>
      <button onClick={handleFormButtonClick} className='add'>&#43; Add New</button>
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Upload File</th>
            {/* <th>Emp Name</th> */}
          </tr>
        </thead>
        <tbody>
          {formData.map((row,index)=>{
            return (
            <tr key={index}>
            <td>{row.id}</td>
            <td>{row.type}</td>
            <td>{row.amount}</td>
            <td>{row.date}</td>
            {/* <td>{row.uploadFile}</td> */}
            <td></td>
            {/* <td>{row.empname}</td> */}
            </tr>)
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
