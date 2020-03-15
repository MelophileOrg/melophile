// Dependencies
require('dotenv').config();

/**
 * Key Retriever
 * Accesses keys from .env
 * 
 * @returns Class
 */
class KeyRetriever {
    // Retrieve from .env
    constructor() {
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
        this.secret = process.env.secret;
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

    getServerSecret() {
        return this.secret;
    }
}
// Instance
let keys = new KeyRetriever();
// Export
module.exports = keys;