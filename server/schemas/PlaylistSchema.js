const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: String,
    name: String, 
    owner: Object,
    image: String,
    description: String,
    public: Boolean,
    tracks: Object,
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

  const PlaylistSchema = mongoose.model('PlaylistSchema', schema);
  
  module.exports = PlaylistSchema;