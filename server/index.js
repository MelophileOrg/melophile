//server-spotify-3002
const express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

var cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melomaniac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

let SpotifyWebApi = require('spotify-web-api-js');
let spotifyApi = new SpotifyWebApi();

const trackSchema = new mongoose.Schema({
  id: String,
  name: String,
  artists: Array, 
  album: String,  
  image: String,
  key: Number,
  mode: Number,
  tempo: Number,
  valence: Number,
  danceability: Number,
  energy: Number,
  acousticness: Number,
  instrumentalness: Number,
  liveness: Number,
  loudness: Number,
  speechiness: Number,
  analysis: Array,
});
const Track = mongoose.model('Track', trackSchema);

const artistSchema = new mongoose.Schema({
  id: String,
  name: String, 
  images: Array,
  genres: Array,
  profile: String,
  urls: Array,
  members: Array,
});
const Artist = mongoose.model('Artist', artistSchema);

const userSchema = new mongoose.Schema({
  id: String,
  tracks: Array,
});
const User = mongoose.model('User', userSchema);

const auth = require("./auth.js");
app.use("/api/auth", auth.routes);


app.listen(3002, () => console.log('Server listening on port 3002!'));
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));