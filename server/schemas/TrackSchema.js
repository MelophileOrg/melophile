const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  _id: String,
  name: String,
  artists: Array, 
  album: Object,  
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
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;