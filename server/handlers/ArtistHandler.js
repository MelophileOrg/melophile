// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization.js');
const router = express.Router();

// Models
let User = require('../models/User.js');

// Model's Data Access Objects (DAO)
let ArtistDAO = require("../daos/ArtistDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Complete Data
 * Returns complete data for artist object. 
 * 
 * @param id ID of Artist desired
 * @return Object with Artist Complete Data Properties.
 */
router.get("/:id", auth.verify, User.verify, async (req, res) => {
    try {
        let artist = await new ArtistDAO(req.params.id);
        let data = await artist.getCompleteData(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Genres
 * Returns genres for artist. 
 * 
 * @param id ID of Artist desired
 * @return Array of genres
 */
router.get("/:id/genres", auth.verify, User.verify, async (req, res) => {
    try {
        let artist = await new ArtistDAO(req.params.id);
        let data = await artist.getGenres(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Top Tracks
 * Returns top tracks for an artist
 * 
 * @param id ID of Artist desired
 * @return Array of tracks
 */
router.get("/:id/toptracks", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Simular Artists
 * Returns artists simular to this artist.
 * 
 * @param id ID of Artist desired
 * @return Array of artists
 */
router.get("/:id/simular", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Profile Data
 * Returns discogs profile data of artist.
 * 
 * @param id ID of Artist desired
 * @return Object with profile data.
 */
router.get("/:id/profile", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Artist Albums
 * Returns array of albums from artist
 * 
 * @param id ID of Artist desired
 * @return Array of albums
 */
router.get("/:id/albums", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get History of Likes
 * Returns object with history data
 * 
 * @param id ID of Artist desired
 * @return Object with history data.
 */
router.get("/:id/history", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Liked Tracks from Artist
 * Returns array of tracks.
 * 
 * @param id ID of Artist desired
 * @return Array of tracks.
 */
router.get("/:id/library/added/", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Tracks liked in same time.
 * Returns array of tracks.
 * 
 * @param id ID of Artist desired
 * @return Array of tracks.
 */
router.get("/:id/library/added/others", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Playlists In
 * Returns array of playlists
 * 
 * @param id ID of Artist desired
 * @return Array of playlists.
 */
router.get("/:id/playlists", auth.verify, User.verify, async (req, res) => {
    try {
        // let artist = await new ArtistDAO(req.params.id);
        // let data = await artist.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}