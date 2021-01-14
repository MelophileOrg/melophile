import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  tracks: {
    type: Map,
    of: String,
    default: {},
  },
});

export default mongoose.model('UserTracks', schema);
