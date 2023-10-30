import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom'; // Import MemoryRouter
import FrontPage from './FrontPage';
import MoodPlaylistCreator from './MoodPlaylistCreator';
import SpotifyPage from './SpotifyPage';
import SuccessPage from './SuccessPage';

describe('FrontPage Component', () => {
    it('renders the main landing page', () => {
        render(
            <Router>
                <FrontPage />
            </Router>
        );
        expect(screen.getByText('Welcome to Music Mood Matcher!')).toBeInTheDocument();
    });
    // Add more tests for interactions or other functionalities
});

describe('MoodPlaylistCreator Component', () => {
    it('renders mood selection', () => {
        render(
            <Router>
                <MoodPlaylistCreator />
            </Router>
        );
        expect(screen.getByText('Create a Mood Playlist')).toBeInTheDocument();
    });

    it('fetches tracks based on mood', () => {
        render(
            <Router>
                <MoodPlaylistCreator />
            </Router>
        );
        
        // Using getByText to select the dropdown option directly
        const moodOption = screen.getByText('Happy');
        fireEvent.click(moodOption);

        const fetchTracksButton = screen.getByText('Fetch Tracks');
        fireEvent.click(fetchTracksButton);
        // Add assertions for expected behavior
    });

    // Add more tests for playlist creation and other functionalities
});


describe('SpotifyPage Component', () => {
    it('renders Spotify login', () => {
        render(
            <Router>
                <SpotifyPage />
            </Router>
        );
        expect(screen.getByText('Login with Spotify')).toBeInTheDocument();
    });
    // Add tests for Spotify data fetching and other functionalities
});

describe('SuccessPage Component', () => {
    it('renders success message', () => {
        // Mock the location.state object with a playlistId
        const mockLocationState = {
            state: {
                playlistId: '12345' // Provide a mock playlistId
            }
        };

        render(
            <Router initialEntries={[mockLocationState]}>
                <SuccessPage />
            </Router>
        );

        expect(screen.getByText('Playlist created successfully!')).toBeInTheDocument();
    });

    // Add more tests for interactions or other functionalities
});

