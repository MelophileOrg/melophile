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
    async loadIDs(artists, trackID) {
        try {
            let tracks = (trackID != null ? [trackID] : []);
            for (let i = 0; i < artists.length; i++) 
                if (!(artists[i] in this.artists)) {
                    this.artists[artists[i]] = {
                        baseData: false,
                        tracks: tracks,
                        dao: new ArtistDAO(artists[i]),
                    }; 
                } else {
                    this.artists[artists[i]].tracks = this.artists[artists[i]].tracks.concat(tracks);
                }    
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
            let genres = {}
            for (let artist in this.artists) {
                let artistGenres = await this.artists[artist].dao.getGenres(spotifyAPI);
                for (let i = 0; i < artistGenres.length; i++) {
                    if (artistGenres[i].name in genres) {
                        genres[artistGenres[i].name].addTrackNum(this.artists[artist].tracks.length);
                        genres[artistGenres[i].name].addArtist(artist);
                    } else {
                        genres[artistGenres[i].name] = artistGenres[i];
                        genres[artistGenres[i].name].addTrackNum(this.artists[artist].tracks.length);
                    }
                }
            }
            return genres;
        } catch (error) {

        }
    }

    /**
     * Get Artists
     * Returns data property
     * 
     * @returns {object} Data of contained Artists
     */
    async getArtists() {
        try {
            return this.artists;
        } catch (error) {
            console.trace(error);
            return;
        }
    }

    /**
     * Add
     * Add one Artist DAO to another
     * 
     * @param {ArtistsDAO} other Instances of ArtistsDAO
     */
    async add(other) {
        try {
            let otherArtists = await other.getArtists();
            let ids = Object.keys(otherArtists);
            for (let i = 0; i < ids.length; i++) {
                if (!(ids[i] in this.artists)) {
                    this.artists[ids[i]] = otherArtists[ids[i]];
                } else if (otherArtists[ids[i]].tracks.length) {
                    this.artists[ids[i]].tracks = this.artists[ids[i]].tracks.concat(otherArtists[ids[i]].tracks);
                }
            }
        } catch (error) {
            console.trace(error);
            return;
        }
    }

    /**
     * Save
     * Saves all artists to database. Retrieves data if nessisary
     * 
     * @param {spotify-web-api} spotifyAPI Instance of spotify-web-api
    */
   async save(spotifyAPI) {
        try {
            if (!this.baseDataLoaded)
                await this.retrieveBaseData(spotifyAPI);
            let ids = Object.keys(this.artists);
            for (let i = 0; i < ids.length; i++)
                this.artists[ids[i]].dao.save(spotifyAPI);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data
     * Retrieves Base Data for all Artists
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
   async retrieveBaseData(spotifyAPI) {
        try {
            await this.retrieveDataFromDatabase();
            await this.retrieveBaseDataFromSpotify(spotifyAPI);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data from Database
     * Queries the database for available data and retrieves base data.
     */
    async retrieveDataFromDatabase() {
        try {
            let ids = [];
            for (let artist in this.artists)
                if (!this.artists[artist].baseData) 
                    ids.push(artist);
            let artists = await Artist.find({
                _id: { $in: ids }
            });
            for (let i = 0; i < artists.length; i++) {
                if (!this.artists[artists[i]._id].baseData) {
                    this.artists[artists[i]._id].dao.name = artists[i].name;
                    this.artists[artists[i]._id].dao.images = artists[i].images;
                    this.artists[artists[i]._id].dao.genres = artists[i].genres;
                    this.artists[artists[i]._id].dao.popularity = artists[i].popularity;
                    this.artists[artists[i]._id].dao.followers = artists[i].followers;
                    this.artists[artists[i]._id].baseData = true;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data from Spotify
     * Retrieves Base Data for all Artists from spotify.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveBaseDataFromSpotify(spotifyAPI) {
        try {
            let ids = [];
            for (let artist in this.artists) 
                if (!this.artists[artist].baseData) 
                    ids.push(artist);
            if (ids.length) {
                let response;
                do {
                    response = await spotifyAPI.getArtists(ids.splice(0, 50));
                    for (let i = 0; i < response.body.artists.length; i++) {
                        if (!response.body.artists[i]) continue;
                        this.artists[response.body.artists[i].id].dao.name = response.body.artists[i].name;
                        this.artists[response.body.artists[i].id].dao.images = response.body.artists[i].images;
                        this.artists[response.body.artists[i].id].dao.genres = response.body.artists[i].genres;
                        this.artists[response.body.artists[i].id].dao.popularity = response.body.artists[i].popularity;
                        this.artists[response.body.artists[i].id].dao.followers = response.body.artists[i].followers.total;
                        this.artists[response.body.artists[i].id].baseData = true;
                    }
                } while (ids.length > 0)
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add to Profile
     * Adds artists to profile object as saved artists.
     * 
     * @param {ProfileDAO} profileDAO Instance of profile dao
    */
   async addToProfile(profileDAO) {
        try {
            let ids = Object.keys(this.artists);
            for (let i = 0; i < ids.length; i++)
                profileDAO.addSavedArtist(ids[i], this.artists[ids[i]].tracks);
        } catch (error) {
            throw error;
        }
    }
}

// Export
module.exports = ArtistsDAO;