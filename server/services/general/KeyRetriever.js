// Dependencies
let dotenv = require('dotenv');
// Key Retriever
class KeyRetriever {
    // Retrieve from .env
    constructor() {
        dotenv.config();
        this.spotify = {
            id: process.env.spotifyId,
            secret: process.env.spotifySecret,
        };
        this.discogs = {
            key: process.env.discogsKey,
            secret: process.env.discogsSecret,
        };
        this.musixmatch = {
            key: process.env.musixmatchKey,
        }
    }
    // Retrieve Spotify Application Keys
    getSpotify() {
        return this.spotify;
    }
    // Retrieve Discogs Application Keys
    getDiscogs() {
        return this.discogs;
    }
    // Retrieve MusixMatch Application Keys
    getMusixmatch() {
        return this.musixmatch;
    }
}
// Export
module.exports = KeyRetriever;