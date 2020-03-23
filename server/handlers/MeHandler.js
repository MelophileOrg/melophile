// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization');
const router = express.Router();

// Model's Data Access Objects (DAO)
let Profile = require('../models/Profile.js');
let User = require('../models/User.js');

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Processed
 * Returns boolean whether user has been processed before.
 * 
 * @returns Boolean 
 */
router.get("/exists", auth.verifyToken, User.verify, async (req, res) => {
    try {
        let response = await req.spotifyAPI.getMe();
        let user = await User.findOne({
            spotifyID: response.body.id
        });
        let profile = await Profile.findOne({
            user: user,
        });
        return res.send(profile != null);
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Numerical Data
 * Returns number of items in users library.
 * 
 * @returns Object with tracks, artists, genres, and playlist properties with numbers.
 */
router.get("/numerics", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Audio Feature Data
 * Returns all audio feature data for a user.
 * 
 * @returns Object with audio feature properties.
 */
router.get("/audiofeatures", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Top Played Track Chart
 * Returns array of track objects for top played chart.
 * 
 * @param time_range short_term, medium_term, long_term
 * @returns Array of track objects for display
 */
router.get("/charts/topplayed/tracks/:time_range", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Top Played Artist Chart
 * Returns array of artist objects for top played chart.
 * 
 * @param time_range short_term, medium_term, long_term
 * @returns Array of artist objects for display
 */
router.get("/charts/topplayed/artists/:time_range", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Top Saved Artist Chart
 * Returns array of artist objects for top saved chart.
 * 
 * @returns Array of artist objects for display
 */
router.get("/charts/topsaved/artists", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Top Saved Genre Chart
 * Returns array of genre objects for top saved chart.
 * 
 * @returns Array of genre objects for display
 */
router.get("/charts/topsaved/genres", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * History Data
 * Returns all history data for user.
 * 
 * @returns Object with history properties
 */
router.get("/history", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});


// Endpoints

module.exports = {
    routes: router,
}