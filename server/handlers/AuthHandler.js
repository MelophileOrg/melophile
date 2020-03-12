// Dependencies
const express = require("express");
const querystring = require("querystring");
const auth = require('../services/general/Authorization');
let generateSpotifyWebAPI = require('../services/general/GenerateSpotifyWebAPI.js');
const router = express.Router();

// Application Keys
const keys = require("../services/general/KeyRetriever.js");

// Redirect URL from Authentication
const DEV = true;
let redirectUri = "https://melophile.org/redirect/";
if (DEV) redirectUri = "http://localhost:8080/redirect/";

// User Model
let User = require('../models/User.js');

// Helper Functions
const stateGenerator = require("../services/general/StateGenerator.js");
const state = stateGenerator(10);

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Check Status
 * Checks if user is already logged in. Returns user data and new cookie with token.
 * 
 * @return User object and cookie
 */
router.get("/", auth.verifyToken, async (req, res) => {
    try {
        console.log(req.token);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

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
 * Returns user data and new cookie with token.
 * 
 * @param code Spotify returned code.
 * @param state Spotify returned state.
 * @return User object and cookie
 */
router.put("/callback", async (req, res) => {
    try {
        // Retrieve Code
        let code = req.body.code ? req.body.code : null;
        // Shady Stuff Goin On?
        if (!code || !req.body.state || req.body.state != state)
            return res.sendStatus(500);
        // Preparations for Request
        let url = "https://accounts.spotify.com/api/token";
        let headers = { 'Authorization': 'Basic ' + (new Buffer(await keys.getSpotify().id + ':' + await keys.getSpotify().secret).toString('base64'))};
        let form = {
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        };
        let authOptions = { url: url, form: form, headers: headers, json: true };
        // Please sir, may I authorize.
        request.post(authOptions, async function(error, response, body) {
            // If OKAY
            if (!error && response.statusCode === 200) {
                // Who is this.
                let spotifyAPI = generateSpotifyWebAPI(body.access_token);
                let me = spotifyAPI.getMe();
                // Familiar Face?
                const existingUser = await User.findOne({
                    spotifyID: me.id,
                    username: me.username,
                });
                if (!existingUser) {
                    // First time? Welcome!
                    register(me, body.access_token, body.refresh_token, res);
                } else {
                    // Welcome back.
                    login(existingUser, body.access_token, body.refresh_token, res);
                }
            } else {
                return res.sendStatus(response.statusCode).send(error);
            }
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send(error);
    }
});

/**
 * Login User
 * Returns user data and new cookie with token.
 * 
 * @param user User object from database.
 * @param accessToken Token given by Spotify Authentication
 * @param refreshToken Refresh token given by Spotify Authentication
 * @param res Send back data.
 * @returns User data and Cookie
 */
let login = async (user, accessToken, refreshToken, res) => {
    try {
        let token = auth.generateToken({
            spotifyID: user.spotifyID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }, "24h");
        user.removeOldTokens();
        user.addToken(token);
        await user.save();
        // Send user data with cookie.
        return res.cookie("melophile-token", token, {
            expires: new Date(Date.now() + 86400 * 1000)
        }).status(200).send(user);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send(error);
    }
}

/**
 * Register User
* Returns user data and new cookie with token.
 * 
 * @param user User object from Spotify API.
 * @param accessToken Token given by Spotify Authentication
 * @param refreshToken Refresh token given by Spotify Authentication
 * @param res Send back data.
 * @returns User data and Cookie
 */
let register = async (user, accessToken, refreshToken, res) => {
    try {
        let token = auth.generateToken({
            spotifyID: user.spotifyID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }, "24h");
        let newUser = new User({
            spotifyID: user.id,
            username: user.username,
            images: user.images,
            tokens: [token],
        });
        await newUser.save();
        // Send user data with cookie.
        return res.cookie("melophile-token", token, {
            expires: new Date(Date.now() + 86400 * 1000)
        }).status(200).send(newUser);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send(error);
    }
}

/**
 * Refresh Token
 * Returns user data and new cookie with token.
 * 
 * @param refreshToken Refresh token given by Spotify Authentication
 * @param res Send back data.
 * @returns User data and Cookie
 */
let refresh = async (refreshToken, res) => {
    try {
        let url = "https://accounts.spotify.com/api/token";
        let headers = { 'Authorization': 'Basic ' + (new Buffer(keys.getSpotify().id + ':' + keys.getSpotify().secret).toString('base64')) };
        let form = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        let authOptions = {url: url, headers: headers, form: form, json: true};
        request.post(authOptions, async function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // Who is this.
                let spotifyAPI = generateSpotifyWebAPI(body.access_token);
                let me = spotifyAPI.getMe();
                // Familiar Face?
                const existingUser = await User.findOne({
                    spotifyID: me.id,
                    username: me.username,
                });
                if (existingUser) {
                    // Welcome back.
                    login(existingUser, body.access_token, body.refresh_token, res);
                } else {
                    return res.clearCookie('melophile-token').status(403).send({
                        error: "Invalid user account."
                    });
                }
            } else {
                return res.sendStatus(response.statusCode).send(error);
            }
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send(error);
    }
}

module.exports = {
    routes: router,
}
