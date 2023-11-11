import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import FrontPage from './FrontPage';
import MoodPlaylistCreator from './MoodPlaylistCreator';
import SpotifyPage from './SpotifyPage';
import SuccessPage from './SuccessPage';
import renderer from 'react-test-renderer';

jest.mock('../context/authContext', () => ({
  useAuth: jest.fn(),
}));

describe('FrontPage Component', () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => ({
            isAuthenticated: true, // Mock the value as per your test requirement
        }));
    });

    it('renders the main landing page', () => {
        render(
            <Router>
                <FrontPage />
            </Router>
        );
        expect(screen.getByText('Welcome to Music Mood Matcher!')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <Router>
                <FrontPage />
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
    // Add more tests for interactions or other functionalities
});

describe('MoodPlaylistCreator Component', () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => ({
            // Mock any necessary auth context values or functions
        }));
    });

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

    it('matches snapshot', () => {
        const tree = renderer.create(
            <Router>
                <MoodPlaylistCreator />
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // Add more tests for playlist creation and other functionalities
});

describe('SpotifyPage Component', () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => ({
            // Mock any necessary auth context values or functions
        }));
    });

    it('renders Spotify login', () => {
        render(
            <Router>
                <SpotifyPage />
            </Router>
        );
        expect(screen.getByText('Login with Spotify')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <Router>
                <SpotifyPage />
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
    // Add tests for Spotify data fetching and other functionalities
});

describe('SuccessPage Component', () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => ({
            logoutFromSpotify: jest.fn(), // Mock function or other values as needed
        }));
    });

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

    it('matches snapshot', () => {
        const mockLocationState = {
            state: {
                playlistId: '12345'
            }
        };

        const tree = renderer.create(
            <Router initialEntries={[mockLocationState]}>
                <SuccessPage />
            </Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    // Add more tests for interactions or other functionalities
});

afterEach(() => {
    jest.clearAllMocks();
});
