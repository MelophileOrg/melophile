const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    _id: String,
    name: String,
    artists: Array, 
    album: String,  
    image: String,
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
  const Track = mongoose.model('Track', trackSchema);
  
  const artistSchema = new mongoose.Schema({
    _id: String,
    name: String, 
    image: Array,
    genres: Array,
  });
  const Artist = mongoose.model('Artist', artistSchema);
  
  const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    images: Array,
    tracks: Array,
    topPlayed: {
      tracks: Array,
      artists: Array,
    },
    privacy: Object,
  });
  const User = mongoose.model('User', userSchema);
  
  module.exports = {
    track: Track,
    artist: Artist,
    //genre: Genre,
    //album: Album,
    //playlist: Playlist,
    user: User,
}