import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => {
      const interval = 1000 * 60 * 60 * 24;
      return Math.floor(Date.now() / interval) * interval;
    },
  },
  newUsers: {
    type: Number,
    default: 0,
  },
  logins: {
    type: Number,
    default: 0,
  },
  logouts: {
    type: Number,
    default: 0,
  },
  processes: {
    type: Number,
    default: 0,
  },
  analysis: {
    track: {
      type: Number,
      default: 0,
    },
    artist: {
      type: Number,
      default: 0,
    },
    album: {
      type: Number,
      default: 0,
    },
    playlist: {
      type: Number,
      default: 0,
    },
    genre: {
      type: Number,
      default: 0,
    },
  },
  history: {
    overallVisits: {
      type: Number,
      default: 0,
    },
    monthVisits: {
      type: Number,
      default: 0,
    },
    yearVisits: {
      type: Number,
      default: 0,
    },
  },
  profileVisits: {
    self: {
      type: Number,
      default: 0,
    },
    others: {
      type: Number,
      default: 0,
    },
  },
  searches: {
    type: Number,
    default: 0,
  },
  social: {
    posts: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  radios: {
    type: Number,
    default: 0,
  },
  charts: {
    played: {
      tracks: {
        long: {
          type: Number,
          default: 0,
        },
        medium: {
          type: Number,
          default: 0,
        },
        short: {
          type: Number,
          default: 0,
        },
      },
      artists: {
        long: {
          type: Number,
          default: 0,
        },
        medium: {
          type: Number,
          default: 0,
        },
        short: {
          type: Number,
          default: 0,
        },
      },
    },
    saved: {
      artists: {
        type: Number,
        default: 0,
      },
      genres: {
        type: Number,
        default: 0,
      },
    },
    extremes: {
      tempo: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      valence: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      danceability: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      energy: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      acousticness: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      instrumentalness: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      liveness: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      loudness: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
      speechiness: {
        max: {
          type: Number,
          default: 0,
        },
        min: {
          type: Number,
          default: 0,
        }
      },
    },
  },
});

export default mongoose.model('DailyStatistics', schema);
