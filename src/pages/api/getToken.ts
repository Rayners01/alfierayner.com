import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid code' });
  }

  const tokenData = await exchangeCodeForToken(code);

  return res.status(200).json(tokenData);
}

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = 'http://www.alfierayner.com/api/callback'; // must match your Spotify app settings exactly

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

export const exchangeCodeForToken = async (code: string) => {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + basic
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Failed to exchange code for token:', data);
    throw new Error(data.error_description || 'Token exchange failed');
  }

  return data; // contains access_token, refresh_token, etc.
};
