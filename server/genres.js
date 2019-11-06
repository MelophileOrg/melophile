const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const genreSchema = new mongoose.Schema({
    id: String,
    genres: Object,
    created: Date,
});

const Genre = mongoose.model('Genre', genreSchema);

router.post("/:id", async (req, res) => {
    try {
        let genres = await Genre.find({});
        let found = false;
        for (let i = 0; i < genres.length; i++) {
            if (genres[i].id == req.params.id)
                found = true;
        }
        if (found) {
            let genres = await Genre.updateOne({
                id: req.params.id,
            }, {
                $set: {
                    "genres": req.body.genres,
                    "created": new Date(),
                }
            });
            return res.send({updated: true, success: true});
        }
        else {
            let genre = new Genre({
                id: req.params.id,
                genres: req.body.genres,
                created: new Date(),
            });
            await genre.save();
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
    model: Genre,
    routes: router,
}