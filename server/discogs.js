const express = require('express');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

const discogsKey = process.env.discogsKey;
const discogsSecret = process.env.discogsSecret;

router.get("/artist/:id", async (req, res) => { 
    try {
        let response = await axios.get('https://api.discogs.com/database/search?q=' + req.params.id + '&type=artist&key=' + discogsKey + '&secret=' + discogsSecret);
        let artist_id;
        for (let i = 0; i < response.data.results.length; i++) {
            if (response.data.results[i].type == 'artist') {
                artist_id = response.data.results[i].id;
                break;
            }
        }
        let artist = await axios.get('https://api.discogs.com/artists/' + artist_id + '?key=' + discogsKey + '&secret=' + discogsSecret);
        res.send(artist.data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}