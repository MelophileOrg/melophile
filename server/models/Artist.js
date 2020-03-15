// Dependencies
const mongoose = require('mongoose');

// Artist Schema
const schema = new mongoose.Schema({
  _id: String,
  name: String,
  images: Array,
  genres: Array,
  popularity: Number,
  followers: Number,
});

// Artist Object
const Artist = mongoose.model('Artist', schema);

// Export
module.exports = Artist;