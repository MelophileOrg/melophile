// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization.js');
let generateSpotifyWebAPI = require('../services/general/GenerateSpotifyWebAPI.js');
const router = express.Router();

// Models
let User = require('../models/User.js');

// Model's Data Access Objects (DAO)
let TrackDAO = require("../daos/TrackDAO.js");


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



module.exports = {
    routes: router,
}