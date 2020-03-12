// Dependencies
const express = require("express");
let mongoose = require('mongoose');
const router = express.Router();

// Model's Data Access Objects (DAO)
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let AlbumDAO = require("../daos/AlbumDAO.js");
let UserDAO = require("../daos/UserDAO.js");

// Helper Functions
let generateSpotifyWebAPI = require('../services/general/GenerateSpotifyWebAPI.js');

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
router.put("/:id", auth.verify, User.verify, async (req, res) => {
    try {
        let album = await new AlbumDAO(req.params.id);
        return res.send(await album.getData(req.spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// Export
module.exports = {
    routes: router,
}