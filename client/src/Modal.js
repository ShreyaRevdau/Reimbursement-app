import React from "react";
import './style/Modal.css';

const Modal = ({ formData, onClose }) => {
    if (!formData) return null; // Ensure formData is not null

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Submission Successful</h2>
                <p>Your data has been submitted successfully.</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td>{formData.email}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{formData.type}</td>
                        </tr>
                        <tr>
                            <td>Amount</td>
                            <td>{formData.amount}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>{formData.date}</td>
                        </tr>
                        <tr>
                            <td>Uploaded File</td>
                            <td>{formData.uploadFile}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={onClose} className="btn btn-danger">Close</button>
            </div>
        </div>
    );
};

export default Modal;
