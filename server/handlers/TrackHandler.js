// Server Dependencies
const express = require("express");
const router = express.Router();

// Spotify Web API Wrapper
let SpotifyWebApi = require('spotify-web-api-node');
// Model's Data Access Objects (DAO)
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let AlbumDAO = require("../daos/AlbumDAO.js");
let UserDAO = require("../daos/UserDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Base Data
 * Returns base data for track object. 
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Object with Track Properties.
 */
router.put("/:id", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let track = await new TrackDAO(req.params.id);
        return res.send(await track.getData(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Audio Features
 * Returns audio feature data for track object. 
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Object with Track Audio Feature Properties.
 */
router.put("/:id/features", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let track = await new TrackDAO(req.params.id);
        return res.send(await track.getAudioFeatures(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Audio Analysis
 * Returns audio analysis array data for track object. 
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Array with Audio Analysis Data
 */
router.put("/:id/analysis", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let track = await new TrackDAO(req.params.id);
        return res.send(await track.getAudioAnalysis(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Simular Tracks
 * Returns an array of track objects simular to this track.
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Array with Recommended Tracks
 */
router.put("/:id/recommended", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let track = await new TrackDAO(req.params.id);
        let tracks = await track.getRecommendations(spotifyAPI);
        return res.send(tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Track Artists
 * Returns an array of artist objects.
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Array of Artist Data Objects
 */
router.put("/:id/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let track = await new TrackDAO(req.params.id);
        let artists = await track.getTrackArtists(spotifyAPI);
        return res.send(artists.map(async (artist) => {
            return await artist.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Track Feature Percentile
 * Returns what percentile track is in compaired to whole library
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Object of Features with (0-1) values.
 */
router.put("/:id/percentiles", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let track = await new TrackDAO(req.params.id);
        return res.send(await user.getPercentile(spotifyAPI, track));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Closest tracks in library
 * Returns track in your library with simular mood.
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 * @return Array of track data objects
 */
router.put("/:id/nearest", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let track = await new TrackDAO(req.params.id);
        return res.send(await user.getNearest(track, 10, spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/////////////////////////////////////////////////////
// Helper Functions /////////////////////////////////
/////////////////////////////////////////////////////
/**
 * Generate Spotify API Wrapper
 * Creates and returns an instance of Spotify API wrapper with token
 * 
 * @param token Spotify Authorization token.
 * @returns Spotify Web API Wrapper Object
 */
let generateSpotifyWebAPI = async (token) => {
    if (token == null) return null;
    let spotifyAPI = new SpotifyWebApi();
    await spotifyAPI.setAccessToken(token);
    return spotifyAPI;
}
/**
 * Generate User DAO Object for Given User
 * Uses Spotify API to confirm user identity and
 * retrieve User DAO Object.
 * 
 * @param spotifyAPI Spotify Web API Wrapper Object
 * @returns User DAO
 */
let requestUser = async (spotifyAPI) => {
    let response = await spotifyAPI.getMe();
    let user = await new UserDAO(response.body.id);
    await user.retrieve(spotifyAPI);
    return user;
}

// Exporting to Server
module.exports = {
    routes: router,
}