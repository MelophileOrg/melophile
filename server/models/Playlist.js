// Dependencies
const mongoose = require('mongoose');
// Playlist Schema
const schema = new mongoose.Schema({
    _id: String,
    name: String, 
    description: String,
    owner: Object,
    images: Array,
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
// Playlist Object
const Playlist = mongoose.model('Playlist', schema);
// Export 
module.exports = Playlist;