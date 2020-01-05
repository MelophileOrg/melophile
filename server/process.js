const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

let SpotifyWebApi = require('spotify-web-api-node');

let melomaniac_processor = require('./melomaniac-processor.js');
let MelomaniacProcessor = melomaniac_processor.processor;




////////////////////////////////////////////////////////////////////////////////////////////
// LIBRARY ANALYSIS PROCESS ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
    let processor = await new MelomaniacProcessor(req.body.accessToken);
    await processor.start();
    res.send({tracks: await processor.getSavedTracksArray(), artists: await processor.getSavedArtistsArray()});
});











module.exports = {
    routes: router,
}