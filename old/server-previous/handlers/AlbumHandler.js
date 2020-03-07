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
 * Returns base data for album object. 
 * 
 * @param id ID of Album desired
 * @param token Spotify Authorization token.
 * @return Object with Album Properties.
 */
router.put("/:id", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let album = await new AlbumDAO(req.params.id);
        return res.send(await album.getData(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Album Tracks
 * Returns all tracks for album.
 * 
 * @param id Name of Album desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */
router.put("/:id/tracks", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let album = await new AlbumDAO(req.params.id);
        let tracks = await album.getAlbumTracks(spotifyAPI);
        return res.send(await tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Album Artists
 * Returns all artists for album.
 * 
 * @param id ID of Album desired
 * @param token Spotify Authorization token.
 * @return Array of Artist Data Objects
 */
router.put("/:id/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let album = await new AlbumDAO(req.params.id);
        let artists = await album.getAlbumArtists(spotifyAPI);
        return res.send(await artists.map(async (artist) => {
            return await artist.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Album Genres
 * Returns all genres for album.
 * 
 * @param id ID of Album desired
 * @param token Spotify Authorization token.
 * @return Array of Genre Data Objects
 */
router.put("/:id/genres", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let album = await new AlbumDAO(req.params.id);
        let genres = await album.getAlbumGenres(spotifyAPI);
        return res.send(await genres.map(async (genre) => {
            return await genre.getData(user);
        }));
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


module.exports = {
    routes: router,
}