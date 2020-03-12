// Dependencies
const mongoose = require('mongoose');

// Profile Schema
const schema = new mongoose.Schema({
  _id: String,
  username: String,
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
  updated: Date,
});

// Profile Object
const Profile = mongoose.model('Profile', schema);

// Export
module.exports = Profile;