import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SpotifyLogin from './SpotifyLogin';
import renderer from 'react-test-renderer';
import { AuthContext } from '../../context/authContext';

// Mock the context
const mockLogin = jest.fn();
const mockAuthContext = {
  login: mockLogin,
  isAuthenticated: false,
  // Add other properties and methods as needed by SpotifyLogin component
};

describe('SpotifyLogin Component', () => {
  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <Router>
          <AuthContext.Provider value={mockAuthContext}>
            <SpotifyLogin />
          </AuthContext.Provider>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // ... other tests
});
