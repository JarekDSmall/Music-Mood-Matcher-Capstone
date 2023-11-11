import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Adjust the path as necessary
import '../styles/SuccessPage.css';

function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logoutFromSpotify } = useAuth(); // Use logoutFromSpotify from your AuthContext
    const playlistId = location.state.playlistId;

    const handleFullLogout = async () => {
        try {
            logoutFromSpotify(); // Use logoutFromSpotify to log out
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <div className="success-page-container">
            <h2 className="success-page-header">Playlist created successfully!</h2>
            <p>You can view it here: <a href={`https://open.spotify.com/playlist/${playlistId}`} target="_blank" rel="noopener noreferrer" className="success-page-link">Open Playlist</a></p>
            <p><Link to="/spotify" className="back-to-dashboard-link">Back to Dashboard</Link></p>
            <button onClick={handleFullLogout} className="success-page-button">Logout from Spotify</button>
        </div>
    );
}

export default SuccessPage;
