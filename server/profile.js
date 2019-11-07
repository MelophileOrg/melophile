const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const profileSchema = new mongoose.Schema({
    privacy: Boolean,
    id: String,
    name: String,
    include: Object,
    tracks: Number,
    artist: Number,
    genres: Number,
    likes: Array,
    created: Date,
});

const Profile = mongoose.model('Profile', profileSchema);

router.post("/:id", async (req, res) => {
    try {
        let profiles = await Profile.find({});
        let found = false;
        console.log(req.body.artists);
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
                    "name": req.body.name,
                    "include": req.body.include,
                    "tracks": req.body.tracks,
                    "artists": req.body.artists,
                    "genres": req.body.genres,
                    "created": new Date(),
                }
            });
            console.log("Profile Updated - " + req.params.id);
            return res.send({updated: true, success: true});
        }
        else {
            let profile = new Profile({
                privacy: req.body.privacy,
                id: req.params.id,
                name: req.body.name,
                include: req.body.include,
                tracks: req.body.tracks,
                artists: req.body.artists,
                genres: req.body.genres,
                likes: [],
                created: new Date(),
            });
            await profile.save();
            console.log("Profile Created - " + req.params.id);
            return res.send({updated: false, success: true});
        }
    } catch (error) {
      console.log(error);
      return res.send({updated: false, success: false});
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
      return res.send(Status(500));
    }
});

router.get("/:id", async (req, res) => {
    try {
      let profile = await Profile.findOne({
        id: req.params.id
      });  
      console.log("Profile Retrieved - " + req.params.id);
      return res.send(profile);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
});

router.put("/like/:id", async (req, res) => {
  try {
    let profile = await Profile.findOne({
      id: req.params.id
    });  
    for (let i = 0; i < profile.likes.length; i++) {
      if (req.body.id == profile.likes[i]) {
        return res.send({success: false});
      }
    }
    profile.likes.push(req.body.id);
    await Profile.updateOne({
      id: req.params.id,
    }, {
        $set: {
          "likes": profile.likes,
        }
    })
    console.log("Profile Liked - " + req.params.id);
    return res.send({success: true});
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


module.exports = {
    model: Profile,
    routes: router,
}