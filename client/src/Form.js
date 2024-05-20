import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/Form.css';
import Modal from "./Modal";

function Form({ username }) { // Accept username as a prop
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const validateInputs = () => {
        if (!email || !type || !amount || !date || !file) {
            window.alert("All fields are required.");
            return false;
        }
        // Email format validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            window.alert("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const upload = () => {
        if (!validateInputs()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username); // Include username
        formData.append("type", type);
        formData.append("amount", amount);
        formData.append("date", date);
        formData.append("uploadFile", file);

        axios.post('http://localhost:3001/api/form', formData)
            .then((response) => {
                console.log("Response status:", response.status);
                console.log("Response data:", response.data);

                if (response.status === 200) {
                    if (response.data.Status === 'Success') {
                        setFormData({ email, type, amount, date, uploadFile: file.name });
                        setShowModal(true);
                        window.alert("File Successfully Uploaded");
                    } else {
                        window.alert("Data submitted successfully, but there was an issue with the server response.");
                    }
                } else {
                    window.alert("Error: Unexpected status code received.");
                }
            })
            .catch(err => {
                console.error("Error submitting data:", err.response ? err.response.data : err.message);
                window.alert("Error: Data is not submitted");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleClose = () => {
        setShowModal(false);
        navigate('/UserPage');
    };

    return (
        <div className="container">
            {showModal && <Modal formData={formData} onClose={handleClose} />}
            <div className="form-container">
                <div className="row">
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
