// Required Modules
let express = require('express');
let socket = require('socket.io');

let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let querystring = require('querystring');
let request = require('request');
let dotenv = require('dotenv');

let mongoose = require('mongoose');

let SpotifyWebApi = require('spotify-web-api-node');
let Process = require("./services/Process.js");

// Connect Mongoose
mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose Schemas
let Track = require("./schemas/TrackSchema.js");
let Artist = require("./schemas/ArtistSchema.js");
let Playlist = require("./schemas/PlaylistSchema.js");
let User = require("./schemas/UserSchema.js");

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

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Variables
let clients = [];
let state = generateRandomString(16);
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

    
    //////////////////////////////////////////////////////////////////////////////////
    // AUTHORIZATION /////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    socket.on('login', function() {
        socket.emit('AuthState', {state: state});
        const scopes = ['user-read-recently-played','user-top-read','user-library-read','user-read-email','playlist-read-private','playlist-modify-public','user-library-modify', 'user-modify-playback-state'];
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
                topSaved: {
                    artists: [],
                    genres: [],
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
        let processor = new Process.MelomaniacProcessor(socket, spotifyAPI, userID);
        await processor.start();
        socket.emit('ProcessDone');
        user = await User.findOne({ _id: userID });
        processed = true;
    }

    socket.on('process', function(data) {
        process();
    });

    socket.on('loggedin', function() {
       socket.emit('LoggedInStatus', tokenSet); 
    });

    socket.on('disconnect', function() {
        clients.splice(clients.indexOf(socket.id), 1);
    });
});









