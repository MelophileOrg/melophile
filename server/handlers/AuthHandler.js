// Dependencies
const express = require("express");
const request = require("request");
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

// State.
let uuid = require('uuid');
let uuidv4 = uuid.v4;
const state = uuidv4();

// User Model
let User = require('../models/User.js');

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Check Status
 * Checks if user is already logged in. Returns user data and new cookie with token.
 * 
 * @return User object and cookie
 */
router.get("/", auth.verifyToken, User.verify, async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.authToken);
        let me, error, followers;
        try {
            let response = await spotifyAPI.getMe();
            me = response.body;
            followers = response.body.followers.total;
        } catch(e) {
            error = e;
        }
        if (!error && me) {
            // Familiar Face?
            let spotifyID = req.userID;
            let existingUser = await User.findOne({
                spotifyID: spotifyID,
            });
            if (existingUser) {
                // Welcome back.
                login(existingUser, followers, req.token, req.authToken, req.refreshToken, res);
            } else {
                return res.clearCookie('melophile-token').status(204).send("User Account not Found");
            }
        } else if (error.statusCode == 401) {
            refresh(req.refreshToken, res);
        } else {
            console.log(error);
            return res.sendStatus(500).send("Internal Server Error");
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Get Token
 * Retrieves spotify token for user.
 * 
 * @return Auth token string.
 */
router.get("/token", auth.verifyToken, User.verify, async (req, res) => {
    try {
        return res.send(req.authToken);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
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
        return await res.send(await 'https://accounts.spotify.com/authorize?' + querystring.stringify({
            response_type: 'code',
            client_id: await keys.getSpotify().id,
            scope: scopes.join('%20'),
            redirect_uri: redirectUri,
            state: state,
            show_dialog: 'false',
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Logout User
 * Logs user out from broweser.
 * 
 * @param jsonwebtoken a valid logged in web tokin
 * @returns 200 Status delete token
 */
router.delete("/", auth.verifyToken, User.verify, async (req, res) => {
    const user = await User.findOne({
      spotifyID: req.userID
    });
    if (!user)
      return res.clearCookie('melophile-token').status(204).send("Invalid User Account");
    user.removeToken(req.token);
    await user.save();
    return res.clearCookie('melophile-token').sendStatus(200).send("User Logged Out");
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
            return res.sendStatus(204).send("Invalid Callback");
        // Preparations for Request
        let url = "https://accounts.spotify.com/api/token";
        let headers = { 'Authorization': 'Basic ' + (new Buffer.from(await keys.getSpotify().id + ':' + await keys.getSpotify().secret).toString('base64'))};
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
                let spotifyAPI = await generateSpotifyWebAPI(body.access_token);
                let response = await spotifyAPI.getMe();
                let me = response.body;
                let followers = response.body.followers.total;
                // Familiar Face?
                const existingUser = await User.findOne({
                    spotifyID: me.id,
                    username: me.display_name,
                });
                if (!existingUser) {
                    // First time? Welcome!
                    register(me, followers, body.access_token, body.refresh_token, res);
                } else {
                    // Welcome back.
                    login(existingUser, followers, null, body.access_token, body.refresh_token, res);
                }
            } else {
                return res.sendStatus(response.statusCode).send(error);
            }
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
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
let login = async (user, followers, oldToken, accessToken, refreshToken, res) => {
    try {
        let token = await auth.generateToken({
            spotifyID: user.spotifyID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }, "24h");
        await user.removeOldTokens();
        await user.removeToken(oldToken);
        await user.addToken(token);
        await user.save();
        // Send user data with cookie.
        return res.cookie("melophile-token", token, {
            expires: new Date(Date.now() + 86400 * 1000)
        }).status(200).send({...user.toJSON(), followers: followers});
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
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
let register = async (user, followers, accessToken, refreshToken, res) => {
    try {
        let token = auth.generateToken({
            spotifyID: user.spotifyID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }, "24h");
        let newUser = new User({
            spotifyID: user.id,
            username: user.display_name,
            images: user.images,
            tokens: [token],
        });
        await newUser.save();
        // Send user data with cookie.
        return res.cookie("melophile-token", token, {
            expires: new Date(Date.now() + 86400 * 1000)
        }).status(200).send({...newUser.toJSON(), followers: followers});
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
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
        let headers = { 'Authorization': 'Basic ' + (new Buffer.from(keys.getSpotify().id + ':' + keys.getSpotify().secret).toString('base64')) };
        let form = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        let authOptions = {url: url, headers: headers, form: form, json: true};
        request.post(authOptions, async function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // Who is this.
                let spotifyAPI = await generateSpotifyWebAPI(body.access_token);
                let response = await spotifyAPI.getMe();
                let me = response.body;
                let followers = response.body.followers.total;
                // Familiar Face?
                const existingUser = await User.findOne({
                    spotifyID: me.id,
                    username: me.username,
                });
                if (existingUser) {
                    // Welcome back.
                    login(existingUser, followers, null, body.access_token, body.refresh_token, res);
                } else {
                    return res.clearCookie('melophile-token').status(204).send("Invalid User Account");
                }
            } else {
                return res.sendStatus(response.statusCode).send("Could not Refresh Token");
            }
        });
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
}

// Export
module.exports = {
    routes: router,
}
