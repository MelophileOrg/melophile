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
     */
    constructor() {
        try {
            this.baseDataLoaded = false;
            this.artists = {};
        } catch (error) {
            throw error;
        }
    }

    /**
     * Load IDs
     * Loads in artist dao's from array of artist ids
     * 
     * @param {array} artists Array of strings: artist IDs
     */
    async loadIDs(artists) {
        try {
            for (let i = 0; i < artists.length; i++) 
                if (!(artists[i] in this.artists))
                    this.artists[artists[i]] = {
                        baseData: false,
                        tracks: [],
                        dao: new ArtistDAO(tracks[i]),
                    };     
        } catch (error) {
            throw error;
        }
    }

    /**
     * Insert Artist Data Object
     * Inserts artist with track to be added.
     * 
     * @param {object} artist
     * @param {string} trackID
     */
    async insertArtist(artist, trackID) {
        try {
            let id = ('_id' in artist ? artist._id : artist.id);
            if (!(id in this.artists))
                this.artists[id] = {
                    baseData: false,
                    tracks: [trackID],
                    dao: new ArtistDAO(id, artist),
                };     
            else 
                this.artists[id].tracks.push(trackID);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Load Base Data Objects
     * Loads in artist dao's from array of base data objects of artists.
     * 
     * @param {array} artists Array of artists base data objects
    */
   async loadBaseDataObjects(artists) {
        try {
            for (let i = 0; i < artists.length; i++) {
                let id = ('_id' in artists[i] ? artists[i]._id : artists[i].id);
                if (!(id in this.artists))
                    this.artists[id] = {
                        baseData: true,
                        tracks: [],
                        dao: new ArtistDAO(id, artists[i]),
                    };    
            }
            this.baseDataLoaded = true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Has Base Data
     * Returns boolean of whether base data has been loaded.
     * 
     * @returns {boolean} whether artists have base data.
     */
    async hasBaseData() {
        try {
            return this.baseDataLoaded;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Genre DAOs for Artists
     * Returns GenresDAO for all genres contained
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