const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const refreshToken = REFRESH_TOKEN;
let accessToken = '';
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
      let imageUrl = `${data.item.album.images[0].url}`;
      // Set background image
      document.body.style.backgroundImage = `url(${imageUrl})`;
      // Display the track information
      document.querySelector('#track').innerHTML = `
        <img src="${data.item.album.images[0].url}" width="250">
        <h2>${data.item.name}</h2>
        <p>${data.item.artists[0].name}</p>
      `;

      changeBackgroundColor();
    })
    .catch(error => {
      if (error.message !== 'No currently playing track') {
        console.log(error);
      }
      document.querySelector('#track').innerHTML = `<p>Not listening to anything rn!</p>`;
      changeBackgroundColor();
    });
}
setInterval(updateTrack, 1000);
refreshAccessToken();
setInterval(refreshAccessToken, 3600000);
