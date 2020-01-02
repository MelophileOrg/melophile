const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const profileSchema = new mongoose.Schema({
    privacy: Boolean,
    id: String,
    name: String,
    topPlayed: Array,
    topArtists: Array,
    tracks: Array,
    artists: Object,
    favoriteArtists: Array,
    genres: Object,
    favoriteGenres: Array,
    dates: Array,
    audio_features: Object,
    bangers: Object,
    created: Date,
});

const Profile = mongoose.model('Profile', profileSchema);

router.post("/:id", async (req, res) => {
    try {
        let profiles = await Profile.find({});
        let found = false;
        for (let i = 0; i < profiles.length; i++)
        {
            if (profiles[i].id == req.params.id)
            {
                found = true;
            }
        }
        if (found) {
            let profile = await Profile.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "privacy": req.body.privacy,
                    "tracks": req.body.tracks,
                    "name": req.body.name,
                    "topPlayed": req.body.topPlayed,
                    "topArtists": req.body.topArtists,
                    "artists": req.body.artists,
                    "favoriteArtists": req.body.favoriteArtists,
                    "genres": req.body.genres,
                    "favoriteGenres": req.body.favoriteGenres,
                    "dates": req.body.dates,
                    "audio_features": req.body.audio_features,
                    "bangers": req.body.bangers,
                    "created": new Date(),
                }
            });
            console.log(profile);
            console.log("Profile Updated");
            return res.send(profile);
        }
        else {
            let profile = new Profile({
                privacy: req.body.privacy,
                id: req.params.id,
                name: req.body.name,
                topPlayed: req.body.topPlayed,
                topArtists: req.body.topArtists,
                tracks: req.body.tracks,
                artists: req.body.artists,
                favoriteArtists: req.body.favoriteArtists,
                genres: req.body.genres,
                favoriteGenres: req.body.favoriteGenres,
                dates: req.body.dates,
                audio_features: req.body.audio_features,
                bangers: req.body.bangers,
                created: new Date(),
            });
            console.log(profile);
            await profile.save();
            console.log("Profile Created");
            return res.send(profile);
        }
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/", async (req, res) => {
    try {
      let profiles = await Profile.find({
        privacy: false,
      });
      console.log("Profiles Retrieved");
      return res.send(profiles);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
      let profile = await Profile.findOne({
        id: req.params.id
      });  
      console.log(profile);
      console.log("Profile Retrieved");
      return res.send(profile);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});


module.exports = {
    model: Profile,
    routes: router,
}