import React from 'react';

class HomePage extends React.Component {
    render() {
        return (
            <div className="home-page">
                <header>
                    <h1>Welcome to Music Mood Matcher!</h1>
                </header>
                <main>
                    <p>
                        Discover music that matches your mood. Log in with Spotify to get started.
                    </p>
                    {/* You can add more components or content here */}
                </main>
                <footer>
                    <p>Music Mood Matcher &copy; 2023</p>
                </footer>
            </div>
        );
    }
}

export default HomePage;
