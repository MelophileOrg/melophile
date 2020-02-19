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

    let inicialize = async function(access_token) {
        try {
            accessToken = access_token;
            await spotifyAPI.setAccessToken(accessToken);
            tokenSet = true;
            let response = await spotifyAPI.getMe();
            userID = response.body.id;
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
        let processor = new Process(socket, spotifyAPI, userID);
        await processor.start();
        socket.emit('ProcessDone');
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









