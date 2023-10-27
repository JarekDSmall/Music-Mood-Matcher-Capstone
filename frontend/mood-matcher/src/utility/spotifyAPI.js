// You can retrieve the access token dynamically, e.g., from local storage or app state
const getAccessToken = () => {
    return localStorage.getItem('spotifyAccessToken') || 'YOUR_DEFAULT_ACCESS_TOKEN';
  };
  
  export const fetchTopTracks = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      return [];
    }
  };
  
  export const searchTracks = async (query) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  };
  
  export const createPlaylist = async (userId, name, description) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          description: description,
          public: false
        })
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return null;
    }
  };
  