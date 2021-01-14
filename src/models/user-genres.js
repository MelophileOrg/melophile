import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  genres: {
    type: Map,
    of: {
      artists: {
        type: Array,
        of: String,
        required: true,
      },
      trackNum: {
        type: Number,
        required: true,
      },
    },
    default: {},
  },
});

export default mongoose.model('UserGenres', schema);
