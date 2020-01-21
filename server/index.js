var express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

var socket = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melomaniac5', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

var server = app.listen(3002, function(){
    console.log("Listening on 3002");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var authorize = async function(userID, fields) {
  try {
    let user = await getUserData(userID);
    if (user == null) return false;
    if (user.privacy.protected) return false;
    let transverse = user;
    for (let i = 0; i < fields.length; i++) {
        if (i < (fields.length - 1)) transverse = transverse[fields[i]];
        else {
            if (fields[i] == 'all') {
                let keys = Object.keys(transverse);
                for (let j = 0; j < keys.length; j++)
                    if (!transverse[keys[j]]) return false;
                return true;
            } else {
                return transverse[fields[i]];
            }
        }
    }
  } catch(error) {
    console.log(error);
  }
};

var getUserData = async function (userID) {
  return await User.findOne({_id: userID});
};

var retrieveUserTracks = async function (user) {
  try {
    return await Track.find({"_id": {$in: user.tracks}});
  } catch(error) {
    console.log(error);
  }
};

var retrieveUserTrackFields = async function (user, projection) {
  try {
    return await Track.find({"_id": {$in: user.tracks}}, projection);
  } catch(error) {
    console.log(error);
  }
};

var getAudioFeatureAverage = function (audioFeature, tracks) {
  try {
    const REDUCER = (accumulator, currentValue) => accumulator + currentValue[audioFeature];
    let total = tracks.reduce(REDUCER);
    return (total / tracks.length);
  } catch(error) {
    console.log(error);
  }
}

var getAudioFeatureDistribution = function (audioFeature, tracks) {
  try {
    let distribution = [];
    for (let i = 0; i < 21; i++) 
        distribution.push(0);
    for (let i = 0; i < tracks.length; i++)
        distribution[Math.round(tracks[i][audioFeature] * 20)] += 1;
    return distribution;
  } catch(error) {
    console.log(error);
  }
};

var getTrackAudioAnalysis = async function (trackID, spotifyAPI) {
  try {
    let segmentNum = 80;
    let audioAnalysis = await spotifyAPI.getAudioAnalysisForTrack(trackID);
    if (audioAnalysis.segments.length < segmentNum) segmentNum = audioAnalysis.segments.length;
    let width = Math.round(audioAnalysis.segments.length / segmentNum);
    let newSegments = [];
    for (var i = 0; i < segmentNum; i++) {
        let itemIndex = Math.round(width * i);
        if (itemIndex > audioAnalysis.segments.length - 1)
            itemIndex = audioAnalysis.segments.length - 2;
        let sum = 0;
        for (var j = 0; j < audioAnalysis.segments[itemIndex].pitches.length; j++)
            sum += audioAnalysis.segments[itemIndex].pitches[j];
        let averagePitch = sum / audioAnalysis.segments[itemIndex].pitches.length; 
        let color = await HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
        let loudness = (Math.round(((audioAnalysis.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);
        newSegments.push({
            start: Math.round(audioAnalysis.segments[itemIndex].start),
            loudness_max: loudness, 
            red: color.r,
            green: color.g,
            blue: color.b,
        });
    }
    return newSegments;
  } catch(error) {
    console.log(error);
  }
};

var HSVtoRGB = function (payload) {
  var r, g, b, i, f, p, q, t;
  i = Math.floor(payload.hue * 6);
  f = payload.hue * 6 - i;
  p = payload.value * (1 - payload.saturation);
  q = payload.value * (1 - f * payload.saturation);
  t = payload.value * (1 - (1 - f) * payload.saturation);
  switch (i % 6) {
    case 0: r = payload.value, g = t, b = p; break;
    case 1: r = q, g = payload.value, b = p; break;
    case 2: r = p, g = payload.value, b = t; break;
    case 3: r = p, g = q, b = payload.value; break;
    case 4: r = t, g = p, b = payload.value; break;
    case 5: r = payload.value, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTANTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var io = socket(server);
let clients = [];
let querystring = require('querystring');
var request = require('request');
const dotenv = require('dotenv');
dotenv.config();
const DEV = true;
let redirectUri = "http://melomaniac.org";
if (DEV) redirectUri = "http://localhost:8080/redirect/";
const spotifyId = process.env.spotifyId;
const spotifySecret = process.env.spotifySecret;
const state = generateRandomString(16);
let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const Playlist = Items.playlist;
const User = Items.user;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SOCKET CONNECTION /////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
  clients.push(socket.id);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // AUTH ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  socket.on('login', function() {
    socket.emit('AuthState', {state: state});
    const scopes = [
      'user-read-recently-played',
      'user-top-read',
      'user-library-read',
      'user-read-email',
      'playlist-read-private',
    ];
    socket.emit('AuthLoginLink', {link: 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: spotifyId,
        scope: scopes.join('%20'),
        redirect_uri: redirectUri,
        state: state,
        show_dialog: 'false',
    })});
  });

  socket.on('callback', function(data) {
    let code = data.code || null;
    let givenState = data.state || null;
    let storedState = state || null;
    if (givenState === null || givenState !== storedState) {
      socket.emit('ConsoleLog', {message: 'State Mismatch'});
      console.log("State Mismatch");
      return;
    } else {
      let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(spotifyId + ':' + spotifySecret).toString('base64'))
        },
        json: true
      };
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          let access_token = body.access_token,
          refresh_token = body.refresh_token;
          socket.emit('AuthGranted', {access_token: access_token, refresh_token: refresh_token});
        } else {
          socket.emit('ConsoleLog', {message: 'Invalid Token'});
          console.log("Invalid Token");
        }
      });
    }
  });

  socket.on('refresh', function(data) {
      let refresh_token = data.refresh_token;
      let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyId + ':' + spotifySecret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
      };
    
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token;
          socket.emit('AuthGranted', {access_token: access_token});
        }
      });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // PROCESS /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  socket.on('process', async function(data) {
    try {
      let processor = await new MelomaniacProcessor(data.accessToken, socket);
      await processor.start();
      socket.emit('ConsoleLog', {message: "Done"});
    }
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ANALYSIS ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  let spotifyAPI = new SpotifyWebApi();
  let userID = null;

  socket.on('inicialize_analysis', async function(data) {
      try {
          await spotifyAPI.setAccessToken(data.accessToken);
          let user = await spotifyAPI.getMe();
          userID = user.id;
          this.socket.emit('AnalysisReady');
      } catch(error) {
          console.log(error);
      }
  });

  socket.on('values', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'values'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });
  
  // {id: String}
  socket.on('album', async function(data) { 
      try {

      } catch(error) {
          console.log(error);
      }
  });

  // {id: String}
  socket.on('artist', async function(data) { 
      try {

      } catch(error) {
          console.log(error);
      }
  });

  // {id: String}
  socket.on('genre', async function(data) { 
      try {

      } catch(error) {
          console.log(error);
      }
  });

  // {id: String}
  socket.on('playlist', async function(data) { 
      try {

      } catch(error) {
          console.log(error);
      }
  });

  // {trackID: String}
  /*
      Track = {
      name: String,
      album: {
          name: String,
          image: String,
          relatedTracks: Array
      },
      artist: {
          name: String,
          followers: Number,
          likedTracks: Number
      },
      audioAnalysis: Array,
      audioFeatures: {
          valence: Number,
          energy: Number,
          danceability: Number,
          popularity: Number,
          +.3
          banger: Number,
          key: Number,
          mode: Number,
          tempo: Number,
          duration: Number,
      },
      percentile: {
          valence: Number,
          energy: Number,
          danceability: Number,
      },
      genre: Array,
      }
*/
  socket.on('track', async function(data) { 
      try {
          let track = await Track.find({_id: data.trackID});
          track.analysis = await getTrackAudioAnalysis(data.trackID, spotifyAPI);
          track.artists = await getTrackArtists(track.artists, spotifyAPI);
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, audioFeature: String}
  socket.on('feature_average_single', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'average', data.audioFeature])) {
              let projection = {};
              projection[data.audioFeature] = 1;
              let tracks = await retrieveUserTrackFields(await getUserData(userID), projection);
              let average = await getAudioFeatureAverage(data.audioFeature, tracks);
              socket.emit('FeatureAverage_' + data.audioFeature, {average: average});
          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('feature_average_all', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'average', 'all'])) {
              let tracks = await retrieveUserTracks(await getUserData(userID));
              let audioFeatures = ["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "loudness", "speechiness", "key", "mode", "tempo"];
              let averages = {};
              for (let i = 0; i < audioFeatures.length; i++) {
                  averages[audioFeatures[i]] = await getAudioFeatureAverage(audioFeatures[i], tracks);
              }
              socket.emit('FeatureAverage_All' + data.audioFeature, {average: averages});
          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, audioFeature: String}
  socket.on('feature_distribution_single', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'distribution', data.audioFeature])) {
              let projection = {};
              projection[data.audioFeature] = 1;
              let tracks = await retrieveUserTrackFields(await getUserData(userID), projection);
              let distribution = await getAudioFeatureDistribution(data.audioFeature, tracks);
              socket.emit('FeatureDistribution_' + data.audioFeature, {distribution: distribution});
          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('feature_distribution_all', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'distribution', 'all'])) {
              let tracks = await retrieveUserTracks(await getUserData(userID));
              let audioFeatures = ["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "loudness", "speechiness", "key", "mode", "tempo"];
              let distributions = {};
              for (let i = 0; i < audioFeatures.length; i++) {
                  distributions[audioFeatures[i]] = await getAudioFeatureDistribution(audioFeatures[i], tracks);
              }
              socket.emit('FeatureDistribution_All' + data.audioFeature, {distributions: distributions});
          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('timeline_added', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'added'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, audioFeature: String}
  socket.on('timeline_feature_single', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'features', data.audioFeature])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('timeline_feature_all', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'features', 'all'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, month: Number, year: Number}
  socket.on('timeline_month', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'months'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, year: Number}
  socket.on('timeline_year', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'years'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('timeline_artists', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'artists'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String}
  socket.on('timeline_genres', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'genres'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, offset: Number}
  socket.on('chart_played_tracks', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'topPlayed', 'tracks'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, offset: Number}
  socket.on('chart_played_artists', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'topPlayed', 'artists'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, offset: Number}
  socket.on('chart_saved_artists', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'topSaved', 'artists'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, offset: Number}
  socket.on('chart_saved_genres', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'topSaved', 'genres'])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, audioFeature: Number, offset: Number}
  socket.on('chart_extremes_max', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'extremes', data.audioFeature])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {userID: String, audioFeature: Number, offset: Number}
  socket.on('chart_extremes_min', async function(data) { 
      try {
          if (data.userID == userID || authorize(userID, ['privacy', 'extremes', data.audioFeature])) {

          }
      } catch(error) {
          console.log(error);
      }
  });

  // {query: String, offset: Number, type: String}
  socket.on('search', async function(data) { 
      let response = await spotifyAPI.search(data.query, [data.type], {limit: 50, offset: data.offest});
      socket.emit('Search', {results: response.data});
  });

  // {query: Object, offset: Number}
  socket.on('recommend', async function(data) { 

  });


  socket.on('disconnect', function() {
    clients.splice(clients.indexOf(socket.id), 1);
  });
});




