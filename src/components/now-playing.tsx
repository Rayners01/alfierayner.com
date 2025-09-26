'use client';

import { useEffect, useState } from 'react';

interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  progress: number;
  duration: number;
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  const fetchTrack = async () => {
    const res = await fetch('/api/now-playing');
    const data = await res.json();
    setTrack(data);
    setElapsed(data.progress);
  };

  useEffect(() => {
    fetchTrack();
    const fetchInterval = setInterval(fetchTrack, 15000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    if (!track?.isPlaying) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1000;
        if (next >= track.duration) {
          fetchTrack();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [track]);

  if (!track) return <p>Loading...</p>;

  const percent = (elapsed / track.duration) * 100;

  return (
    <div className="text-sm">
      <p className="mb-4 text-lg">
        {track.isPlaying ? 
        'Currently listening to:' :
        'Recently listened to:'
        }
      </p>
      <div className="flex items-center gap-3">
        <img
          src={track.albumImageUrl}
          alt={track.title}
          className="w-12 h-12 rounded shrink-0"
        />
        <div className="flex flex-col w-full max-w-[180px] sm:max-w-[220px] overflow-hidden">
          <p className="font-semibold truncate">{track.title}</p>
          <p className="text-green-600 truncate">{track.artist}</p>

          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-500 hover:underline mt-1"
          >
            Open in Spotify
          </a>
        </div>
      </div>
      {track.isPlaying && (
            <>
              <div className="mt-2 w-full h-2 bg-green-100 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${percent}%`,
                    transition: 'width 1s linear'
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 flex justify-between mt-1">
                <span>{msToMinutes(elapsed)}</span>
                <span>{msToMinutes(track.duration)}</span>
              </div>
            </>
          )}
    </div>
  );
}

function msToMinutes(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}
