import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  snapshot_id: {
    type: String,
    required: true,
  },
  owner: {
    id: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      default: 'Unknown',
    },
  },
  name: {
    type: String,
    default: 'Unknown',
  },
  description: {
    type: String,
    default: '',
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  public: {
    type: Boolean,
    default: false,
  },
  tracks: [
    {
      added: {
        type: Date,
        default: null,
      },
      addedBy: {
        type: String,
        default: 'Unknown',
      },
      id: {
        type: String,
        required: true,
      },
    },
  ],
  averages: {
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
  },
});

export default mongoose.model('Playlist', schema);
