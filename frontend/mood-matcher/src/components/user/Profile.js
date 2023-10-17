import React from 'react';
import { useAuth } from '../../context/authContext'; // Import useAuth for user details and logout
import '../../styles/Profile.css';

const Profile = () => {
    const { currentUser, logout } = useAuth(); // Destructure currentUser and logout from useAuth

    return (
        <div className="profile-container">
            <h2 className="profile-info">Profile</h2>
            <p>Name: {currentUser.name}</p>
            <p>Email: {currentUser.email}</p>
            <button className="edit-button">Edit Profile</button>
            <button onClick={logout}>Logout</button> {/* Logout button */}
        </div>
    );
}

export default Profile;
