import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

function SpotifyLogin() {
  const { login } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        const fetchAccessToken = async () => {
            try {
                const response = await axios.get(`/spotify/callback?code=${code}`);
                const { token } = response.data;
                if (token) {
                    localStorage.setItem('spotifyAuthToken', token);
                    const profile = await fetchSpotifyProfile(token);
                    setUserProfile(profile);
                    console.log("User's Spotify profile:", profile);
                }
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };
        fetchAccessToken();
    }
  }, []);

  const fetchSpotifyProfile = async (token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Spotify profile:", error);
    }
  }

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
        {userProfile ? (
            <div>
                <img src={userProfile.images[0]?.url} alt="User Profile" />
                <h3>{userProfile.display_name}</h3>
            </div>
        ) : (
            <button className="spotify-login-button" onClick={handleLogin}>
                Login to Spotify
            </button>
        )}
    </div>
  );
}

export default SpotifyLogin;
