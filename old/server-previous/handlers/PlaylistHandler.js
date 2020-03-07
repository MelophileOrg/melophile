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
 * Returns base data for playlist object. 
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return Object with Playlist Properties.
 */
router.put("/:id", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        return res.send(await playlist.getData(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Playlist Tracks
 * Returns track data objects from playlist.
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return Array of Objects with Track Properties.
 */
router.put("/:id/tracks", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        let tracks = await playlist.getPlaylistTracks(spotifyAPI);
        return res.send(await tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Playlist Artists
 * Returns artist data objects from playlist.
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return Array of Objects with Artist Properties and array of tracks for each.
 */
router.put("/:id/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        return res.send(await playlist.getPlaylistArtists(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Playlist Feature Distributions
 * Returns distribution of audio features for playlist
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return Object with arrays for distributions
 */
router.put("/:id/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        return res.send(await playlist.getDistributions(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Playlist Genres
 * Returns array of genre objects.
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return array of genre objects.
 */
router.put("/:id/genres", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        return res.send(await playlist.getGenres(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Playlist Timelines
 * Returns array of features in order of the tracks
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 * @return array of feature values through tracks in song (0-1)
 */
router.put("/:id/timelines", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        return res.send(await playlist.getTimelines(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Releoad Playlist
 * Reupdate Playlist
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 */
router.put("/:id/update", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let playlist = await new PlaylistDAO(req.params.id);
        if (!(await playlist.permission(spotifyAPI, user))) return res.sendStatus(401);
        await playlist.retrieveFromAPI(spotifyAPI);
        await playlist.save(spotifyAPI);
        return res.sendStatus(200);
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