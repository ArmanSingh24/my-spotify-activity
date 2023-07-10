const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const refreshToken = REFRESH_TOKEN;
let accessToken = ''; // Stores the current Access Token
// Function to refresh the Access Token using the Refresh Token
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
// Function to fetch and display the currently playing track
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
      document.body.style.backgroundSize = '100% 100%';
      document.body.style.backgroundPosition = 'center';
      // Display the track information
      document.querySelector('#track').innerHTML = `
        <img src="${data.item.album.images[0].url}" width="250">
        <h2>${data.item.name}</h2>
        <p>${data.item.artists[0].name}</p>
      `;
    })
    .catch(error => {
      if (error.message !== 'No currently playing track') {
        console.log(error);
      }
      document.querySelector('#track').innerHTML = `<p>Not listening to anything rn!</p>`;
    });
}

// Update the track information every .5 seconds
setInterval(updateTrack, 500);
// Initial token refresh
refreshAccessToken();
// Refresh the token every hour (3600 seconds)
setInterval(refreshAccessToken, 3600000);