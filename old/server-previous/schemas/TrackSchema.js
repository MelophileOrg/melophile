const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
  popularity: Number,
});

const TrackSchema = mongoose.model('TrackSchema', schema);

module.exports = TrackSchema;