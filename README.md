# Music Mood Matcher

Music Mood Matcher is a full-stack application that matches users with playlists based on their mood. It integrates with the Spotify API to fetch user's top tracks and create mood-based playlists.

**Live Demo:** [Music Mood Matcher Live Site](https://music-mood-matcher-a141b863e4d9.herokuapp.com/)

## Features

- User authentication and registration.
- Integration with Spotify API using OAuth2.0.
- Fetch user's top tracks from Spotify.
- Match songs with moods to create mood-based playlists.

## Technology Stack
- Frontend: React, styled-components
- Backend: Node.js, Express.js
- APIs: Spotify API
- Database: MongoDB (assumed based on the backend setup)
- Testing: Jest for backend and frontend testing

## Getting Started

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
    ```npm start```
5. **Run the Frontend Server**
    ```
    cd frontend/mood-matcher
    npm start
    ```
        
6. **Access the Application**
    Open your browser and navigate to `http://localhost:3000` to access the frontend. The backend will be running on `http://localhost:5000`.


## Usage
### How to use Music Mood Matcher:
1. **Login: Start by logging in with your Spotify account.**
2. **Select Your Mood: Choose your current mood from the provided options.**
3. **Adjust Mood Intensity: Use the slider to adjust the intensity of your mood.**
4. **Fetch Tracks: Click on "Fetch Tracks" to retrieve a list of songs that match your selected mood.**
5. **Create Playlist: After fetching the tracks, click "Create Playlist" to curate them into a playlist.**
6. **Enjoy Your Mood Playlist: The tracks will be compiled into a playlist named "Mood Playlist" based on your mood selection.**
7. **Access Playlist on Spotify: Once the playlist is created, you can click the provided link to open and enjoy it directly on Spotify!**

With these simple steps, Music Mood Matcher offers a seamless and personalized music experience, tailoring your playlist to perfectly match your mood at any moment.

## Testing
### Backend Testing
The backend tests for the Music Mood Matcher application are designed to ensure the functionality of the server, including API endpoints and database interactions. The testing framework used is Jest.

To run the backend tests, follow these steps:
1. **Navigate to the backend directory**
   ```
   cd backend
   ```
2. **Run the tests using npm**
   ```
   npm test
   ```

## Frontend Testing
Frontend tests focus on the React components and the overall user interface. The application uses React Testing Library for these tests.

To execute the frontend tests, do the following:
1. **Navigate to the frontend directory**
    ```
    cd frontend/mood-matcher
   ```
2. **Run the tests using npm**
   ```
   npm test
   ```

 ## Acknowledgments
Special thanks to Jim Rudolf for his invaluable guidance and support throughout the development of this project.

## Contact Information
For any inquiries, support, or feedback regarding the Music Mood Matcher, feel free to reach out via email at [small.jarek@gmail.com](mailto:small.jarek@gmail.com)
