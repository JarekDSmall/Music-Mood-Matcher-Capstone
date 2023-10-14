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
                <ul className="navbar-menu">
                    <li className={location.pathname === "/" ? "active" : ""}>
                        <Link to="/">Home</Link>
                    </li>
                    {!currentUser && (
                        <>
                            <li className={location.pathname === "/login" ? "active" : ""}>
                                <Link to="/login">Login</Link>
                            </li>
                            <li className={location.pathname === "/register" ? "active" : ""}>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                    {currentUser && (
                        <>
                            <li className={location.pathname === "/profile" ? "active" : ""}>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    )}
                    {/* Add more links as needed */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
