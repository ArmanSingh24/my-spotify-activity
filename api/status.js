export default async function handler(req, res) {
  try {
    // 1. Get access token from your existing token endpoint
    const tokenRes = await fetch(
      `${process.env.BASE_URL}/api/token`
    );

    if (!tokenRes.ok) {
      return res.status(500).json({
        playing: false,
        text: "Unable to fetch Spotify token"
      });
    }

    const { access_token } = await tokenRes.json();

    // 2. Call Spotify Currently Playing API
    const spotifyRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    // Nothing playing
    if (spotifyRes.status === 204) {
      return res.status(200).json({
        playing: false,
        text: "Not listening to anything right now"
      });
    }

    const data = await spotifyRes.json();

    const song = data.item?.name;
    const artist = data.item?.artists
      ?.map(a => a.name)
      .join(", ");

    if (!song || !artist) {
      return res.status(200).json({
        playing: false,
        text: "Not listening to anything right now"
      });
    }

    // 3. Return SIMPLE text response
    return res.status(200).json({
      playing: true,
      text: `Listening to ${song} – ${artist}`
    });

  } catch (err) {
    console.error("Status endpoint error:", err);
    return res.status(500).json({
      playing: false,
      text: "Unavailable"
    });
  }
}
