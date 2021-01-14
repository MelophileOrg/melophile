import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  spotify: {
    id: {
      type: String,
      required: false,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  tokens: {
    type: Array,
    of: {
      type: String,
    },
    default: [],
  },
});

export default mongoose.model('User', schema);
