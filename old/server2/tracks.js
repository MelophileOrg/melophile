const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const tracksSchema = new mongoose.Schema({
    id: String,
    tracks: Object,
    created: Date,
});

const Tracks = mongoose.model('Tracks', tracksSchema);

router.post("/:id", async (req, res) => {
    try {
        let tracks = await Tracks.find({});
        let found = false;
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].id == req.params.id)
                found = true;
        }
        if (found) {
            let tracks = await Tracks.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "tracks": req.body.tracks,
                    "created": new Date(),
                }
            });
            console.log("Tracks Updated - " + req.params.id);
            return res.send({updated: true, success: true});
        }
        else {
            let tracks = new Tracks({
                id: req.params.id,
                tracks: req.body.tracks,
                created: new Date(),
            });
            await tracks.save();
            console.log("Tracks Saved - " + req.params.id);
            return res.send({updated: false, success: true});
        }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
      let tracks = await Tracks.findOne({
        id: req.params.id
      });  
      console.log("Tracks Retrieved - " + req.params.id);
      return res.send(tracks);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Tracks,
    routes: router,
}