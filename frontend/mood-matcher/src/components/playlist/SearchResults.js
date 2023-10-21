import React from 'react';
import { usePlaylist } from '../../context/PlaylistContext';
import Track from './Track';

function SearchResults({ tracks }) {
    const { addTrackToCurrent } = usePlaylist();

    return (
        <div>
            {tracks.map((track) => (
                <div key={track.id}>
                    {/* Assuming Track component displays track info */}
                    <Track track={track} />
                    <button onClick={() => addTrackToCurrent(track)}>Add to Playlist</button>
                </div>
            ))}
        </div>
    );
}

export default SearchResults;
