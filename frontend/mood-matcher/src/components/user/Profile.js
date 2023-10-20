import React from 'react';
import { useAuth } from '../../context/authContext';
import '../../styles/Profile.css';
import jwtDecode from 'jwt-decode';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    
    // Extract user-specific data from the decoded token
    const userId = decodedToken.id;
    const userName = decodedToken.name;
    const userEmail = decodedToken.email;

    return (
        <div className="profile-container">
            <h2 className="profile-info">Profile of {userName}</h2>
            <p>ID: {userId}</p>
            <p>Name: {userName}</p>
            <p>Email: {userEmail}</p>
            <button className="edit-button">Edit Profile</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Profile;
