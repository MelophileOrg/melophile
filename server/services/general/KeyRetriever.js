// Dependencies
require('dotenv').config();

/**
 * Key Retriever
 * Accesses keys from .env
 */
class KeyRetriever {
    /**
     * Contructor
     * Creates a new instance of Key retriever and gets keys.
    */
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

    /**
     * Get Spotify Keys
     * Returns object with spotify authentication keys as properties.
     * 
     * @returns {object} Object with Spotify Auth Properties
    */
    getSpotify() {
        return this.spotify;
    }

    /**
     * Get Discogs Keys
     * Returns object with discogs authentication keys as properties.
     * 
     * @returns {object} Object with Discogs Auth Properties
    */
    getDiscogs() {
        return this.discogs;
    }

    /**
     * Get Musixmatch Keys
     * Returns object with Musixmatch authentication keys as properties.
     * 
     * @returns {object} Object with Musixmatch Auth Properties
    */
    getMusixmatch() {
        return this.musixmatch;
    }

    /**
     * Get Server Secret
     * Returns string for encryption
     * 
     * @returns {string} Server secret encryption token.
    */
    getServerSecret() {
        return this.secret;
    }
}

// Instanciate 
let keys = new KeyRetriever();

// Export
module.exports = keys;