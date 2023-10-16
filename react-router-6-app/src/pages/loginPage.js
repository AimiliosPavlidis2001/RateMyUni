import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setIsLoggedIn }) {
    const [academicEmail, setAcademicEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        fetch('https://ratemyuni.onrender.com/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                academicEmail: academicEmail,
                password: password
            }),
        })
        .then(response => response.json())
        .then(result => {
            if(result.message === "Logged in successfully") {
                setIsLoggedIn(true);
                // Store student details in localStorage - will help to autofill create review fields
                localStorage.setItem('academicEmail', result.student.academicEmail);
                localStorage.setItem('universityID', result.student.universityID);
                localStorage.setItem('departmentID', result.student.departmentID);
                alert("You are logged in.");
                navigate('/');
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    };

    return (
        <div className="border login-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Academic Email:</label>
                    <input 
                        type="email" 
                        name="academicEmail"
                        value={academicEmail} 
                        onChange={e => setAcademicEmail(e.target.value)}
                        required 
                    />
                </div>

                <div className="input-container">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <div className="submit-container">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;