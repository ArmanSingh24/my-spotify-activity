// Serverless endpoint to refresh Spotify access token using REFRESH_TOKEN stored in env vars.
// Returns JSON: { access_token, expires_in }
let tokenCache = { access_token: null, expires_at: 0 };

// Vercel serverless function format
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return res.status(500).json({ error: 'Missing env vars: CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN' });
  }

  const now = Date.now();
  if (tokenCache.access_token && tokenCache.expires_at > now + 5000) {
    return res.status(200).json({
      access_token: tokenCache.access_token,
      expires_in: Math.floor((tokenCache.expires_at - now) / 1000)
    });
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', REFRESH_TOKEN);

  try {
    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('Spotify token error', data);
      return res.status(500).json({ error: 'Failed to refresh access token', details: data });
    }

    const expiresIn = data.expires_in || 3600;
    tokenCache.access_token = data.access_token;
    tokenCache.expires_at = Date.now() + expiresIn * 1000;

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ access_token: data.access_token, expires_in: expiresIn });
  } catch (err) {
    console.error('Spotify token fetch failed', err);
    return res.status(500).json({ error: 'Internal error refreshing token' });
  }
}
