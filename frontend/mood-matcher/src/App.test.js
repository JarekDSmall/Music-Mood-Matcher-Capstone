import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main landing page', () => {
  render(<App />);
  const mainText = screen.getByText('Welcome to Music Mood Matcher!');
  expect(mainText).toBeInTheDocument();
});
