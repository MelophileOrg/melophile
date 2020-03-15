// Dependencies
const mongoose = require('mongoose');

// Models
let Track = require('../models/Track.js');

// Associated DAOs
let TrackDAO = require('./TrackDAO.js');

/**
 * Tracks Data Access Object
 * Various methods for working with and retrieving with multiple Tracks.
 */
class TracksDAO {
    /**
     * Contructor
     * Creates a new instance of Tracks Data Access object for a given set of tracks. Loads in data.
     * 
     * @param {array} tracks list of tracks.
     */
    constructor(tracks) {
        this.tracks = tracks.map((track) => {
            return new TrackDAO(track.id, track);
        });
    }
}

// Export
module.exports = TracksDAO;