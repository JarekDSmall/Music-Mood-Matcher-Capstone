import React, { memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';

// User Components
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';

// Playlist Components
import Playlist from './components/playlist/PlaylistList'; 
import PlaylistCreation from './components/playlist/PlaylistCreation';
import MoodSelection from './components/playlist/MoodSelection';
import GenreSelection from './components/playlist/GenreSelection';

// Spotify Components
import SpotifyAuth from './components/spotify/SpotifyLogin'; 
import SpotifyRedirect from './components/spotify/SpotifyRedirect';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Recommendations from './pages/Recommendations';  // <-- New import

// Context
import { AuthProvider } from './context/authContext';
import { UserProvider } from './context/UserContext'; 
import { PlaylistProvider } from './context/PlaylistContext'; 

import PrivateRouteWrapper from './components/utility/PrivateRouteWrapper';
import ProcessToken from './components/utility/ProcessToken';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <PlaylistProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<PrivateRouteWrapper><Profile /></PrivateRouteWrapper>} />
              <Route path="/playlist" element={<PrivateRouteWrapper><Playlist /></PrivateRouteWrapper>} />
              
              {/* Direct Routes for Playlist Creation */}
              <Route path="/create-playlist" element={<PrivateRouteWrapper><MoodSelection /></PrivateRouteWrapper>} />
              <Route path="/create-playlist/mood" element={<PrivateRouteWrapper><MoodSelection /></PrivateRouteWrapper>} />
              <Route path="/create-playlist/genre" element={<PrivateRouteWrapper><GenreSelection /></PrivateRouteWrapper>} />
              <Route path="/create-playlist/tracks" element={<PrivateRouteWrapper><PlaylistCreation /></PrivateRouteWrapper>} />

              <Route path="/spotify-auth" element={<SpotifyAuth />} />
              <Route path="/spotify-dashboard" element={<SpotifyRedirect />} />
              <Route path="/dashboard" element={<PrivateRouteWrapper><DashboardPage /></PrivateRouteWrapper>} />
              <Route path="/recommendations" element={<PrivateRouteWrapper><Recommendations /></PrivateRouteWrapper>} />  {/* <-- New Route */}
              <Route path="/process-token" element={<ProcessToken />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </PlaylistProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default memo(App);
