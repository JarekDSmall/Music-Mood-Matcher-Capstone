import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import '../../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Redirect to dashboard or desired page after successful login
        } catch (error) {
            console.error("Failed to log in:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
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
                <button className="login-button" type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
