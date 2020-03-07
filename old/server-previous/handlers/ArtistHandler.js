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
 * Returns base data for artist object. 
 * _id, name, image, genres, popularity
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Object with Artist Properties.
 */
router.put("/:id", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let artist = await new ArtistDAO(req.params.id);
        return res.send(await artist.getData(spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * User Liked Tracks from Artist
 * Returns array of tracks liked by user from a particular artist.
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */
router.put("/:id/liked", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let tracks = await user.getTracksFromArtist(req.params.id);
        return res.send(await tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Top Tracks by Artist
 * Returns array of top tracks by artist. Objects have all track properties
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */
router.put("/:id/toptracks", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let artist = await new ArtistDAO(req.params.id);
        let tracks = await artist.getTopTracks(spotifyAPI);
        return res.send(await tracks.map(async (track) => {
            return await track.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Related Artists
 * Returns array of artist data objects related to another artist.
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Artist Data Objects
 */
router.put("/:id/related", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let artist = await new ArtistDAO(req.params.id);
        let artists = await artist.getRelatedArtists(spotifyAPI);
        return res.send(await artists.map(async (artist) => {
            return await artist.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Artist Albums
 * Returns array of album data objects from the artist
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Album Data Objects
 */
router.put("/:id/albums", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let artist = await new ArtistDAO(req.params.id);
        let albums = await artist.getAlbums(spotifyAPI);
        return res.send(await albums.map(async (album) => {
            return await album.getData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Artist Genres
 * Returns array of genre data objects from the artist
 * 
 * @param id ID of Artist desired
 * @return Array of Genre Data Objects
 */ 
router.put("/:id/genres", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        let artist = await new ArtistDAO(req.params.id);
        let genres = await artist.genreDAOs(spotifyAPI);
        return res.send(await genres.map(async (genre) => {
            await genre.getData(user);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * History of Liked Tracks
 * Returns sorted array of track objects as well as general timeline
 * of when a user liked tracks from a particular artist.
 * 
 * @param id ID of Artist desired
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
        let artist = await new ArtistDAO(req.params.id);
        return res.send(await artist.getHistory(spotifyAPI, user));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * USER DAO
 * Other Songs Liked then
 * Returns tracks you also saved around the same time you liked this 
 * artist.
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */ 
// VERIFY USER

/**
 * PLAYLIST DAO
 * Playlists Artist is In
 * Returns an array of every playlist this artist is in the user's
 * library.
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Array of Track Data Objects
 */ 
// VERIFY USER

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