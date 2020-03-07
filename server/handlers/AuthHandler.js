// Dependencies
const express = require("express");
const router = express.Router();
const StateGenerator = require("../services/general/StateGenerator.js");
const KeyRetriever = require("../services/general/KeyRetriever.js");
// Initialization
const DEV = true;
let redirectUri = "https://melophile.org/redirect/";
if (DEV) redirectUri = "http://localhost:8080/redirect/";
const state = StateGenerator.generateRandomString(10);
let keys = new KeyRetriever();
// Endpoints
/**
 * Login Spotify
 * Sends link for user to login with Spotify.
 * 
 * @return String of link.
 */
router.put("/login", async (req, res) => {
    try {
        const scopes = ['user-read-recently-played','user-top-read','user-library-read','user-read-email','playlist-read-private','playlist-modify-public','user-library-modify', 'user-modify-playback-state'];
        return res.send('https://accounts.spotify.com/authorize?' + querystring.stringify({
            response_type: 'code',
            client_id: await keys.getSpotify().id,
            scope: scopes.join('%20'),
            redirect_uri: redirectUri,
            state: state,
            show_dialog: 'false',
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Spotify Callback
 * After use visits link, callback returns codes to get AuthToken
 * 
 * @return Object with state and login link.
 */
router.put("/callback", async (req, res) => {
    try {
        let code = req.body.code ? req.body.code : null;
        let givenState = req.body.state ? req.body.state : null;
        if (code || !givenState || givenState != state)
            return res.sendStatus(500);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(await keys.getSpotify().id + ':' + await keys.getSpotify().secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              inicialize(body.access_token);
              refresh_token = body.refresh_token;
              return res.send({
                token: body.access_token, 
                refreshTOken: refresh_token
              })
            } else {
                return res.sendStatus(500);
            }
          });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}