import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

function SpotifyLogin() {
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const fetchAccessToken = async () => {
        try {
          const response = await axios.get(`/spotify/callback?code=${code}`);
          const { token } = response.data;
          if (token) {
            login(token);  // Assuming your login function accepts the token as a parameter
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      };

      fetchAccessToken();
    }
  }, [login]);

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
