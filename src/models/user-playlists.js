import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  playlists: {
    type: Array,
    of: {
      type: String,
    },
    default: [],
  },
});

export default mongoose.model('UserPlaylists', schema);
