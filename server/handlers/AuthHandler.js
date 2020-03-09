// Dependencies
const express = require("express");
const querystring = require("querystring");
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
router.get("/login", async (req, res) => {
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
                refreshToken: refresh_token,
              });
            } else {
                return res.sendStatus(response.statusCode).send(error);
            }
          });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Spotify Refresh
 * Use refresh token to re-authenticate
 * @param refreshToken Refresh token from last login.
 * @return Object with auth token.
 */
router.put("/refresh", async (req, res) => {
    try {
        let refreshToken = req.body.refreshToken ? req.body.refreshToken: null;
        if (!refreshToken) return res.sendStatus(400);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(keys.getSpotify().id + ':' + keys.getSpotify().secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            json: true
            };
            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    inicialize(body.access_token);
                    return res.send({
                        accessToken: body.access_token,
                    });
                } else {
                    return res.sendStatus(response.statusCode).send(error);
                }
            });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}