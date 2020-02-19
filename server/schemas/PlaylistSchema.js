const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: String,
    name: String, 
    owner: Object,
    image: String,
    description: String,
    public: Boolean,
    tracks: Object,
  });

  const PlaylistSchema = mongoose.model('PlaylistSchema', schema);
  
  module.exports = PlaylistSchema;