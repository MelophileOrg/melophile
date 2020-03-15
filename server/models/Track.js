// Dependencies
const mongoose = require('mongoose');

// Track Schema
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  images: Array,
  artists: Array, 
  album: Object,  
  popularity: Number,
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

// Track Object
const Track = mongoose.model('Track', schema);

// Export
module.exports = Track;