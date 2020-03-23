// Models
let Track = require('../models/Track.js');

// Associated DAOs
let TrackDAO = require('./TrackDAO.js');
let ArtistsDAO = require('./ArtistsDAO.js');

/**
 * Tracks Data Access Object
 * Various methods for working with and retrieving with multiple Tracks.
 */
class TracksDAO {
    /**
     * Contructor
     * Creates a new instance of Tracks Data Access object for a given set of tracks. Loads in data.
     */
    constructor() {
        this.baseDataLoaded = false;
        this.audioFeaturesLoaded = false;
        this.tracks = {};
    }

    /**
     * Load IDs
     * Loads in track dao's from array of track ids
     * 
     * @param {array} tracks Array of strings: track IDs
    */
    async loadIDs(tracks) {
        try {
            for (let i = 0; i < tracks.length; i++) 
                if (!(tracks[i] in this.tracks))
                    this.tracks[tracks[i]] = {
                        baseData: false,
                        audioFeatures: false,
                        dao: new TrackDAO(tracks[i]),
                    };     
        } catch (error) {
            throw error;
        }
    }

    /**
     * Load Base Data Objects
     * Loads in track dao's from array of base data objects of tracks.
     * 
     * @param {array} tracks Array of track base data objects
    */
    async loadBaseDataObjects(tracks) {
        try {
            for (let i = 0; i < tracks.length; i++) {
                let id = ('_id' in tracks[i] ? tracks[i]._id : tracks[i].id);
                if (!(id in this.tracks))
                    this.tracks[id] = {
                        baseData: true,
                        audioFeatures: false,
                        dao: new TrackDAO(id, tracks[i]),
                    };    
            }
            this.baseDataLoaded = true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Load Complete Data Objects
     * Loads in track dao's from array of complete data objects of tracks.
     * 
     * @param {array} tracks Array of track complete data objects
    */
    async loadCompleteDataObjects(tracks) {
        try {
            for (let i = 0; i < tracks.length; i++) {
                let id = ('_id' in tracks[i] ? tracks[i]._id : tracks[i].id);
                if (!(id in this.tracks))
                    this.tracks[id] = {
                        baseData: true,
                        audioFeatures: true,
                        dao: new TrackDAO(id, tracks[i]),
                    };    
            }
            this.baseDataLoaded = true;
            this.audioFeaturesLoaded = true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Load Base Data Objects with Dates
     * Loads in track dao's from array of data objects of tracks.
     * 
     * @param {array} tracks Array of track data objects
    */
    async loadBaseDataWithDate(tracks) {
        try {
            for (let i = 0; i < tracks.length; i++) {
                if ('is_local' in tracks[i] && tracks[i].is_local) continue; 
                if (!(tracks[i].track.id in this.tracks)) {
                    let track = new TrackDAO(tracks[i].track.id, tracks[i].track);
                    this.tracks[tracks[i].track.id] = {
                        baseData: true,
                        audioFeatures: false,
                        dao: track,
                    };    
                    this.tracks[tracks[i].track.id].dao.added = await (await new Date(tracks[i].added_at)).getTime();
                }
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
     * @returns {boolean} whether tracks have base data.
     */
    async hasBaseData() {
        try {
            return this.baseDataLoaded;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Artists
     * Creates ArtistsDAO for all the artists contained.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @param {ArtistsDAO} artists ArtistsDAO to be inserted into.
    */
    async appendArtists(spotifyAPI, artists) {
        try {
            if (this.artists == null) 
                await this.retrieveBaseData(spotifyAPI);
            for (let i = 0; i < this.artists; i++) {
                artists.insertArtist(this.artists[i], this._id);
            }
        } catch (error) {
            throw error;
        }
    }


    /**
     * Has Audio Feature Data
     * Returns boolean of whether audio feature data has been loaded.
     * 
     * @returns {boolean} whether tracks have audio feature data.
    */
    async hasAudioFeatureData() {
        try {
            return this.audioFeaturesLoaded;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Base Data
     * Returns array of objects with track base data properties. Retrieves if nessisary.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} array of objects with base data properties
     */
    async getBaseData(spotifyAPI) {
        try {
            if (!this.baseDataLoaded)
                await this.retrieveBaseData(spotifyAPI);
            return await this.tracks.map((track) => {
                return track.getBaseData(spotifyAPI);
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Complete Data
     * Returns array of objects with track complete data properties. Retrieves if nessisary.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} array of objects with complete data properties
     */
    async getCompleteData(spotifyAPI) {
        try {
            if (!this.baseDataLoaded)
                await this.retrieveBaseData(spotifyAPI);
            if (!this.audioFeaturesLoaded)
                await this.retrieveAudioFeatures(spotifyAPI);
            return await this.tracks.map((track) => {
                return track.getCompleteData(spotifyAPI);
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data
     * Retrieves Base Data for all Tracks
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
     * Retrieve Audio Feature Data
     * Retrieves Audio Feature Data for all Tracks
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveAudioFeatures(spotifyAPI) {
        try {
            await this.retrieveDataFromDatabase();
            await this.retrieveAudioFeaturesFromSpotify(spotifyAPI);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data from Spotify
     * Retrieves Base Data for all Tracks from spotify.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveBaseDataFromSpotify(spotifyAPI) {
        try {
            let ids = [];
            for (let track in this.tracks)
                if (!this.tracks[track].baseData) 
                    ids.push(track);
            let response;
            do {
                response = await spotifyAPI.getTracks(ids.splice(0, 50));
                for (let i = 0; i < response.body.tracks.length; i++) {
                    if (!response.body.tracks[i]) continue;
                    this.tracks[response.body.tracks[i].id].dao.name = response.body.tracks[i].name;
                    this.tracks[response.body.tracks[i].id].dao.images = response.body.tracks[i].album.images;
                    this.tracks[response.body.tracks[i].id].dao.artists = response.body.tracks[i].artists.map(this.minify);
                    this.tracks[response.body.tracks[i].id].dao.album = this.minify(response.body.tracks[i].album);
                    this.tracks[response.body.tracks[i].id].dao.popularity = response.body.tracks[i].popularity;
                    this.tracks[response.body.tracks[i].id].baseData = true;
                }
            } while (ids.length > 0)
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Audio Features Data from Spotify
     * Retrieves Audio Features Data for all Tracks from spotify.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveAudioFeaturesFromSpotify(spotifyAPI) {
        try {
            let ids = [];
            for (let track in this.tracks)
                if (!this.tracks[track].audioFeatures)
                    ids.push(track);
            let response;
            do {
                response = await spotifyAPI.getAudioFeaturesForTracks(ids.splice(0, 50));
                for (let i = 0; i < response.body.audio_features.length; i++) {
                    if (!response.body.audio_features[i]) continue;
                    this.tracks[response.body.audio_features[i].id].dao.key = response.body.audio_features[i].key;
                    this.tracks[response.body.audio_features[i].id].dao.mode = response.body.audio_features[i].mode;
                    this.tracks[response.body.audio_features[i].id].dao.tempo = response.body.audio_features[i].tempo;
                    this.tracks[response.body.audio_features[i].id].dao.valence = response.body.audio_features[i].valence;
                    this.tracks[response.body.audio_features[i].id].dao.danceability = response.body.audio_features[i].danceability;
                    this.tracks[response.body.audio_features[i].id].dao.energy = response.body.audio_features[i].energy;
                    this.tracks[response.body.audio_features[i].id].dao.acousticness = response.body.audio_features[i].acousticness;
                    this.tracks[response.body.audio_features[i].id].dao.instrumentalness = response.body.audio_features[i].instrumentalness;
                    this.tracks[response.body.audio_features[i].id].dao.liveness = response.body.audio_features[i].liveness;
                    this.tracks[response.body.audio_features[i].id].dao.loudness = response.body.audio_features[i].loudness;
                    this.tracks[response.body.audio_features[i].id].dao.speechiness = response.body.audio_features[i].speechiness;
                    this.tracks[response.body.audio_features[i].id].audioFeatures = true;
                }
            } while (response.body.audio_features.length == 50);
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
            for (let track in this.tracks)
                if (!this.tracks[track].audioFeatures || !this.tracks[track].baseData) 
                    ids.push(track);
            let tracks = await Track.find({
                _id: { $in: ids }
            });
            for (let i = 0; i < tracks.length; i++) {
                if (!this.tracks[tracks[i]._id].baseData) {
                    this.tracks[tracks[i]._id].dao.name = tracks[i].name;
                    this.tracks[tracks[i]._id].dao.images = tracks[i].images;
                    this.tracks[tracks[i]._id].dao.artists = tracks[i].artists;
                    this.tracks[tracks[i]._id].dao.album = tracks[i].album;
                    this.tracks[tracks[i]._id].dao.popularity = tracks[i].popularity;
                    this.tracks[tracks[i]._id].baseData = true;
                }
                if (!this.tracks[tracks[i]._id].audioFeatures) {
                    this.tracks[tracks[i]._id].dao.key = tracks[i].key;
                    this.tracks[tracks[i]._id].dao.mode = tracks[i].mode;
                    this.tracks[tracks[i]._id].dao.tempo = tracks[i].tempo;
                    this.tracks[tracks[i]._id].dao.valence = tracks[i].valence;
                    this.tracks[tracks[i]._id].dao.danceability = tracks[i].danceability;
                    this.tracks[tracks[i]._id].dao.energy = tracks[i].energy;
                    this.tracks[tracks[i]._id].dao.acousticness = tracks[i].acousticness;
                    this.tracks[tracks[i]._id].dao.instrumentalness = tracks[i].instrumentalness;
                    this.tracks[tracks[i]._id].dao.liveness = tracks[i].liveness;
                    this.tracks[tracks[i]._id].dao.loudness = tracks[i].loudness;
                    this.tracks[tracks[i]._id].dao.speechiness = tracks[i].speechiness;
                    this.tracks[tracks[i]._id].audioFeatures = true;
                } 
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Minify
     * Removes all properties of object except _id and name
     * 
     * @param {object} item Item to be minified
     * @returns {object} Object with Name and ID
     */
    minify(item) {
        let min = {
            _id: ('id' in item) ? item.id : (('_id' in item) ? item._id : null),
            name: ('name' in item) ? item.name : "",
        }
        return min;
    }

    /**
     * Save
     * Saves all track to database. Retrieves data if nessisary
     * 
     * @param {spotify-web-api} spotifyAPI Instance of spotify-web-api
    */
    async save(spotifyAPI) {
        try {
            if (!this.baseDataLoaded)
                await this.retrieveBaseData(spotifyAPI);
            if (!this.audioFeaturesLoaded)
                await this.retrieveAudioFeatures(spotifyAPI);
            let ids = Object.keys(this.tracks);
            for (let i = 0; i < ids.length; i++)
                this.tracks[ids[i]].dao.save(spotifyAPI);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Add to Profile
     * Adds tracks to profile object as saved tracks.
     * 
     * @param {ProfileDAO} profileDAO Instance of profile dao
    */
    async addToProfile(profileDAO) {
        try {
            let ids = Object.keys(this.tracks);
            for (let i = 0; i < ids.length; i++) {
                profileDAO.addSavedTrack(ids[i], this.tracks[ids[i]].dao.added, this.tracks[ids[i]].dao);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Artists
     * Retrieves artists from all tracks.
     * 
     * @param {spotify-web-api} spotifyAPI Instance of spotify-web-api
     * @returns {ArtistsDAO} artists dao
    */
   async getArtists(spotifyAPI) {
        try {
            if (!this.baseDataLoaded)
                await this.retrieveBaseData(spotifyAPI);
            let artists = new ArtistsDAO();
            let ids = Object.keys(this.tracks);
            for (let i = 0; i < ids.length; i++) {
                await artists.add(await this.tracks[ids[i]].dao.getArtists())
            }
            return artists;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get IDs
     * Returns array of ids for items.
     * 
     * @returns {array} Array of IDs
    */
    getIDs() {
        return Object.keys(this.tracks);
    }
}

// Export
module.exports = TracksDAO;