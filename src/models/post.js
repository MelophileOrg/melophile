import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  itemID: {
    type: String,
    default: null,
  },
  itemType: {
    type: String,
    default: null,
  },
  likes: {
    type: Array,
    default: [],
    of: {
      // id
      type: String,
    }
  },
  comments: {
    type: Array,
    of: {
      username: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
  },
  created: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model('Post', schema);
