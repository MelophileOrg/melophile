// Required Modules
let express = require('express');
let bodyParser = require("body-parser");
let mongoose = require('mongoose');
let socket = require('socket.io');
let cookieParser = require("cookie-parser");
let querystring = require('querystring');
let request = require('request');
let dotenv = require('dotenv');
let util = require('./helperfunctions.js');
let SpotifyWebApi = require('spotify-web-api-node');
let Items = require("./items.js");
let Process = require("./process.js");

// Connect Mongoose
mongoose.connect('mongodb://localhost:27017/melomaniac5', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schemas
let Track = Items.track;
let Artist = Items.artist;
let Playlist = Items.playlist;
let User = Items.user;

// Server Settings
let app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Start Server
let server = app.listen(3002, function(){
    console.log("Listening on 3002");
});

// Secret and IDs
dotenv.config();
let DEV = true;
let spotifyId = process.env.spotifyId;
let spotifySecret = process.env.spotifySecret;

// Variables
let clients = [];
let state = util.generateRandomString(16);
let redirectUri = "http://melophile.org/redirect/";
if (DEV) redirectUri = "http://localhost:8080/redirect/";

// Create Web-Socket
let io = socket(server);
//////////////////////////////////////////////////////////////////////////////////////////////
// SOCKET INSTANCE ///////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket) {
    clients.push(socket.id);
    console.log(socket.id);

    //////////////////////////////////////////////////////////////////////////////////
    // INSTANCE VARIABLES ////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    let accessToken = null;
    let spotifyAPI = new SpotifyWebApi();
    let tokenSet = false;
    let userID = null;
    let user = null;
    let processed = false;

    let tracks = [];
    let artists = [];
    let playlists = [];
    let albums = [];
    
    //////////////////////////////////////////////////////////////////////////////////
    // AUTHORIZATION /////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    socket.on('login', function() {
        socket.emit('AuthState', {state: state});
        const scopes = ['user-read-recently-played','user-top-read','user-library-read','user-read-email','playlist-read-private',];
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

    let createUser = async function(userData) {
        try {
            let user = new User({
                _id: userData.id,
                updated: new Date(),
                username: userData.display_name,
                images: userData.images,
                tracks: {},
                artists: {},
                genres: {},
                topPlayed: {
                    tracks: [],
                    artists: [],
                },
                playlists: [],
                privacy: {
                    public: false,
                    protected: true,
                    values: false, // saved songs, artists, genres,
                    average: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        mode: false,
                        loudness: false,
                        key: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    distribution: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        mode: false,
                        loudness: false,
                        key: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    topPlayed: {
                        tracks: false,
                        artists: false,
                    },
                    topSaved: {
                        artists: false,
                        genres: false,
                    },
                    extremes: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        loudness: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    timeline: {
                        added: false,
                        months: false,
                        years: false,
                        features: {
                            valence: false,
                            danceability: false,
                            energy: false,
                            tempo: false,
                            loudness: false,
                            speechiness: false,
                            instrumentalness: false,
                            acousticness: false,
                            liveness: false,
                        },
                        artists: false,
                        genres: false,
                    },
                },
                averages: null,
                distributions: null,
            });
            await user.save();
            process();
        } catch(error) {
            console.log(error);
        }
    };

    let inicialize = async function(access_token) {
        try {
            accessToken = access_token;
            await spotifyAPI.setAccessToken(accessToken);
            tokenSet = true;
            let userData = await spotifyAPI.getMe();
            userID = userData.body.id;
            let savedUser = await User.findOne({ _id: userID });
            if (savedUser == null) {
                createUser(userData.body);
            } else {
                user = savedUser;
                processed = true;
            }
        } catch(error) {
            console.log(error);
        }
    };

    socket.on('callback', function(data) {
        let code = data.code || null;
        let givenState = data.state || null;
        let storedState = state || null;
        if (givenState === null || givenState !== storedState) {
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
              inicialize(body.access_token);
              refresh_token = body.refresh_token;
              socket.emit('AuthGranted', {access_token: body.access_token, refresh_token: refresh_token});
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
            inicialize(body.access_token);
            socket.emit('AuthGranted', {access_token: body.access_token});
        }
        });
    });

    ////////////////////////////////////////////////////////////////////////////
    // PROCESSING //////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    let process = async function() {
        processed = false;
        let processor = new Process.MelomaniacProcessor(accessToken, socket, spotifyAPI, userID);
        await processor.start();
        socket.emit('ProcessDone');
        processed = true;
        generalData();
    }

    socket.on('process', function(data) {
        process();
    });

    ////////////////////////////////////////////////////////////////////////////
    // ANALYSIS ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    let collectUserTracks = async function() {
        try {
            let tracks = await Track.find({"_id": {$in: Object.keys(user.tracks)}});
            return tracks;
        } catch (error) {
            console.log(error);
        }
    }

    let generalData = async function() {
        try {
            let tracks = await collectUserTracks();
            let averages = {
                valence: 0, 
                danceability: 0, 
                energy: 0, 
                acousticness: 0, 
                instrumentalness: 0, 
                liveness: 0, 
                loudness: 0, 
                speechiness: 0, 
                key: 0, 
                mode: 0, 
                tempo: 0, 
            };
            let distributions = {
                valence: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                danceability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                energy: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                acousticness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                instrumentalness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                liveness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            };
            let keys = Object.keys(averages);
            let altKeys = Object.keys(distributions);
            for (let i = 0; i < tracks.length; i++) {
                for (let j = 0; j < keys.length; j++) {
                    averages[keys[j]] += tracks[i][keys[j]];
                    if (altKeys.includes(keys[j])) {
                        distributions[keys[j]][ Math.round(tracks[i][keys[j]] * 20) ] += 1;
                    }
                }
            }
            for (let i = 0; i < keys.length; i++) {
                averages[keys[i]] /= tracks.length;
            }
            socket.emit('AudioFeatureAverages', averages);
            socket.emit('AudioFeatureDistributions', distributions);
            await User.updateOne({
                _id: userID
            }, {
                $set: {
                    'averages': averages,
                    'distributions': distributions,
                }
            });
            
        } catch(error) {
            console.log(error);
        }
    }

    // { query: String, type: Number, offset: Number }
    socket.on('search', async function(data) {
        try {
            let items;
            let key;
            if (data.type == 0) {
                items = await spotifyAPI.search(data.query, ['track'], {limit: 50, offset: data.offset});
                key = "tracks";
            } else if (data.type == 1) {
                items = await spotifyAPI.search(data.query, ['artist'], {limit: 50, offset: data.offset});
                key = "artists";
            } else if (data.type == 2) {
                items = await spotifyAPI.search(data.query, ['album'], {limit: 50, offset: data.offset});
                key = "albums";
            } else if (data.type == 3) {
                items = await spotifyAPI.search(data.query, ['playlist'], {limit: 50, offset: data.offset});
                key = "playlists";
            } else {
                console.log("error");
                return;
            }
            if (data.offset == 0)
                socket.emit('ListStart', {list: items.body[key].items.map(item => item.id)});
            else 
                socket.emit('ListAdd', {list: items.body[key].items.map(item => item.id)});
        } catch(error) {
            console.log(error);
        }
    });
