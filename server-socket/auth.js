let querystring = require('querystring');

const dotenv = require('dotenv');
dotenv.config();

const DEV = true;
let redirectUri = "http://melomaniac.org";
if (DEV) redirectUri = "http://localhost:8080/redirect/";

const spotifyId = process.env.spotifyId;
const spotifySecret = process.env.spotifySecret;

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let auth = function(io) {
    io.of('/auth').on('connection', function(socket) {
        const state = generateRandomString(16);

        socket.on('login', function() {
            socket.emit('authState', {state: state});
            const scopes = [
                'user-read-recently-played',
                'user-top-read',
                'user-library-read',
                'user-read-email',
                'playlist-read-private',
            ];
            socket.emit('loginLink', {link: 'https://accounts.spotify.com/authorize?' +
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
                socket.emit('error', 'State Mismatch');
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
                        socket.emit('granted', {access_token: access_token, refresh_token: refresh_token});
                    } else {
                        socket.emit('error', 'Invalid Token');
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
                socket.emit('granted', {access_token: access_token});
              }
            });
        });
    });
}

module.exports = auth;

