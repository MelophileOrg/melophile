const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const artistsSchema = new mongoose.Schema({
    privacy: Boolean,
    id: String,
    artists: Object,
    created: Date,
});

const Artists = mongoose.model('Artists', artistsSchema);

router.post("/:id", async (req, res) => {
    try {
        let artists = await Artists.find({});
        let found = false;
        for (let i = 0; i < artists.length; i++) {
            if (artists[i].id == req.params.id)
                found = true;
        }
        if (found) {
            let artists = await Artists.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "privacy": req.body.privacy,
                    "artists": req.body.artists,
                    "created": new Date(),
                }
            });
            return res.send({updated: true, success: true});
        }
        else {
            let artists = new Artists({
                privacy: req.body.privacy,
                id: req.params.id,
                artists: req.body.artists,
                created: new Date(),
            });
            await artists.save();
            console.log("Profile Created");
            return res.send({updated: false, success: true});
        }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
      let artists = await Artists.findOne({
        id: req.params.id
      });  
      console.log("Profile Retrieved");
      return res.send(artists);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Artists,
    routes: router,
}