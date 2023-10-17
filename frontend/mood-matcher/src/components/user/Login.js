import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import '../../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the Spotify authorization URL from the backend when the component mounts
        const fetchSpotifyAuthUrl = async () => {
            try {
                const response = await axios.get('/spotify/auth-url');
                setSpotifyAuthUrl(response.data.authUrl);
            } catch (err) {
                console.error("Failed to fetch Spotify auth URL:", err);
            }
        };

        fetchSpotifyAuthUrl();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError("Failed to log in. Please check your credentials.");
            console.error("Failed to log in:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
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
            {/* Spotify Login Button */}
            {spotifyAuthUrl && (
                <a href={spotifyAuthUrl} className="spotify-login-button">
                    Login with Spotify
                </a>
            )}
        </div>
    );
}

export default Login;
