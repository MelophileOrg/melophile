// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization');
let generateSpotifyWebAPI = require('../services/general/GenerateSpotifyWebAPI.js');
const router = express.Router();

// Profile Model
let Profile = require('../models/Profile.js');

/**
 * Top Played Chart
 * Returns array of track objects for top played chart.
 * 
 * @param time_range short_term, medium_term, long_term
 * @returns 200 Array of track objects for display
 */
router.delete("/charts/topplayed/tracks/:time_range", auth.verifyToken, User.verify, async (req, res) => {
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