/*
  _id: String,
  name: String,
  artists: Array, 
  album: String,  
  image: String,
  key: Number,
  mode: Number,
  tempo: Number,
  valence: Number,
  danceability: Number,
  energy: Number,
  acousticness: Number,
  instrumentalness: Number,
  liveness: Number,
  loudness: Number,
  speechiness: Number,
*/
    socket.on('requestListTrack', async function(data) {
        try {
            let track = await Track.findOne({ _id: data._id });
            if (track == null) {
                track = await spotifyAPI.getTrack(data._id);
                let image;
                if (track.body.album.images.length == 0) 
                    image = "Undefined";
                else    
                    image = track.body.album.images[0].url;
                let newTrack = {
                    _id: track.body.id,
                    name: track.body.name,
                    artists: track.body.artists.map( function(artist) {
                        return {name: artist.name, _id: artist.id};
                    }),
                    album: {
                        name: track.body.album.name,
                        _id: track.body.album.id,
                    },
                    image: image,
                };
                socket.emit('ListTrack', {_id: data._id, track: newTrack});
            } else {
                socket.emit('ListTrack', {_id: data._id, track: track});
            }
            
        } catch(error) {
            console.log(error);
        }
    });



    socket.on('disconnect', function() {
        clients.splice(clients.indexOf(socket.id), 1);
    });
});









