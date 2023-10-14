import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';

// User Components
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';

// Playlist Components
import Playlist from './components/playlist/PlaylistList'; // Assuming you have a PlaylistList component for listing playlists

// Spotify Components
import SpotifyAuth from './components/spotify/SpotifyLogin'; // Assuming SpotifyLogin is the component for Spotify authentication

// Pages
import Home from './pages/HomePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/spotify-auth" element={<SpotifyAuth />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
