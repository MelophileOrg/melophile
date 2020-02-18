const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  images: Array,
  tracks: Object, // id: {dateAdded: Number}
  artists: Object, // id: [trackIDs]
  genres: Object, // id: [artistIDs]
  playlists: Array, // [playlistIDs]
  topPlayed: {
    tracks: Array, // [trackIDs]
    artists: Array, // [artistIDs]
  },
  topSaved: {
    artists: Array,
    genres: Array,
  },
  audioFeatures: Object,
  history: Object,
  privacy: Object,
  updated: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;