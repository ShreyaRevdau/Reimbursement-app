import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Form from "./Form";
import UserPage from "./UserPage";
import AdminPanel from "./AdminPanel";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path='/register' element={<Register />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path='/form' element={<Form />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
