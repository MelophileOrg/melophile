const mongoose = require('mongoose');
const express = require("express");
const { checkSchema, body } = require('express-validator');
const router = express.Router();

// Track Object
const trackSchema = new mongoose.Schema({
    id: String,
    name: String,
    album: String,
    image: String,
    artists: Array,
});
const Track = mongoose.model('Track', trackSchema);

// User Track Ids
const profileTracksSchema = new mongoose.Schema({
    id: String,
    tracks: Array,
    created: Date,
});
const ProfileTracks = mongoose.model('ProfileTracks', profileTracksSchema);

// { tracks: Object }
router.post("/:id", checkSchema({
    id: {
        in: ['params', 'query'],
        errorMessage: 'ID is wrong',
    },
    tracks: {
        in: ['body'],
        errorMessage: 'Tracks is wrong',
    }
}), async (req, res) => { 
    try {
        let updated = true;
        let trackIds = Object.keys(req.body.tracks);
        let updatedProfile = await ProfileTracks.findAndModify({
            query: { id: req.params.id },
            update: { $set: {
                "tracks": trackIds,
                "created": new Date(),
            }},
            new: true,
        });
        if (updatedProfile == null)
            updated = false;
        if (!updated) {
            let newProfile = new ProfileTracks({
                id: req.params.id,
                tracks: trackIds,
                created: new Date(),
            });
            await newProfile.save();
            console.log("Tracks Saved - " + req.params.id);
        }
        else {
            console.log("Tracks Updated - " + req.params.id);
        }
        for (let i = 0; i < trackIds.length; i++) {
            if ((await Track.findOne({id: trackIds[i]}) == null)) {
                let newTrack = new Track({
                    id: trackIds[i],
                    name: req.body.tracks[trackIds[i]].name,
                    album: req.body.tracks[trackIds[i]].album,
                    image: req.body.tracks[trackIds[i]].image,
                    artists: req.body.tracks[trackIds[i]].artists,
                });
                await newTrack.save();
            }
        }
        return res.send({updated: updated, success: true});
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", body().custom(value => {
    console.log("Checking Body");
    console.log(value);
    if (Object.keys(value).length > 0)
        return Promise.reject('Empty Body Required.');
}), checkSchema({
    id: {
        in: ['params', 'query'],
        errorMessage: 'ID is wrong',
    },
}), async (req, res) => {
    try {
      let profileTracks = await ProfileTracks.findOne({
        id: req.params.id
      }); 
      let trackObjects = {}; 
      for (let i = 0; i < profileTracks.tracks.length; i++) {
        trackObjects[profileTracks.tracks[i]] = await Track.findOne({
            id: profileTracks.tracks[i],
        })
      }
      profileTracks.tracks = trackObjects;
      console.log("Tracks Retrieved - " + req.params.id);
      return res.send(profileTracks);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Track,
    routes: router,
}