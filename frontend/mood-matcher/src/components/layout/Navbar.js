import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // Redirect to login or home page after successful logout
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
  
            </div>
        </nav>
    );
}

export default Navbar;
