const getAccessToken = () => {
    return localStorage.getItem('spotifyAccessToken') || 'YOUR_DEFAULT_ACCESS_TOKEN';
};

const moodAttributes = {
    Happy: { valence: [0.7, 1], energy: [0.5, 1] },
    Sad: { valence: [0, 0.3], energy: [0, 0.4] },
    Energetic: { energy: [0.8, 1], tempo: [120, 200] },
    Calm: { energy: [0, 0.4], tempo: [60, 100] },
    Relaxed: { valence: [0.5, 0.8], energy: [0, 0.5] },
    Motivated: { energy: [0.7, 1], tempo: [100, 160] },
    Angry: { energy: [0.8, 1], valence: [0, 0.4] },
    Romantic: { valence: [0.6, 1], energy: [0.3, 0.7] },
    Melancholic: { valence: [0.3, 0.6], energy: [0, 0.4] },
    Chill: { energy: [0.2, 0.5], tempo: [70, 110] },
    Uplifting: { valence: [0.7, 1], energy: [0.7, 1] },
    Hopeful: { valence: [0.6, 0.9], energy: [0.4, 0.8] },
    Mellow: { valence: [0.4, 0.7], energy: [0.2, 0.5] },
    Intense: { energy: [0.8, 1], tempo: [130, 180] },
    Groovy: { energy: [0.6, 0.9], tempo: [90, 130] },
    Dreamy: { valence: [0.5, 0.8], energy: [0.2, 0.6] },
    Nostalgic: { valence: [0.4, 0.7], energy: [0.3, 0.6] },
    Excited: { energy: [0.8, 1], valence: [0.7, 1] },
    Pensive: { valence: [0.3, 0.6], energy: [0.2, 0.5] },
    Empowered: { energy: [0.7, 1], valence: [0.6, 0.9] }
};


function adjustAttributesForIntensity(attributes, intensity) {
    const adjustedAttributes = {};
    for (let [key, range] of Object.entries(attributes)) {
        const delta = (range[1] - range[0]) * (intensity / 100);
        adjustedAttributes[key] = [range[0], range[0] + delta];
    }
    return adjustedAttributes;
}

export const fetchTracksBasedOnMood = async (mood, intensity) => {
    try {
        // Adjust attributes based on intensity
        const attributes = adjustAttributesForIntensity(moodAttributes[mood], intensity);

        // Search tracks based on mood to get seed tracks
        const seedTracks = await searchTracks(mood);
        const seedTrackIds = seedTracks.slice(0, 5).map(track => track.id); // Use the first 5 tracks as seeds

        // Fetch audio features for seed tracks
        const audioFeatures = await fetchAudioFeatures(seedTrackIds);

        // Filter tracks based on adjusted attributes
        const filteredTracks = audioFeatures.filter(track => {
            for (let [key, range] of Object.entries(attributes)) {
                if (track[key] < range[0] || track[key] > range[1]) {
                    return false;
                }
            }
            return true;
        });

        return filteredTracks;
    } catch (error) {
        console.error("Error fetching tracks based on mood:", error);
        return [];
    }
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

export const fetchAudioFeatures = async (trackIds) => {
    const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    return data.audio_features;
};

export const fetchUserProfile = async () => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    return data;
};

export const fetchRecommendations = async (seedTracks) => {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(',')}`, {
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    return data.tracks;
};

export const addTracksToPlaylist = async (playlistId, trackUris) => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris
            })
        });
        if (!response.ok) throw new Error(response.statusText);
        return true;
    } catch (error) {
        console.error("Error adding tracks to playlist:", error);
        return false;
    }
};
