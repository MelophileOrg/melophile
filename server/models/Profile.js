// Dependencies
const mongoose = require('mongoose');

// Related Schemas
let User = require('./User.js');

// Profile Schema
const schema = new mongoose.Schema({
  user: String,
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