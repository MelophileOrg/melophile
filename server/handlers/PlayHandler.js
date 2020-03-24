// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization');
const router = express.Router();

// Models
let User = require('../models/User.js');

/**
 * Play Track
 * Starts playing track on current playback device.
 * 
 * @param id ID of Track to Play
 */
router.put("/track/:id", auth.verifyToken, User.verify, async (req, res) => {
    try {
        await req.spotifyAPI.play({uris: ["spotify:track:" + req.params.id]});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Play Tracks
 * Starts playing track on current playback device.
 * 
 * @param ids IDs of Tracks to Play
 */
router.put("/track", auth.verifyToken, User.verify, async (req, res) => {
    try {
        let uris = req.body.tracks.map((track) => {
            return "spotify:track:" + track;
        });
        await req.spotifyAPI.play({uris: uris});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Play Artist
 * Starts playing artist on current playback device.
 * 
 * @param ids ID of Artist to Play
 */
router.put("/artist/:id", auth.verifyToken, User.verify, async (req, res) => {
    try {
        await req.spotifyAPI.play({context_uri: "spotify:artist:" + req.params.id});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Play Playlist
 * Starts playing playlist on current playback device.
 * 
 * @param ids ID of Playlist to Play
 */
router.put("/playlist/:id", auth.verifyToken, User.verify, async (req, res) => {
    try {
        await req.spotifyAPI.play({context_uri: "spotify:playlist:" + req.params.id});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Play Album
 * Starts playing album on current playback device.
 * 
 * @param ids ID of Album to Play
 */
router.put("/album/:id", auth.verifyToken, User.verify, async (req, res) => {
    try {
        await req.spotifyAPI.play({context_uri: "spotify:album:" + req.params.id});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}