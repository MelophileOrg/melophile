// Dependencies
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

// Spotify Web API
let SpotifyWebApi = require('spotify-web-api-node');
// Object DAOs
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let UserDAO = require("../daos/UserDAO.js");

module.exports = {
    routes: router,
}