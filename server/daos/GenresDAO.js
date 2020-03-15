// Dependencies
const mongoose = require('mongoose');

// Associated DAOs
let GenreDAO = require('./GenreDAO.js');
let UserDAO = require('./UserDAO.js');

/**
 * Genres Data Access Object
 * Various methods for working with and retrieving with multiple Genres.
 */
class AlbumsDAO {
    /**
     * Contructor
     * Creates a new instance of Genres Data Access object for a given set of genres. Loads in data.
     * 
     * @param {array} genres List of genres.
     */
    constructor(genres) {
        this.genres = await genres.map((genre) => {
            return new GenreDAO(genre);
        });
    }
}

// Export
module.exports = AlbumsDAO;