const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const refreshToken = REFRESH_TOKEN;
let accessToken = '';
let currentTrackData = null;
let progressTimer = null;

async function refreshAccessToken() {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=refresh_token&refresh_token=' + refreshToken
  };

  try {
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers
    });

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error refreshing Access Token:', error);
  }
}
function changeBackgroundColor() {
  const trackElement = document.querySelector('#track');
  if (trackElement.innerHTML.trim() === '<p>Not listening to anything rn!</p>') {
    trackElement.style.backgroundColor = 'transparent';
  } else {
    trackElement.style.backgroundColor = '#1212124b';
  }
}
function updateTrack() {
  if (!accessToken) return;
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => {
      if (response.status === 204) {
        throw new Error('No currently playing track');
      }
      return response.json();
    })
    .then(data => {
      currentTrackData = data;

      const imageUrl = data.item.album.images[0].url;
      document.body.style.backgroundImage = `url(${imageUrl})`;

      const trackEl = document.querySelector('#track');
      const existingProgress = trackEl.querySelector('#songProgress');
      const spotifyUrl = data.item.external_urls && data.item.external_urls.spotify
        ? data.item.external_urls.spotify
        : `https://open.spotify.com/track/${data.item.id}`;

      trackEl.innerHTML = `
        <a href="${spotifyUrl}" target="_blank" rel="noopener noreferrer" class="track-link">
          <img src="${imageUrl}" width="250" alt="${data.item.name} album art">
          <h2>${data.item.name}</h2>
          <p>${data.item.artists[0].name}</p>
        </a>
      `;

      if (existingProgress) {
        trackEl.appendChild(existingProgress);
      } else {
        const p = document.createElement('progress');
        p.id = 'songProgress';
        p.max = 100;
        p.value = 0;
        trackEl.appendChild(p);
      }

      changeBackgroundColor();

      updateProgressBar(currentTrackData);
      startSmoothProgress();
    })
    .catch(error => {
      if (error.message !== 'No currently playing track') {
        console.log(error);
      }
      document.querySelector('#track').innerHTML = `<p>Not listening to anything rn!</p>`;
      changeBackgroundColor();
      currentTrackData = null;
      stopSmoothProgress();
    });
}
function getProgressElement() {
  return document.getElementById('songProgress');
}

function updateProgressBar(songData) {
  const progressBar = getProgressElement();
  if (!progressBar || !songData || !songData.progress_ms || !songData.item || !songData.item.duration_ms) return;
  const percent = (songData.progress_ms / songData.item.duration_ms) * 100;
  progressBar.value = percent;
}

function startSmoothProgress() {
  stopSmoothProgress();
  const el = getProgressElement();
  if (!el || !currentTrackData) return;

  let lastProgressMs = currentTrackData.progress_ms;
  const durationMs = currentTrackData.item.duration_ms;
  const startTs = Date.now();

  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTs;
    const simulatedProgress = Math.min(lastProgressMs + elapsed, durationMs);
    const percent = (simulatedProgress / durationMs) * 100;
    el.value = percent;
  }, 250);
}

function stopSmoothProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const trackEl = document.querySelector('#track');
  if (trackEl && !trackEl.querySelector('#songProgress')) {
    const p = document.createElement('progress');
    p.id = 'songProgress';
    p.max = 100;
    p.value = 0;
    trackEl.appendChild(p);
  }

  await refreshAccessToken();
  updateTrack();
  setInterval(updateTrack, 3000);
  setInterval(refreshAccessToken, 3600000);
});
  
