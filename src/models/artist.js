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
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
    },
  ],
  genres: [
    {
      type: String,
    },
  ],
  popularity: {
    type: Number,
    default: null,
  },
});

export default mongoose.model('Artist', schema);
