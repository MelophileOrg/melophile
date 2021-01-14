import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'Unknown',
  },
  artists: {
    type: Array,
    of: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        default: 'Unknown',
      },
    }
  },
  album: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    default: null,
  },
  key: {
    type: Number,
    default: null,
  },
  mode: {
    type: Number,
    default: null,
  },
  tempo: {
    type: Number,
    default: null,
  },
  valence: {
    type: Number,
    default: null,
  },
  danceability: {
    type: Number,
    default: null,
  },
  energy: {
    type: Number,
    default: null,
  },
  acousticness: {
    type: Number,
    default: null,
  },
  instrumentalness: {
    type: Number,
    default: null,
  },
  liveness: {
    type: Number,
    default: null,
  },
  loudness: {
    type: Number,
    default: null,
  },
  speechiness: {
    type: Number,
    default: null,
  },
});

export default mongoose.model('Track', schema);
