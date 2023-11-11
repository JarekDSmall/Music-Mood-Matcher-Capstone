import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import renderer from 'react-test-renderer';
import { AuthContext } from '../../context/authContext'; // Corrected import path

// Mock the auth context
const mockAuthContext = {
  isAuthenticated: false,
  logoutFromSpotify: jest.fn(),
  // Add other properties and methods if needed by Navbar component
};

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuthContext}>
          <Navbar />
        </AuthContext.Provider>
      </Router>
    );
    // Add assertions if needed
  });

  // Snapshot Test
  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <Router>
          <AuthContext.Provider value={mockAuthContext}>
            <Navbar />
          </AuthContext.Provider>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // ... other tests
});
