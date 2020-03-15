// Dependencies
const mongoose = require('mongoose');

// Models
let Artist = require('../models/Artist.js');

// Associated DAOs
let ArtistDAO = require('./ArtistDAO.js');

/**
 * Artists Data Access Object
 * Various methods for working with and retrieving with multiple Artists.
 */
class ArtistsDAO {
    /**
     * Contructor
     * Creates a new instance of Artists Data Access object for a given set of artists. Loads in data.
     * 
     * @param {array} artists List of artists.
     */
    constructor(artists) {
        this.artists = artists.map((artist) => {
            return new ArtistDAO(('_id' in artist) ? artist._id : artist.id , artist);
        });
    }

    /** 
     * Get Genre DAOs for Artists
     * Returns array of Genre DAOs for Track.
     * 
     * @param {class} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of Genre DAOs
    */
    async getGenres(spotifyAPI) {
        try {
            
        } catch (error) {

        }
    }
}

// Export
module.exports = ArtistsDAO;