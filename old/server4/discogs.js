const express = require('express');
const axios = require('axios');
const router = express.Router();
const key = 'LpKGrAObCHJGJTlXEaJS';
const secret = 'wbiOyjSFvgkyvCLNXVMFACJVnuvUJQHz';

router.get("/artist/:id", async (req, res) => { 
    try {
        let response = await axios.get('https://api.discogs.com/database/search?q=' + req.params.id + '&type=artist&key=' + key + '&secret=' + secret);
        let artist_id;
        for (let i = 0; i < response.data.results.length; i++) {
            if (response.data.results[i].type == 'artist') {
                artist_id = response.data.results[i].id;
                break;
            }
        }
        let artist = await axios.get('https://api.discogs.com/artists/' + artist_id + '?key=' + key + '&secret=' + secret);
        res.send(artist.data);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
}