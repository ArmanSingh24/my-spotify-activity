# My Spotify Activity 🎵

## 🚀 Live Demo
- [View Live Demo](https://my-spotify-activity.vercel.app) - Deployed on Vercel

Displays my Spotify's currently playing track in a unique way with real-time updates and a beautiful UI.

## Preview
![Preview](./preview/desktop.png)

## Features
- 🎵 Real-time currently playing track display
- 🖼️ Dynamic background based on album art
- ⏳ Progress bar showing song position
- 🔒 Secure token handling via serverless function
- 📱 Responsive design

## Project Structure
```
├── api/
│   └── token.js          # Serverless function for token refresh
├── src/
│   ├── app/
│   │   └── index.js      # Frontend JavaScript
│   ├── css/
│   │   └── style.css     # Styles
│   └── img/
│       └── ico.png       # Favicon
└── index.html            # Main HTML file
```

## Setup Instructions

### 1. Spotify API Setup
* Create a Spotify Application through [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
* Click on **Edit Settings**
* Note down:
    * `Client ID`
    * `Client Secret`
* In **Redirect URIs**:
    * Add `http://localhost/callback/`

### 2. Get Refresh Token
Navigate to:
```
https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing&redirect_uri=http://localhost/callback/
```
* After login, save the {CODE} from: `http://localhost/callback/?code={CODE}`
* Create Base64 string from `{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}`
* Get refresh token using:
```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic {BASE64}" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}" https://accounts.spotify.com/api/token
```

Need help? Watch [video tutorial](https://www.youtube.com/watch?v=yAXoOolPvjU) by API-University

### 3. Local Development
1. Clone and install:
```bash
git clone https://github.com/ArmanSingh24/my-spotify-activity.git
cd my-spotify-activity
npm install
```

2. Create `.env` file:
```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REFRESH_TOKEN=your_refresh_token
```

3. Run locally:
```bash
vercel dev
```

### 4. Deployment
Two options for deployment:

#### Option A: Vercel (Recommended)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel project settings:
- CLIENT_ID
- CLIENT_SECRET
- REFRESH_TOKEN

#### Option B: GitHub Pages
Note: The serverless function won't work on GitHub Pages. Use this only if you want to modify the code to use client-side token refresh (less secure).

## Security Notes
- Uses serverless function to keep credentials secure
- Environment variables for sensitive data
- Short-lived access tokens
- Never commit `.env` file

## Contributing
Feel free to open issues and pull requests!

## Credits
- Built with Spotify Web API
- Original concept inspired by various Spotify current track displays
- Enhanced with serverless backend for better security
