// Dependencies
const mongoose = require('mongoose');

// Models
let Artist = require('../models/Artist.js');

// Associated DAOs
let ArtistsDAO = require('./ArtistsDAO.js');
let TracksDAO = require('./TracksDAO.js');
let AlbumsDAO = require('./AlbumsDAO.js');
let GenresDAO = require('./GenreDAO.js');

/**
 * Artist Data Access Object
 * Various methods for working with and retrieving with Artist Data.
*/
class ArtistDAO {
    /**
     * Contructor
     * Creates a new instance of Artist Data Access object for a given artist. Loads in data.
     * 
     * @param {string} id Spotify ID for artist.
     * @param {object} data Option data to pre-load into DAO.
    */
    constructor(id, data) {
        if (!id) throw error;
        this._id = id;
        if (data) {
            this.name = (('name' in data) ? data.name : null);
            this.images = (('images' in data) ? data.images : null);
            this.genres = (('genres' in data) ? data.genres : null);
            this.popularity = (('popularity' in data) ? data.popularity : null);
            this.followers = (('followers' in data) ? ((typeof(data.followers) == 'object') ? data.followers.total : data.followers) : null);
        }
    }

    /**
     * Is In Database
     * Return boolean if artist is stored in database.
     * 
     * @returns {boolean}
    */
    async inDatabase() {
        try {
            return (await Artist.findOne({ _id: this._id })) != null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Complete Data
     * Returns all artist data, identical to Artist Model.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} Object with complete data values
    */
    async getCompleteData(spotifyAPI) {
        try {
            if (this.name == null || this.images == null || this.genres == null || this.popularity == null || this.followers == null)
                await this.retrieveCompleteData(spotifyAPI);
            let completeData = {
                _id: this._id,
                name: this.name,
                images: this.images,
                genres: this.genres,
                popularity: this.popularity,
                followers: this.followers
            }
            return completeData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Complete Data
     * Retrieves artist object from the Database or Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveCompleteData(spotifyAPI) {
        try {
            if (await this.inDatabase()) {
                await this.retrieveCompleteDataFromDatabase();
            } else {
                await this.retrieveCompleteDataFromSpotify(spotifyAPI);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Complete Data From Spotify
     * Retrieves artist object from Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveCompleteDataFromSpotify(spotifyAPI) {
        try {
            let response = await spotifyAPI.getArtist(this._id);
            this.name = response.body.name;
            this.images = response.body.images;
            this.genres = response.body.genres;
            this.popularity = response.body.popularity;
            this.followers = response.body.followers.total;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Complete Data From Database
     * Retrieves artist object from database and loads in data.
     */
    async retrieveCompleteDataFromDatabase() {
        try {
            let artist = await Artist.findOne({ _id: this._id });
            this.name = artist.name;
            this.images = artist.images;
            this.genres = artist.genres;
            this.popularity = artist.popularity;
            this.followers = artist.followers;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Save to Database
     * Saves data to database. Retrieves data if nessisary.
     * 
     * @param {object} item Item to be minified
    */
    async save(spotifyAPI) {
        try {
            if (await this.inDatabase()) return;
            if (this.name == null || this.images == null || this.genres == null || this.popularity == null || this.followers == null)
                await this.retrieveCompleteData(spotifyAPI);
            let artist = new Artist({
                _id: this._id,
                name: this.name,
                images: this.images,
                genres: this.genres, 
                popularity: this.popularity,
                followers: this.followers,
            });
            await artist.save();
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Artist Genre DAOs
     * Returns array of Genre DAOs for Artist.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of Genre DAOs
    */
    async getGenres(spotifyAPI) {
        try {
            if (this.genres == null) 
                await this.retrieveCompleteData(spotifyAPI);
            return await new GenresDAO(this.genres);
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Artist Top Tracks
     * Returns Tracks DAO of Top Tracks
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {TracksDAO} Tracks DAO
    */
    async getTopTracks(spotifyAPI) {
        try {
            let response = await spotifyAPI.getArtistTopTracks(this._id, "US");
            let tracksDAO = new TracksDAO();
            await tracksDAO.loadBaseDataObjects(response.body.tracks);
            return tracksDAO;
        } catch (error) {
            throw error;
        }
    } 

    /** 
     * Get Simular Artists
     * Returns Artists DAO of simular Artists
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {ArtistsDAO} Artists DAO
    */
    async getSimular(spotifyAPI) {
        try {
            let response = await spotifyAPI.getArtistRelatedArtists(this._id);
            return await new ArtistsDAO(response.body.artists);
        } catch (error) {
            throw error;
        }
    } 

    /** 
     * Get Data from Discogs
     * Returns object with Artist data retrieved from Discogs.
     * 
     * @returns {object} Discogs Data
    */
   async getDiscogsData() {
        try {
            
        } catch (error) {
            throw error;
        }
    } 

    /** 
     * Get Artist Albums
     * Returns Albums Data Access Object of Artist Albums
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {AlbumsDAO} Albums Access Object
    */
    async getArtistAlbums(spotifyAPI) {
        try {
            let albums = [];
            let offset = 0;
            let response;
            do {
                response = await spotifyAPI.getArtistAlbums(this._id, {limit: 50, offset: offset});
                albums = albums.concat(response.body.items);
                offset += 50;
            } while (response.body.items.length == 50);
            return new AlbumsDAO(albums);
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get First Liked
     * Handled in UserDAO
    */ 

    /** 
     * Get Relationship Age
     * Handled in UserDAO
    */

    /** 
     * Get Added Timeline
     * Handled in UserDAO
    */

    /** 
     * Get Liked Tracks
     * Handled in UserDAO
    */

    /** 
     * Get Liked Same Time Range
     * Handled in UserDAO
    */ 

    /** 
     * Get Playlists Included In
     * Handled in UserDAO
    */ 
 
}

// Export
module.exports = ArtistDAO;