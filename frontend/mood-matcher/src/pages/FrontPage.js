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
                    <h3>What is Music Mood Matcher?</h3>
                    <p>
                        Music Mood Matcher is a unique tool that curates playlists based on your current mood. Whether you're feeling happy, sad, energetic, or relaxed, we've got the perfect tracks to accompany your emotions.
                    </p>
                    <h3>How to use:</h3>
                    <ol>
                        <li>Login with your Spotify account.</li>
                        <li>Select your current mood from the provided options.</li>
                        <li>Adjust the intensity of your mood using the slider.</li>
                        <li>Hit "Fetch Tracks" to get a list of songs that match your mood.</li>
                        <li>Create a playlist with the fetched tracks and enjoy!</li>
                    </ol>
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
