import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Login() {
    const [spotifyAuthUrl, setSpotifyAuthUrl] = useState('');

    useEffect(() => {
        const fetchSpotifyAuthUrl = async () => {
            try {
                const response = await axios.get('/spotify/auth-url');
                setSpotifyAuthUrl(response.data.authUrl);
            } catch (err) {
                console.error("Failed to fetch Spotify auth URL:", err);
            }
        };

        fetchSpotifyAuthUrl();
    }, []);

    return (
        <div className="login-container">
            <h2>Login</h2>
            {spotifyAuthUrl && (
                <a href={spotifyAuthUrl} className="spotify-login-button">
                    Login with Spotify
                </a>
            )}
        </div>
    );
}

class HomePage extends React.Component {
    render() {
        return (
            <div className="home-page">
                <header>
                    <h1>Welcome to Music Mood Matcher!</h1>
                </header>
                <main>
                    <p>
                        Discover music that matches your mood. Log in with Spotify to get started.
                    </p>
                    {/* You can add more components or content here */}
                </main>
                <footer>
                    <p>Music Mood Matcher &copy; 2023</p>
                </footer>
            </div>
        );
    }
}

function FrontPage() {
    return (
        <div>
            <HomePage />
            <Login />
        </div>
    );
}

export default FrontPage;
