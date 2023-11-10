import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirect to home page after successful logout
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MoodMatcher
                </Link>
                <div className="navbar-links">
                    {isAuthenticated ? (
                        // Links for authenticated users
                        <>
                            <Link to="/">Home</Link>
                            <Link to="/mood-playlist-creator">Playlist Creator</Link>
                            <Link to="/spotify">Dashboard</Link>
                            {/* <button onClick={handleLogout}>Logout</button> */}
                        </>
                    ) : (
                        // Prompt for unauthenticated users
                        <Link to="/spotify-login">Login through Spotify</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
