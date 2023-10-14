import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import '../../styles/Register.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            // Redirect to dashboard or desired page after successful registration
        } catch (error) {
            console.error("Failed to register:", error);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="register-button" type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
