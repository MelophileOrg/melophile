const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const collectionsSchema = new mongoose.Schema({
    id: String,
    topPlayed: {
        tracks: Array,
        artists: Array,
    },
    topSaved: {
        artists: Array,
        genres: Array,
    },
    audioFeatures: {
        acousticness: Object,
        danceability: Object,
        energy: Object,
        instrumentalness: Object,
        liveness: Object,
        loudness: Object,
        speechiness: Object,
        valence: Object,
        tempo: Object,
        banger: Object,
    },
    mode: Object,
    dateAdded: Array,
    happinessTimeline: Array,
    created: Date,
});

const Collections = mongoose.model('Collections', collectionsSchema);

router.post("/:id", async (req, res) => {
    try {
        let collections = await Collections.find({});
        let found = false;
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].id == req.params.id)
                found = true;
        }
        if (found) {
            let collections = await Collections.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "topPlayed.tracks": req.body.topPlayed.tracks,
                    "topPlayed.artists": req.body.topPlayed.artists,
                    "topSaved.artists": req.body.topSaved.artists,
                    "topSaved.genres": req.body.topSaved.genres,
                    "audioFeatures.acousticness": req.body.audioFeatures.acousticness,
                    "audioFeatures.danceability": req.body.audioFeatures.danceability,
                    "audioFeatures.energy": req.body.audioFeatures.energy,
                    "audioFeatures.instrumentalness": req.body.audioFeatures.instrumentalness,
                    "audioFeatures.liveness": req.body.audioFeatures.liveness,
                    "audioFeatures.loudness": req.body.audioFeatures.loudness,
                    "audioFeatures.speechiness": req.body.audioFeatures.speechiness,
                    "audioFeatures.valence": req.body.audioFeatures.valence,
                    "audioFeatures.tempo": req.body.audioFeatures.tempo,
                    "audioFeatures.banger": req.body.audioFeatures.banger,
                    "mode.value": req.body.mode,
                    "dateAdded": req.body.dateAdded,
                    "happinessTimeline": req.body.happinessTimeline,
                    "created": new Date(),
                }
            });
            console.log("Collections Updated - " + req.params.id);
            return res.send({updated: true, success: true});
        }
        else {
            let collections = new Collections({
                id: req.params.id,
                topPlayed: {
                    tracks: req.body.topPlayed.tracks,
                    artists: req.body.topPlayed.artists,
                },
                topSaved: {
                    artists: req.body.topSaved.artists,
                    genres: req.body.topSaved.genres,
                },
                audioFeatures: {
                    acousticness: req.body.audioFeatures.acousticness,
                    danceability: req.body.audioFeatures.danceability,
                    energy: req.body.audioFeatures.energy,
                    instrumentalness: req.body.audioFeatures.instrumentalness,
                    liveness: req.body.audioFeatures.liveness,
                    loudness: req.body.audioFeatures.loudness,
                    speechiness: req.body.audioFeatures.speechiness,
                    valence: req.body.audioFeatures.valence,
                    tempo: req.body.audioFeatures.tempo,
                    banger: req.body.audioFeatures.banger,
                },
                mode: {
                    value: req.body.mode
                },
                dateAdded: req.body.dateAdded,
                happinessTimeline: req.body.happinessTimeline,
                created: new Date(),
            });
            await collections.save();
            console.log("Collections Created - " + req.params.id);
            return res.send({updated: false, success: true});
        }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
      let collections = await Collections.findOne({
        id: req.params.id
      });  
      console.log("Collections Retrieved - " + req.params.id);
      return res.send(collections);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Collections,
    routes: router,
}