'use client';

import { useEffect, useState } from 'react';

export default function NowPlaying() {
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const res = await fetch('/api/now-playing');
      const data = await res.json();
      setTrack(data);
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (!track) return <p>Loading...</p>;

  return (
    <div className="flex items-center gap-4">
      <img src={track.albumImageUrl} alt={track.title} className="w-12 h-12 rounded" />
      <div>
        <p className="font-semibold">{track.title}</p>
        <p className="text-sm text-green-600">{track.artist}</p>
        {track.isPlaying && (
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-500 hover:underline"
          >
            Open in Spotify
          </a>
        )}
      </div>
    </div>
  );
}
