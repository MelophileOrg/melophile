// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization');
const router = express.Router();

// Model's Data Access Objects (DAO)
let User = require('../models/User.js');

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Search
 * Returns array of track objects for search results
 * 
 * @param query String to be searched
 * @returns Array of track objects for display
 */
router.get("/:query", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

/**
 * Discover
 * Returns array of track objects for recommend results.
 * 
 * @param options object with query parameters
 * @returns Array of track objects for display
 */
router.put("/discovery", auth.verifyToken, User.verify, async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error);
        return res.sendStatus(500).send("Internal Server Error");
    }
});

module.exports = {
    routes: router,
}