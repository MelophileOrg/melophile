const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  _id: String,
  name: String,
  image: Array,
  genres: Array,
  popularity: Number,
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;