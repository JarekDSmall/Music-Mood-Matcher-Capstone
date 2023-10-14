import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';

// User Components
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';

// Playlist Components
import Playlist from './components/playlist/PlaylistList'; 

// Spotify Components
import SpotifyAuth from './components/spotify/SpotifyLogin'; 

// Pages
import Home from './pages/HomePage';

// Context
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
}

export default App;
