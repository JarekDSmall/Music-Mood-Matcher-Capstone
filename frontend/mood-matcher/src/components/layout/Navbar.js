import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logoutFromSpotify } = useAuth(); // Ensure you're using the correct logout function name

    const handleLogout = async () => {
        try {
            await logoutFromSpotify(); // Use the correct logout function
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
                        <>
                            <div><Link to="/">Home</Link></div>
                            <div><Link to="/mood-playlist-creator">Playlist Creator</Link></div>
                            <div><Link to="/spotify">Dashboard</Link></div>
                            <div><button onClick={handleLogout}>Logout</button></div> 
                        </>
                    ) : (
                        // No content for unauthenticated users
                        null
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
