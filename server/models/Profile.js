// Dependencies
const mongoose = require('mongoose');
let User = require('./User');

// Profile Schema
const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  tokens: [],
  images: Array,
  tracks: Object, // id: {dateAdded: Number}
  artists: Object, // id: [trackIDs]
  genres: Object, // id: [artistIDs]
  playlists: Array, // playlistIDs
  topPlayed: {
    tracks: Array, // trackIDs
    artists: Array, // artistIDs
  },
  topSaved: {
    artists: Array, // artistIDs
    genres: Array, // genreIDs
  },
  audioFeatures: Object,
  history: Object,
  privacy: Object,
  updated: {
    type: Date,
    default: Date.now
  },
});

// Profile Object
const Profile = mongoose.model('Profile', schema);

// Export
module.exports = Profile;