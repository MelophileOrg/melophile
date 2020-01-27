var express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Mongoose Schemas
let Items = require("./items.js");
let Track = Items.track;
let Artist = Items.artist;
let Playlist = Items.playlist;

app.put("/api/images", async (req, res) => {
  try {
    let tracks = await Tracks.aggregate([ { $sample: { size: 30 } } ]);
    console.log(tracks);
    let images = tracks.map(track => track.image);
    return res.send({ images: images });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// { ids: [] }
app.put("/api/tracks", async (req, res) => {
  try {
    console.log(req.body);
    let tracks = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      tracks[req.body.ids[i]] = await Track.findOne({ _id: req.body.ids[i] });
    return res.send({ tracks: tracks });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/tracks/:id", async (req, res) => {
  try {
    let track = await Track.findOne({ _id: req.params.id });
    return res.send({ track: track });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// { ids: [] }
app.put("/api/artists", async (req, res) => {
  try {
    let artists = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      artists[req.body.ids[i]] = await Artist.findOne({ _id: req.body.ids[i] });
    return res.send({ artists: artists });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/artists/:id", async (req, res) => {
  try {
    let artist = await Artist.findOne({ _id: req.params.id });
    return res.send({ artist: artist });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// { ids: [] }
app.put("/api/playlists", async (req, res) => {
  try {
    let playlists = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      playlists[req.body.ids[i]] = await Playlist.findOne({ _id: req.body.ids[i] });
    return res.send({ playlists: playlists });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/playlists/:id", async (req, res) => {
  try {
    let playlist = await Playlist.findOne({ _id: req.params.id });
    return res.send({ playlist: playlist });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

var server = app.listen(3003, function(){
    console.log("Listening on 3003");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));






