import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/SuccessPage.css';


function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate(); // Use the useNavigate hook for navigation
    const playlistId = location.state.playlistId;

    const handleSpotifyLogout = () => {
        localStorage.removeItem('spotifyAccessToken'); // Remove the Spotify access token from local storage
        navigate('/');  // Navigate back to the home page
    };

    return (
        <div className="success-page-container">
            <h2 className="success-page-header">Playlist created successfully!</h2>
            <p>You can view it here: <a href={`https://open.spotify.com/playlist/${playlistId}`} target="_blank" rel="noopener noreferrer" className="success-page-link">Open Playlist</a></p>
            <p><Link to="/spotify" className="back-to-dashboard-link">Back to Dashboard</Link></p>
            <button onClick={handleSpotifyLogout} className="success-page-button">Logout from Spotify</button>
        </div>
    );
    
}

export default SuccessPage;
