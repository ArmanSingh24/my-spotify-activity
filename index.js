const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;
const refreshToken = REFRESH_TOKEN;
let accessToken = ''; // Stores the current Access Token
let isFetchingTrack = false; // Flag to track if track information is already being fetched
let isRefreshingToken = false; // Flag to track if the access token is already being refreshed

// Function to refresh the Access Token using the Refresh Token
async function refreshAccessToken() {
  if (isRefreshingToken) {
    return; // If already refreshing token, skip this call
  }

  isRefreshingToken = true; // Set the flag to true to indicate that token refresh is in progress

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
    isRefreshingToken = false; // Reset the flag after successful token refresh
  } catch (error) {
    console.error('Error refreshing Access Token:', error);
    isRefreshingToken = false; // Reset the flag if token refresh fails
  }
}

// Function to fetch and display the currently playing track
function updateTrack() {
  if (isFetchingTrack) {
    return; // If already fetching track information, skip this call
  }

  isFetchingTrack = true; // Set the flag to true to indicate that track info is being fetched

  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => {
      isFetchingTrack = false; // Reset the flag when the request is complete

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
    })
    .catch(error => {
      isFetchingTrack = false; // Reset the flag in case of an error

      if (error.message !== 'No currently playing track') {
        console.log(error);
      }
      document.querySelector('#track').innerHTML = `<p>Not listening to anything rn!</p>`;
    });
}

// Update the track information every 1 seconds
setInterval(updateTrack, 1000); // Change to 5000 milliseconds (5 seconds)

// Initial token refresh
refreshAccessToken();

// Refresh the token every hour (3600 seconds)
setInterval(refreshAccessToken, 3600000);
    
