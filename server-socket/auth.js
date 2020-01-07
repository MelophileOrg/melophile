let querystring = require('querystring');

const dotenv = require('dotenv');
dotenv.config();

const DEV = true;
let redirectUri = "http://melomaniac.org";
if (DEV) redirectUri = "http://localhost:8080/redirect/";

const spotifyId = process.env.spotifyId;
const spotifySecret = process.env.spotifySecret;

var stateKey = 'spotify_auth_state';

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
        socket.on('login', function() {
            var state = generateRandomString(16);
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
            var state = data.state || null;
            var storedState = 
        })


    });
}

module.exports = auth;