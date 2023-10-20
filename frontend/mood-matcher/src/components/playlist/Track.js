// components/playlist/Track.js

import React, { useState, useRef } from 'react';

function Track({ track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <h4>{track.name}</h4>
      <p>{track.artists[0].name}</p>
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <audio ref={audioRef} src={track.preview_url} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

export default Track;
