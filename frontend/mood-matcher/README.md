# Music Mood Matcher

Music Mood Matcher is a full-stack application that matches users with playlists based on their mood. It integrates with the Spotify API to fetch user's top tracks and create mood-based playlists.

## Features

- User authentication and registration.
- Integration with Spotify API using OAuth2.0.
- Fetch user's top tracks from Spotify.
- Match songs with moods to create mood-based playlists.

## API Endpoints

### User Routes:
- POST `/users/register`: Register a new user.
- POST `/users/login`: Authenticate and log in a user.
- GET `/users/profile`: Fetch the authenticated user's profile.
- PUT `/users/profile`: Update the authenticated user's profile.
- DELETE `/users/delete`: Delete the authenticated user's account.

### Song Routes:
- POST `/add-to-playlist`: Add a song to the user's playlist.
- DELETE `/remove-from-playlist`: Remove a song from the user's playlist.

### Playlist Routes:
- POST `/create`: Create a new playlist.
- GET `/`: Fetch all playlists for a user.
- PUT `/:playlistId`: Update a playlist's details.
- DELETE `/:playlistId`: Delete a playlist.
- POST `/:playlistId/add-songs`: Add songs to a playlist.
- POST `/:playlistId/remove-songs`: Remove songs from a playlist.
- GET `/:playlistId`: View a specific playlist.

### Spotify Routes:
- GET `/spotify/login`: Initiate OAuth2.0 flow with Spotify.
- GET `/spotify/callback`: Callback route for Spotify authentication.
- GET `/spotify/top-tracks`: Fetch user's top tracks from Spotify.
- POST `/spotify/disconnect`: Disconnect from Spotify in your app.
- POST `/spotify/refresh-token`: Refresh the Spotify access token using the refresh token.



## Setup and Installation

### Prerequisites:
- Node.js and npm installed on your machine.
- MongoDB set up and running.
- A Spotify Developer account to obtain API keys.

### Steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/[JarekDSmall]/Music-Mood-Matcher-Capstone.git
   cd mood-matcher
2. **Install Dependencies:**
    ```
    cd backend
    npm install
    
    cd frontend/mood-matcher
    npm install

3. **Environment Variables:**
In the backend directory, create a `.env` file and fill in the necessary environment variables
```MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SESSION_SECRET=your_session_secret_key
```
4. **Run the Backend Server**
    ```npm start
5. **Run the Frontend Server**
    ```cd frontend/moodmatcher
        npm start
        
6. **Access the Application**
    Open your browser and navigate to `http://localhost:3000` to access the frontend. The backend will be running on `http://localhost:5000`.   