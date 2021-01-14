import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    of: {
      url: {
        type: String,
        required: true,
      },
      width: {
        type: Number,
        required: false,
      },
      height: {
        type: Number,
        required: false,
      },
    },
  },
  privacy: {
    // Overall Profile Visability
    // 'public', 'unlisted', 'private'
    visibility: {
      type: String,
      default: 'unlisted',
    },
    features: {
      averages: {
        type: Boolean,
        default: false,
      },
      distributions: {
        type: Boolean,
        default: false,
      },
      history: {
        type: Boolean,
        default: false,
      }
    },
    topPlayed: {
      tracks: {
        longTerm: {
          type: Boolean,
          default: false,
        },
        mediumTerm: {
          type: Boolean,
          default: false,
        },
        shortTerm: {
          type: Boolean,
          default: false,
        },
      },
      artists: {
        longTerm: {
          type: Boolean,
          default: false,
        },
        mediumTerm: {
          type: Boolean,
          default: false,
        },
        shortTerm: {
          type: Boolean,
          default: false,
        },
      },
    },
    topSaved: {
      artists: {
        type: Boolean,
        default: false,
      },
      genres: {
        type: Boolean,
        default: false,
      },
    },
    history: {
      timeline: {
        type: Boolean,
        default: false,
      },
      artists: {
        type: Boolean,
        default: false,
      },
      genres: {
        type: Boolean,
        default: false,
      },
      months: {
        type: Boolean,
        default: false,
      },
      years: {
        type: Boolean,
        default: false,
      },
    },
  },
});

export default mongoose.model('Profile', schema);
