import React from 'react';
import axios from 'axios';

function SpotifyLogin() {
  const handleLogin = async () => {
    try {
      const response = await axios.get('/spotify/auth-url');
      const authUrl = response.data.authUrl;
      window.location = authUrl;
    } catch (error) {
      console.error("Error fetching Spotify auth URL:", error);
    }
  };

  return (
    <div className="spotify-login-container">
      <h2>Login with Spotify</h2>
      <button className="spotify-login-button" onClick={handleLogin}>
        Login to Spotify
      </button>
    </div>
  );
}

export default SpotifyLogin;
