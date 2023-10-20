// components/playlist/SearchResults.js

import React from 'react';
import Track from './Track';

function SearchResults({ tracks, onTrackSelect }) {
  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id}>
          <Track track={track} />
          <button onClick={() => onTrackSelect(track)}>Add to Playlist</button>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
