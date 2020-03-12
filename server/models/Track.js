// Dependencies
const mongoose = require('mongoose');

// Track Schema
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  artists: Array, 
  album: Object,  
  images: Array,
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
  popularity: Number,
});

// Track Object
const Track = mongoose.model('Track', schema);

// Export
module.exports = Track;