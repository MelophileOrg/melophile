// Dependencies
const mongoose = require('mongoose');

// Models
let Album = require('../models/Artist.js');

// Associated DAOs
let AlbumDAO = require('./AlbumDAO.js');

/**
 * Albums Data Access Object
 * Various methods for working with and retrieving with multiple Albums.
 */
class AlbumsDAO {
    /**
     * Contructor
     * Creates a new instance of Albums Data Access object for a given set of albums. Loads in data.
     * 
     * @param {array} albums List of albums.
     */
    constructor(albums) {
        this.albums = albums.map((album) => {
            let id = ((typeof(album) == 'object') ? (('_id' in album) ? album._id : album.id ) : album);
            return new AlbumDAO(id , (typeof(album == 'object') ? album : null));
        });
    }
}

// Export
module.exports = AlbumsDAO;