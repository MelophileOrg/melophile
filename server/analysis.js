const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const User = Items.user;

// INDIVIDUAL ITEMS
router.get("/album/:id", async (req, res) => {
    
});

router.get("/artist/:id", async (req, res) => {

});

router.get("/genre/:id", async (req, res) => {
    
});

router.get("/playlist/:id", async (req, res) => {
    
});

router.get("/track/:id", async (req, res) => {

});

// LIBRARY ANALYSIS

router.get("/library/:user/average/:audioFeature", async (req, res) => {
    try {
        let user = await User.findById(req.params.user);
        if (user == null) res.sendStatus(500);
        let projection = {};
        projection[req.params.audioFeature] = 1;
        const reducer = (accumulator, currentValue) => accumulator + currentValue[req.params.audioFeature];
        let total = (await Track.find({
            "_id": {$in: user.tracks}
        }, projection)).reduce(reducer);
        res.send({average: (total / user.tracks.length)});
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/library/:user/distribution/:audioFeature", async (req, res) => {
    
});

// HISTORY

router.get("/history/:user/timeline/added", async (req, res) => {
    
});

router.get("/history/:user/timeline/:audioFeature", async (req, res) => {
    
});

router.get("/history/:user/:month/:year", async (req, res) => {
    
});

router.get("/history/:user/:year", async (req, res) => {
    
});

// CHARTS

router.get("/charts/:user/played/tracks/:offset", async (req, res) => {
    
});

router.get("/charts/:user/played/artists/:offset", async (req, res) => {

});

router.get("/charts/:user/saved/artists/:offset", async (req, res) => {

});

router.get("/charts/:user/saved/genres/:offset", async (req, res) => {

});

// EXTREMES

router.get("/extemes/:user/min/:audioFeature/:offset", async (req, res) => {

});

router.get("/extemes/:user/max/:audioFeature/:offset", async (req, res) => {

});

// SEARCH

router.get("/search/:query/:offset", async (req, res) => {
    
});

router.get("/recommend/:offset", async (req, res) => {
    
});





module.exports = {
    routes: router,
}