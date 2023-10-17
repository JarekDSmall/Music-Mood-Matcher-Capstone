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
import HomePage from './pages/HomePage';
import DashboardPage from  './pages/DashboardPage';

// Context
import { AuthProvider } from './context/authContext';

import PrivateRouteWrapper from './components/utility/PrivateRouteWrapper';
import ProcessToken from './components/utility/ProcessToken';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRouteWrapper><Profile /></PrivateRouteWrapper>} />
          <Route path="/playlist" element={<PrivateRouteWrapper><Playlist /></PrivateRouteWrapper>} />
          <Route path="/spotify-auth" element={<SpotifyAuth />} />
          <Route path="/dashboard" element={<PrivateRouteWrapper><DashboardPage /></PrivateRouteWrapper>} />
          <Route path="/process-token" element={<ProcessToken />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
