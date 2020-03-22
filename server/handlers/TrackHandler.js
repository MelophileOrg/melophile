// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization.js');
const router = express.Router();

// Models
let User = require('../models/User.js');

// Model's Data Access Objects (DAO)
let TrackDAO = require("../daos/TrackDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Base Data
 * Returns base data for track object. 
 * 
 * @param id ID of Track desired
 * @return Object with Track Base Data Properties.
 */
router.get("/:id", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getBaseData(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Complete Data
 * Returns complete data for track object. 
 * 
 * @param id ID of Track desired
 * @return Object with Track Complete Data Properties.
 */
router.get("/:id/complete", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getCompleteData(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Audio Feauture Data
 * Returns audio feature data for track object. 
 * 
 * @param id ID of Track desired
 * @return Object with Track Audio Feature Data Properties.
 */
router.get("/:id/audiofeatures", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getAudioFeatureData(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Audio Analysis Data
 * Returns audio analysis data for track object. 
 * 
 * @param id ID of Track desired
 * @return Object with Track Audio Analysis Data Properties.
 */
router.get("/:id/audioanalysis", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getAudioAnalysis(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Simular
 * Returns simular tracks. 
 * 
 * @param id ID of Track desired
 * @return Array of base track data.
 */
router.get("/:id/simular", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getSimular(req.spotifyAPI);
        return res.sendStatus(200).send(await data.getBaseData(req.spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Album
 * Returns album data.
 * 
 * @param id ID of Track desired
 * @return Object with album data
 */
router.get("/:id/album", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getAlbum(req.spotifyAPI);
        return res.sendStatus(200).send(await data.getBaseData(req.spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Artist's Data
 * Returns array of artists with data
 * 
 * @param id ID of Track desired
 * @return Array of artists
 */
router.get("/:id/artists", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getArtists(req.spotifyAPI);
        return res.sendStatus(200).send(await data.getBaseData(req.spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Genre's Data
 * Returns array of genres with data
 * 
 * @param id ID of Track desired
 * @return Array of genres
 */
router.get("/:id/genres", auth.verify, User.verify, async (req, res) => {
    try {
        let track = await new TrackDAO(req.params.id);
        let data = await track.getGenres(req.spotifyAPI);
        return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Library Simular Tracks
 * Returns array of base data for simular tracks in library.
 * 
 * @param id ID of Track desired
 * @return Array of tracks
 */
router.get("/:id/library/simular", auth.verify, User.verify, async (req, res) => {
    try {
        // let track = await new TrackDAO(req.params.id);
        // let data = await track.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Audio Feature Percentiles
 * Returns object with audio feature properties and percentiles.
 * 
 * @param id ID of Track desired
 * @return Object with audio feature data.
 */
router.get("/:id/library/percentiles", auth.verify, User.verify, async (req, res) => {
    try {
        // let track = await new TrackDAO(req.params.id);
        // let data = await track.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Date Added
 * Returns date track was added
 * 
 * @param id ID of Track desired
 * @return Date object
 */
router.get("/:id/library/added", auth.verify, User.verify, async (req, res) => {
    try {
        // let track = await new TrackDAO(req.params.id);
        // let data = await track.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Get Other Tracks Added at Same Time
 * Returns array of tracks added at the same time
 * 
 * @param id ID of Track desired
 * @return Array of tracks
 */
router.get("/:id/library/added/others", auth.verify, User.verify, async (req, res) => {
    try {
        // let track = await new TrackDAO(req.params.id);
        // let data = await track.getGenres(req.spotifyAPI);
        // return res.sendStatus(200).send(data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}