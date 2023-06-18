//pls don't steal my id and secret, i'm noob i dont know how to hide them 
const clientId = '7ceafa618104424e8e3593fe41098783';
const clientSecret = 'b01e8b96574a43d28676e1850517ca06';
const refreshToken = 'AQAO5NByLnT_lpayZn48gvWmSsCWper3nzlruYSrVev_QGX__tlgXm_3cDvw6625cTtHWEJqSMBDlpI2MPM4U2lSTzw5ErdaeB94vgv9cQh7DKE-F5_PkXJ5j09CUhNyOHY';
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
      // Display the track information
      document.querySelector('#track').innerHTML = `
              <img src="${data.item.album.images[0].url}" width="250">
              <h2>${data.item.name}</h2>
              <p>${data.item.artists[0].name}</p>
            `;
    })
    .catch(error => {
      console.log(error);
      document.querySelector('#track').innerHTML = `<p>Not listening to anything rn!</p>`;
    });
}
// Update the track information every .5 seconds
setInterval(updateTrack, 500);
// Initial token refresh
refreshAccessToken();
// Refresh the token every hour (3600 seconds)
setInterval(refreshAccessToken, 3600000);
