// Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();

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
                    <li className={location.pathname === "/login" ? "active" : ""}>
                        <Link to="/login">Login</Link>
                    </li>
                    <li className={location.pathname === "/register" ? "active" : ""}>
                        <Link to="/register">Register</Link>
                    </li>
                    <li className={location.pathname === "/profile" ? "active" : ""}>
                        <Link to="/profile">Profile</Link>
                    </li>
                    {/* Add more links as needed */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
