var express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");
let SpotifyWebApi = require('spotify-web-api-node');

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
let User = Items.user;

app.get("/api/", async (req, res) => {
    return res.send({message: "Connection Made"});
});

app.put("/api/images", async (req, res) => {
  try {
    console.log("Hello");
    let tracks = await Tracks.aggregate([ { $sample: { size: 30 } } ]);
    console.log(tracks);
    let images = tracks.map(track => track.image);
    return res.send({ images: images });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////
// ANALYSIS ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

let requestUser = async (token) => {
  if (token == null) return null;
  let spotifyAPI =  new SpotifyWebApi();
  spotifyAPI.setAccessToken(token);
  return (await spotifyAPI.getMe()).body;
}

let convertGenre = async (genre) => {
  let randomArtists = await Artist.find({ genres: genre[0] }).limit(4);
  let newGenre = {name: genre[0], track_num: genre[1].track_num, image: randomArtists.map(artist => artist.image)};
  return newGenre;
}

// { token: STRING, }
app.put("/api/top/saved/:type", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let items;
    switch(req.params.type) {
      case 'artists':
        let convertedItems = [];
        items = await Artist.find({ _id: {$in: userData.topSaved.artists.map(artist => artist._id)}});
        for (let i = 0; i < items.length; i++)  {
          let newItem = {};
          newItem.image = items[i].image;
          newItem._id = items[i]._id;
          newItem.name = items[i].name;
          newItem.genres = items[i].genres;
          newItem.track_num = await userData.topSaved.artists.find(artist => artist._id == items[i]._id).track_num;
          convertedItems.push(newItem);
        }
        return res.send(await convertedItems.sort((a, b) => b.track_num - a.track_num));
      case 'genres':
        let genres = [];
        for (let i = 0; i < userData.topSaved.genres.length; i++) {
          genres.push(await convertGenre(userData.topSaved.genres[i]));
        }
        return res.send(genres);
      default:
        return res.send(null);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/extreme/:feature/:sort", async (req, res) => {
  try {
    console.log(req.params.feature);
    console.log(req.params.sort);
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let sort = {};
    let sortTypes = [-1, 1];
    sort[req.params.feature] = sortTypes[parseInt(req.params.sort, 10)];
    let items = await Track.find({
      _id: { $in : await Object.keys(userData.tracks)}
    }).sort(sort).limit(50);
    return res.send(items);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/timeline/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/user/stats", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/distribution/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/timeline/added", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/history/:year", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/history/:year/:month", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/timeline/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



///////////////////////////////////////////////////////////////
// KNOWN LISTS ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

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






