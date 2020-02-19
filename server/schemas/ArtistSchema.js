const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: String,
  name: String,
  image: Array,
  genres: Array,
  popularity: Number,
});

const ArtistSchema = mongoose.model('ArtistSchema', schema);

module.exports = ArtistSchema;