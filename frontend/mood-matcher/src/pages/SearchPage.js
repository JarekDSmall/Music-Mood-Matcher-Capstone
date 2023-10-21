import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

function SearchPage() {
  const [tracks, setTracks] = useState([]);

  const handleSearchResults = (results) => {
    setTracks(results);
  };

  const handleTrackSelect = (track) => {
    // Handle the selected track here. For example, you can add it to a playlist.
    console.log('Selected track:', track);
  };

  return (
    <div>
      <h1>Search for Tracks</h1>
      <SearchBar onSearchResults={handleSearchResults} />
      {tracks.length > 0 && (
        <SearchResults tracks={tracks} onTrackSelect={handleTrackSelect} />
      )}
    </div>
  );
}

export default SearchPage;
