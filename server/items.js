const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  _id: String,
  name: String,
  artists: Array, 
  album: Object,  
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

const userSchema = new mongoose.Schema({
  _id: String,
  username: String,
  images: Array,
  tracks: Object, // id: {dateAdded: Number}
  artists: Object, // id: [trackIDs]
  genres: Object, // id: [artistIDs]
  topPlayed: {
    tracks: Array, // [trackIDs]
    artists: Array, // [artistIDs]
  },
  topSaved: {
    artists: Array,
    genres: Array,
  },
  playlists: Array, // [playlistIDs]
  privacy: Object,
  averages: Object,
  distributions: Object,
});
const User = mongoose.model('User', userSchema);

module.exports = {
    track: Track,
    artist: Artist,
    playlist: Playlist,
    user: User,
}