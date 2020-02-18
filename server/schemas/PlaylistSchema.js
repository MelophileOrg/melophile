const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    _id: String,
    name: String, 
    owner: Object,
    image: String,
    description: String,
    public: Boolean,
    tracks: Object,
  });

  const Playlist = mongoose.model('Playlist', playlistSchema);
  
  module.exports = Playlist;