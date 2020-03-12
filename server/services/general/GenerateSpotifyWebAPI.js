// Dependencies
let SpotifyWebApi = require('spotify-web-api-node');

/////////////////////////////////////////////////////
// Functions ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Generate Spotify API Wrapper
 * Creates and returns an instance of Spotify API wrapper with token
 * 
 * @param token Spotify Authorization token.
 * @returns Spotify Web API Wrapper Object
 */
var generateSpotifyWebAPI = async function(token) {
    if (token == null) return null;
    let spotifyAPI = new SpotifyWebApi();
    await spotifyAPI.setAccessToken(token);
    return spotifyAPI;
};

// Export
module.exports = generateSpotifyWebAPI