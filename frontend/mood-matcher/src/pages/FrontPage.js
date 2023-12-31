import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import '../styles/FrontPage.css';
import '../styles/Login.css';

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
            <h2 className="login-title">Login</h2>
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
                <header className="home-header">
                    <h1>Welcome to Music Mood Matcher!</h1>
                </header>
                <main className="home-main">
                    <p>
                        Discover music that matches your mood. Log in with Spotify to get started.
                    </p>
                    <h3>What is Music Mood Matcher?</h3>
                    <p>
                        Music Mood Matcher is a unique tool that curates playlists based on your current mood. Whether you're feeling happy, sad, energetic, or relaxed, we've got the perfect tracks to accompany your emotions.
                    </p>
                    <h3>How to use:</h3>
                    <ol className="home-instructions">
                        <li>Login with your Spotify account.</li>
                        <li>Select your current mood from the provided options.</li>
                        <li>Adjust the intensity of your mood using the slider.</li>
                        <li>Hit "Fetch Tracks" to get the list of songs that match your mood choice.</li>
                        <li>Click "Create Playlist"</li>
                        <li>The tracks will be curated in to a playlist called Mood Playlist depending on your mood! </li>
                        <li>Once created you can click the link to open the playlit on Spotify!</li>
                    </ol>
                </main>
                <footer className="home-footer">
                    <p>Music Mood Matcher &copy; 2023</p>
                </footer>
            </div>
        );
    }
}

function FrontPage() {
    const { isAuthenticated } = useAuth(); // Use the useAuth hook

    return (
        <div className="front-page-container">
            <HomePage />
            {!isAuthenticated && <Login />} {/* Render Login only if not authenticated */}
        </div>
    );
}

export default FrontPage;
