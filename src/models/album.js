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
  artists: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        default: 'Unknown',
      },
    },
  ],
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
});

export default mongoose.model('Album', schema);
