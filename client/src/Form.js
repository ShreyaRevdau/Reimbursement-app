import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import '../src/style/Form.css';

function Form({ username, setModalOpen }) {
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch email from local storage
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const validateInputs = () => {
        if (!email || !type || !amount || !date || !file) {
            toast.error("All fields are required.");
            return false;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const upload = () => {
        if (!validateInputs()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("type", type);
        formData.append("amount", amount);
        formData.append("date", date);
        formData.append("uploadFile", file);

        axios.post('http://localhost:3001/api/form', formData)
            .then((response) => {
                console.log("Response data:", response.data.affectedRows);
                if (response.data.affectedRows === 1) {
                    if (response.data.protocol41 === true) {
                        setFormData({ email, type, amount, date, uploadFile: file.name });
                        toast.success("Data submitted successfully");
                        setTimeout(() => {
                            setShowModal(true);
                        }, 1000);

                        const id = response.data.id;
                        updateStatus(id, "pending");
                    } else {
                        toast.error("Data submitted successfully, but there was an issue with the server response.");
                    }
                } else {
                    toast.error("Error: Unexpected status code received.");
                }
            })
            .catch(err => {
                console.error("Error submitting data:", err.response ? err.response.data : err.message);
                toast.error("Error: Data is not submitted");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const updateStatus = (id, status) => {
        axios.put(`http://localhost:3001/api/form/${id}`, { status })
            .then((response) => {
                console.log("Status updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating status:", error);
            });
    };

    const handleClose = () => {
        setModalOpen(false);
    };
    
    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container">
            <ToastContainer />
            {showModal && <Modal formData={formData} onClose={handleClose} />}
            <div className="form-container">
                <div className="row">
                    <button onClick={handleClose} className="btn btn-danger">X Close</button>
                    <div className="col-12">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder='Enter Email' 
                            autoComplete='off'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Type</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder='Enter Type' 
                            autoComplete='off'
                            value={type}
                            onChange={(e) => setType(e.target.value)} 
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Amount</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder='Enter Amount' 
                            autoComplete='off'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)} 
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Date</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            placeholder='Enter Date' 
                            autoComplete='off'
                            value={date}
                            onChange={(e) => setDate(e.target.value)} 
                            max= {today}
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Upload File</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            onChange={(e) => setFile(e.target.files[0])} 
                        />
                    </div>
                    <div className="col-12">
                        <button 
                            className="btn btn-primary" 
                            onClick={upload} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
