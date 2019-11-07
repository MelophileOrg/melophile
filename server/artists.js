const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const artistsSchema = new mongoose.Schema({
    id: String,
    artists: Object,
    created: Date,
});

const Artist = mongoose.model('Artist', artistsSchema);

router.post("/:id", async (req, res) => {
    try {
        let artists = await Artist.find({});
        let found = false;
        for (let i = 0; i < artists.length; i++) {
            if (artists[i].id == req.params.id)
                found = true;
        }
        if (found) {
            let artists = await Artist.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "artists": req.body.artists,
                    "created": new Date(),
                }
            });
            console.log("Artists Updated - " + req.params.id);
            return res.send({updated: true, success: true});
        }
        else {
            let artists = new Artist({
                id: req.params.id,
                artists: req.body.artists,
                created: new Date(),
            });
            await artists.save();
            console.log("Artists Saved - " + req.params.id);
            return res.send({updated: false, success: true});
        }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
      let artists = await Artist.findOne({
        id: req.params.id
      });  
      console.log("Artists Retrieved - " + req.params.id);
      return res.send(artists);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Artist,
    routes: router,
}