import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  artists: {
    type: Map,
    of: {
      type: Array,
      of: String,
      default: [],
    },
    default: {},
  },
});

export default mongoose.model('UserArtists', schema);
