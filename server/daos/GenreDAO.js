// Associated DAOs
let TracksDAO = require('./TracksDAO.js');
let ArtistsDAO = require('./ArtistsDAO.js');

/**
 * Genre Data Access Object
 * Various methods for working with and retrieving a genre.
 */
class GenreDAO {
    /**
     * Contructor
     * Creates a new instance of Genre Data Access object for a given genre. Loads in data.
    */
    constructor(name, data) {
        this._id = name ? name : null;
        this.name = name ? name : null;
        this.artists = ((data && 'artists' in data) ? data.artists : null);
        this.trackNum = ((data && 'trackNum' in data) ? data.trackNum : null);
    }

    /**
     * Add To Track Num
     * Adds value to track num for genre.
     * 
     * @param {number} val value to add to track number.
    */
    addTrackNum(val) {
        this.trackNum += val;
    }

    /**
     * Add Artist
     * Adds artist to genre.
     * 
     * @param {array | string} artist
    */
    addArtist(artist) {
        if (artist instanceof Array) {
            this.artists = this.artists.concat(artist);
        } else {
            this.artists.push(artist);
        }
    }

    /**
     * Get Profile Object
     * Returns simplified object for addition to profile.
     *
     * @returns {object} genre profile object
     */
    getProfileObject() {
        let obj = {
            name: this.name,
            artists: this.artists instanceof Array ? this.artists : [],
            trackNum: this.trackNum != null ? this.trackNum : 0,
        }
        return obj;
    }

    /**
     * Retrieve From Profile
     * Retrieves genre data from profile DAO.
     * 
     * @param {ProfileDAO} profile Profile to extract from.
    */
    async retrieveFromProfile(profile) {
        try {
            
        } catch(error) {
            throw error;
        }
    }

    /**
     * Get Genre Artists
     * Retrieves all artists saved from genre. Retrieves from profile if nessiary.
     * 
     * @param {ProfileDAO} profile Profile to extract from. (optional)
     * @returns {ArtistsDAO} artists from genre.
    */
    async getGenreArtists(profile) {
        try {
        } catch(error) {
            throw error;
        }
    }

    /**
     * Get Genre Tracks
     * Retrieves all tracks saved from genre. Retrieves from profile if nessiary.
     * 
     * @param {ProfileDAO} profile Profile to extract from. (optional)
     * @returns {TracksDAO} tracks from genre.
    */
    async getGenreTracks(profile) {
        try {

        } catch(error) {
            throw error;
        }
    }

    /**
     * Get Genre History
     * Retrieves history data between a user and a genre.
     * 
     * @param {ProfileDAO} profile Profile to extract from.
     */
    async getHistory(profile) {
        try {
            
        } catch(error) {
            console.log(error);
        }
    }
}

// Export
module.exports = GenreDAO;