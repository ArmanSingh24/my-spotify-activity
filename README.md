# 🚀 Live at https://armansingh24.github.io/my-spotify-activity/

* Displays my Spotify's currently playing track in a unique way

## Preview
* Mobile devices -

![image](https://cdn.discordapp.com/attachments/1114497979529834510/1173493591411277844/chrome_g5ded1rj3Z.png)
![image](https://cdn.discordapp.com/attachments/1114497979529834510/1173493591654543502/chrome_NzYMcKYH1Y.png)
![image](https://cdn.discordapp.com/attachments/1114497979529834510/1173493591914582056/chrome_D1fdW2mMV4.png)

* PC -

![image](https://cdn.discordapp.com/attachments/1114497979529834510/1173490683387064372/chrome_g0OCyVKgYP.png)

## Spotify API

* Create a Spotify Application through [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
* Click on **Edit Settings**
* Take note of:
    * `Client ID`
    * `Client Secret`
* In **Redirect URIs**:
    * Add `http://localhost/callback/`

## Refresh Token

* Navigate to the following URL:

```
https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing&redirect_uri=http://localhost/callback/
```

* After logging in, save the {CODE} portion of: `http://localhost/callback/?code={CODE}`

* Create a string combining `{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}` (e.g. `5n7o4v5a3t7o5r2e3m1:5a8n7d3r4e2w5n8o2v3a7c5`) and **encode** into [Base64](https://base64.io/).

* Then run a [cURL command](https://httpie.org/run) in the form of:
```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic {BASE64}" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}" https://accounts.spotify.com/api/token
```

* Save the Refresh token

* Watch [video tutorial](https://www.youtube.com/watch?v=yAXoOolPvjU) by API-University

## Deployment

* Replace my Client Id, Client Secret and Refresh Token with Yours.

* Create a new Repo, drop the project files.

* Deploy!
