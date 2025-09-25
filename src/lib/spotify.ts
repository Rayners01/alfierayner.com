const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

console.log(refresh_token);

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';


export const getAccessToken = async () => {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    client_id: client_id
    })
  });

  return res.json();
};

export const getNowPlaying = async () => {
  const access = await getAccessToken();
  const access_token = access.access_token;

  console.log(access);

  const currentlyPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  // If nothing is playing or error occurs, fallback to recently played
  if (currentlyPlayingRes.status === 204 || currentlyPlayingRes.status > 400) {
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const recentData = await recentRes.json();

    console.log(recentData);

    if (!recentData?.items || recentData.items.length === 0) {
      return {
        isPlaying: false,
        title: 'No recent track found',
        artist: '',
        album: '',
        albumImageUrl: '',
        songUrl: ''
      };
    }

    const song = recentData.items[0].track;

    return {
      isPlaying: false,
      title: song.name,
      artist: song.artists.map((artist: any) => artist.name).join(', '),
      album: song.album.name,
      albumImageUrl: song.album.images[0].url,
      songUrl: song.external_urls.spotify
    };
  }

  const song = await currentlyPlayingRes.json();

  return {
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((artist: any) => artist.name).join(', '),
    album: song.item.album.name,
    albumImageUrl: song.item.album.images[0].url,
    songUrl: song.item.external_urls.spotify
  };
};
