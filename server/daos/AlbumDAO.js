// Associated DAOs
let TrackDAO = require('./TrackDAO.js');
let ArtistDAO = require('./ArtistDAO.js');
let GenreDAO = require('./GenreDAO.js');

/**
 * Album Data Access Object
 * Various methods for working with and retrieving with Album Data.
*/
class AlbumDAO {
    /**
     * Contructor
     * Creates a new instance of Album Data Access object for a given album. Loads in data.
     * 
     * @param {string} id Spotify ID for album.
     * @param {object} data Option data to pre-load into DAO.
    */
    constructor(id, data) {
        if (!id) throw new Error("No ID Provided.");
        this._id = id;
        if (data) {
            this.name = ('name' in data) ? data.name : null;
            this.artists = ('artists' in data) ? data.artists.map(this.minify) : null;
            this.genres = ('genres' in data) ? data.genres : null;
            this.images = ('images' in data) ? data.images : null;
            this.popularity = ('popularity' in data) ? data.popularity : null;
            this.release_date = ('release_date' in data) ? data.release_date : null;
            this.tracks = ('tracks' in data) ? data.tracks : null;
        }
    }

    /**
     * Get Data
     * Returns base album data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} Object with complete data values
    */
    async getData(spotifyAPI) {
        try {

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Retrieve Data
     * Retrieves the data from Spotify API
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveData(spotifyAPI) {
        try {

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Get Genres
     * Returns genre for album.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of GenreDAO
    */
    async getGenres(spotifyAPI) {
        try {

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Get Artists
     * Returns artists for album.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {ArtistsDAO}
    */
    async getArtists(spotifyAPI) {
        try {

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Get Tracks
     * Returns tracks for album.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {TracksDAO}
    */
    async getTracks(spotifyAPI) {
        try {

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }



}

module.exports = AlbumDAO;