import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function SuccessPage() {
    const location = useLocation();
    const navigate = useNavigate(); // Use the useNavigate hook for navigation
    const playlistId = location.state.playlistId;

    const handleSpotifyLogout = () => {
        localStorage.removeItem('spotifyAccessToken'); // Remove the Spotify access token from local storage
        navigate('/');  // Navigate back to the home page
    };

    return (
        <div>
            <h2>Playlist created successfully!</h2>
            <p>You can view it here: <a href={`https://open.spotify.com/playlist/${playlistId}`} target="_blank" rel="noopener noreferrer">Open Playlist</a></p>
            <p><Link to="/spotify">Back to Dashboard</Link></p>
            <button onClick={handleSpotifyLogout}>Logout from Spotify</button> {/* Added logout button */}
        </div>
    );
}

export default SuccessPage;
