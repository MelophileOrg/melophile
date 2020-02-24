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
let GenreDAO = require("../daos/GenreDAO.js");
let UserDAO = require("../daos/UserDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Base Data
 * Returns base data for genre object
 * _id / name, artistIDs, track_num
 * 
 * @param name Name of Genre desired
 * @param token Spotify Authorization token.
 * @return Object with Genre Properties.
 */
router.put("/:name", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let genre = await user.getGenre(req.params.name);
        return res.send(await genre.getData(user));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Genre Tracks
 * Returns all liked tracks for genre.
 * 
 * @param name Name of Genre desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */
router.put("/:name/tracks", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let genre = await new GenreDAO(req.params.name);
        let tracks = await genre.getGenreTracks(user);
        return res.send(await tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Genre Artists
 * Returns all liked artists for genre.
 * 
 * @param name Name of Genre desired
 * @param token Spotify Authorization token.
 * @return Array of Artist Data Objects
 */
router.put("/:name/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let genre = await new GenreDAO(req.params.name);
        let artists = await genre.getGenreArtists(user);
        return res.send(await artists.map(async (artist) => {
            return await artist.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * History of Liked Tracks
 * Returns sorted array of track objects as well as general timeline
 * of when a user liked tracks from a particular genre.
 * 
 * @param id ID of Genre desired
 * @param token Spotify Authorization token.
 * @return Object
 * {
 *      tracks: [
 *          {} // Track Data Object with .dateAdded Property
 *      ],
 *      timeline: [
 *          Number ...
 *      ]
 * }
 */ 
router.put("/:id/history", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let genre = await new GenreDAO(req.params.id);
        return res.send(await genre.getHistory(spotifyAPI, user));
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