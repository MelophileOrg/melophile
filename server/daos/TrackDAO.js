// Models
let Track = require('../models/Track.js');

// Associated DAOs
let TracksDAO = require('./TracksDAO.js');
let ArtistsDAO = require('./ArtistsDAO.js');
let AlbumDAO = require('./AlbumDAO.js');

/**
 * Track Data Access Object
 * Various methods for working with and retrieving with Track Data.
 */
class TrackDAO {
    /**
     * Contructor
     * Creates a new instance of Track Data Access object for a given track. Loads in data.
     * 
     * @param {string} id Spotify ID for track.
     * @param {object} data Option data to pre-load into DAO.
     */
    constructor(id, data) {
        if (!id) throw new Error("No ID Provided.");
        this._id = id;
        if (data) {
            this.name = (('name' in data) ? data.name : null);
            this.artists = (('artists' in data) ? data.artists.map(this.minify) : ('artistsConverted' in data) ? data.artistsConverted : null);
            this.album = (('album' in data) ? this.minify(data.album) : ('albumConverted' in data) ? data.albumConverted : null);
            this.images = (('album' in data && 'images' in data.album) ? data.album.images : ('imagesConverted' in data) ? data.imagesConverted : ('images' in data) ? data.imagesConverted : null);
            this.popularity = (('popularity' in data) ? data.popularity : null);
            this.key = (('key' in data) ? data.key : null);
            this.mode = (('mode' in data) ? data.mode : null);
            this.tempo = (('tempo' in data) ? data.tempo : null);
            this.valence = (('valence' in data) ? data.valence : null);
            this.danceability = (('danceability' in data) ? data.danceability : null);
            this.energy = (('energy' in data) ? data.energy : null);
            this.acousticness = (('acousticness' in data) ? data.acousticness : null);
            this.instrumentalness = (('instrumentalness' in data) ? data.instrumentalness : null);
            this.liveness = (('liveness' in data) ? data.liveness : null);
            this.loudness = (('loudness' in data) ? data.loudness : null);
            this.speechiness = (('speechiness' in data) ? data.speechiness : null);
        }
    }

    /**
     * Is In Database
     * Return boolean if track is stored in database.
     * 
     * @returns {boolean}
     */
    async inDatabase() {
        try {
            return (await Track.findOne({ _id: this._id })) != null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Complete Data
     * Returns all track data, identical to Track Model.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} Object with complete data values
     */
    async getCompleteData(spotifyAPI) {
        try {
            if (this.name == null || this.images == null || this.artists == null || this.album == null || this.popularity == null || this.key == null || this.mode == null || this.tempo == null || this.valence == null || this.danceability == null || this.energy == null || this.acousticness == null || this.instrumentalness == null || this.liveness == null || this.loudness == null || this.speechiness == null)
                await this.retrieveCompleteData(spotifyAPI);
            let completeData = {
                _id: this._id,
                name: this.name,
                images: this.images,
                artists: this.artists,
                album: this.album,
                popularity: this.popularity,
                key: this.key,
                mode: this.mode,
                tempo: this.tempo,
                valence: this.valence,
                danceability: this.danceability,
                energy: this.energy,
                acousticness: this.acousticness,
                instrumentalness: this.instrumentalness,
                liveness: this.liveness,
                loudness: this.loudness,
                speechiness: this.speechiness,
            }
            return completeData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Base Data
     * Returns base track data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} Object with base data values.
     */
    async getBaseData(spotifyAPI) {
        try {
            if (this.name == null || this.images == null || this.artists == null || this.album == null || this.popularity == null)
                await this.retrieveBaseData(spotifyAPI);
            let baseData = {
                _id: this._id,
                name: this.name,
                images: this.images,
                artists: this.artists,
                album: this.album,
                popularity: this.popularity,
            }
            return baseData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Audio Feature Data
     * Returns audio feature track data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} Object with audio feature values.
     */
    async getAudioFeatureData(spotifyAPI) {
        try {
            if (this.key == null || this.mode == null || this.tempo == null || this.valence == null || this.danceability == null || this.energy == null || this.acousticness == null || this.instrumentalness == null || this.liveness == null || this.loudness == null || this.speechiness == null)
                await this.retrieveAudioFeatures(spotifyAPI);
            let audioFeatures = {
                key: this.key,
                mode: this.modekey,
                tempo: this.tempokey,
                valence: this.valencekey,
                danceability: this.danceabilitykey,
                energy: this.energykey,
                acousticness: this.acousticnesskey,
                instrumentalness: this.instrumentalnesskey,
                liveness: this.livenesskey,
                loudness: this.loudnesskey,
                speechiness: this.speechinesskey,
            }
            return audioFeatures;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Complete Data
     * Retrieves track object from the Database or Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveCompleteData(spotifyAPI) {
        try {
            if (await this.inDatabase()) {
                await this.retrieveCompleteDataFromDatabase();
            } else {
                await this.retrieveBaseDataFromSpotify(spotifyAPI);
                await this.retrieveAudioFeaturesFromSpotify(spotifyAPI);
            }
        } catch (error) {
            throw error;
        }
    }

     /**
     * Retrieve Base Data
     * Retrieves track object from the Database or Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveBaseData(spotifyAPI) {
        try {
            if (await this.inDatabase()) {
                await this.retrieveBaseDataFromDatabase();
            } else {
                await this.retrieveBaseDataFromSpotify(spotifyAPI);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Audio Feature Data
     * Retrieves track object from the Database or Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveAudioFeatures(spotifyAPI) {
        try {
            if (await this.inDatabase()) {
                await this.retrieveAudioFeaturesFromDatabase();
            } else {
                await this.retrieveAudioFeaturesFromSpotify(spotifyAPI);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data From Spotify
     * Retrieves track object from Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveBaseDataFromSpotify(spotifyAPI) {
        try {
            let response = await spotifyAPI.getTrack(this._id);
            this.name = response.body.name;
            this.images = response.body.images;
            this.artists = await response.body.artists.map(this.minify);
            this.album = await this.minify(response.body.album);
            this.popularity = response.body.popularity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Audio Feature Data From Spotify
     * Retrieves track object from Spotify API and loads in data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async retrieveAudioFeaturesFromSpotify(spotifyAPI) {
        try {
            let response = await spotifyAPI.getAudioFeaturesForTrack(this._id);
            this.key = response.body.key;
            this.mode = response.body.mode;
            this.tempo = response.body.tempo;
            this.valence = response.body.valence;
            this.danceability = response.body.danceability;
            this.energy = response.body.energy;
            this.acousticness = response.body.acousticness;
            this.instrumentalness = response.body.instrumentalness;
            this.liveness = response.body.liveness;
            this.loudness = response.body.loudness;
            this.speechiness = response.body.speechiness;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Complete Data From Database
     * Retrieves track object from database and loads in data.
     */
    async retrieveCompleteDataFromDatabase() {
        try {
            let track = await Track.findOne({ _id: this._id });
            this.name = track.name;
            this.images = track.images;
            this.artists = track.artists;
            this.album = track.album;
            this.popularity = track.popularity;
            this.key = track.key;
            this.mode = track.mode;
            this.tempo = track.tempo;
            this.valence = track.valence;
            this.danceability = track.danceability;
            this.energy = track.energy;
            this.acousticness = track.acousticness;
            this.instrumentalness = track.instrumentalness;
            this.liveness = track.liveness;
            this.loudness = track.loudness;
            this.speechiness = track.speechiness;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Base Data From Database
     * Retrieves track object from database and loads in data.
     */
    async retrieveBaseDataFromDatabase() {
        try {
            let track = await Track.findOne({ _id: this._id });
            this.name = track.name;
            this.images = track.images;
            this.artists = track.artists;
            this.album = track.album;
            this.popularity = track.popularity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Audio Feature Data From Database
     * Retrieves track object from database and loads in data.
     */
    async retrieveAudioFeaturesFromDatabase() {
        try {
            let track = await Track.findOne({ _id: this._id });
            this.key = track.key;
            this.mode = track.mode;
            this.tempo = track.tempo;
            this.valence = track.valence;
            this.danceability = track.danceability;
            this.energy = track.energy;
            this.acousticness = track.acousticness;
            this.instrumentalness = track.instrumentalness;
            this.liveness = track.liveness;
            this.loudness = track.loudness;
            this.speechiness = track.speechiness;
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
     * Save to Database
     * Saves data to database. Retrieves data if nessisary.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     */
    async save(spotifyAPI) {
        try {
            if (await this.inDatabase()) return;
            if (this.name == null || this.images == null || this.artists == null || this.album == null || this.popularity == null || this.key == null || this.mode == null || this.tempo == null || this.valence == null || this.danceability == null || this.energy == null || this.acousticness == null || this.instrumentalness == null || this.liveness == null || this.loudness == null || this.speechiness == null) {
                await this.retrieveCompleteData(spotifyAPI);
            }
            let track = new Track({
                _id: this._id,
                name: this.name,
                images: this.images,
                artists: this.artists, 
                album: this.album,  
                popularity: this.popularity,
                key: this.key,
                mode: this.mode,
                tempo: this.tempo,
                valence: this.valence,
                danceability: this.danceability,
                energy: this.energy,
                acousticness: this.acousticness,
                instrumentalness: this.instrumentalness,
                liveness: this.liveness,
                loudness: this.loudness,
                speechiness: this.speechiness,
            });
            await track.save();
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Audio Analysis
     * Returns audio wave data from Spotify API
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of segment analysis data.
     */
    async getAudioAnalysis(spotifyAPI) {
        try {
            let response = await spotifyAPI.getAudioAnalysisForTrack(this._id);
            let audioAnalysisSegments = 80;
            let newSegments = [];
            if (response.body.segments.length < audioAnalysisSegments)
                audioAnalysisSegments = response.body.segments.length;
            let width = Math.round(response.body.segments.length / audioAnalysisSegments);
            for (var i = 0; i < audioAnalysisSegments; i++)
            {
                let itemIndex = Math.round(width * i);
                if (itemIndex > response.body.segments.length - 1)
                    itemIndex = response.body.segments.length - 2;
                let sum = 0;
                for (var j = 0; j < response.body.segments[itemIndex].pitches.length; j++)
                    sum += response.body.segments[itemIndex].pitches[j];
                let averagePitch = sum / response.body.segments[itemIndex].pitches.length; 
                let color = await this.HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
                let loudness = (Math.round(((response.body.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);
                newSegments.push({
                    start: Math.round(response.body.segments[itemIndex].start),
                    loudness_max: loudness, 
                    red: color.r,
                    green: color.g,
                    blue: color.b,
                });
            }
            return newSegments;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Hue Saturation Value (HSV) to Red Green Blue (RGB)
     * Converts one color format to another.
     * 
     * @param {object} payload HSV data object.
     */
    async HSVtoRGB(payload) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(payload.hue * 6);
        f = payload.hue * 6 - i;
        p = payload.value * (1 - payload.saturation);
        q = payload.value * (1 - f * payload.saturation);
        t = payload.value * (1 - (1 - f) * payload.saturation);
        switch (i % 6) {
            case 0: r = payload.value, g = t, b = p; break;
            case 1: r = q, g = payload.value, b = p; break;
            case 2: r = p, g = payload.value, b = t; break;
            case 3: r = p, g = q, b = payload.value; break;
            case 4: r = t, g = p, b = payload.value; break;
            case 5: r = payload.value, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /** 
     * Get Simular Tracks
     * Returns array of track base data objects of simular tracks.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @param {number} limit Number of tracks desired.
     * @returns {array} Array of track base data objects.
    */
    async getSimular(spotifyAPI, limit) {
        try {
            let options = {
                limit: limit,
                seed_tracks: this._id,
            };
            let response = await spotifyAPI.getRecommendations(options);
            let tracksDAO = new TracksDAO();
            await tracksDAO.loadBaseDataObjects(response.body.tracks);
            return tracksDAO;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Track Album DAO
     * Returns Album DAO object.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {AlbumDAO} Album DAO
    */
    async getAlbum(spotifyAPI) {
        try {
            if (this.album == null) {
                if (await this.inDatabase()) {
                    await this.retrieveBaseDataFromDatabase();
                } else {
                    let response = await spotifyAPI.getTrack(this._id);
                    return await new AlbumDAO(response.body.album.id, response.body.album);
                }
            }
            return await new AlbumDAO(this.album._id, { name: this.album.name });
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Track Artist DAOs
     * Returns array of Artist DAOs for Track.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of Artist DAOs
    */
    async getArtists(spotifyAPI) {
        try {
            if (this.artists == null) 
                await this.retrieveBaseData(spotifyAPI);
            let artistsDao = new ArtistsDAO();
            await artistsDao.loadIDs(this.artists.map(artist => artist._id), this._id);
            return artistsDao;
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Track Genre DAOs
     * Returns array of Genre DAOs for Track.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {array} Array of Genre DAOs
    */
    async getGenres(spotifyAPI) {
        try {
            if (this.artists == null) 
                await this.retrieveBaseData(spotifyAPI);
            let artists = new ArtistsDAO();
            await artists.loadIDs(this.artists.map(artist => artist._id));
            return await artists.getGenres(spotifyAPI);
        } catch (error) {
            throw error;
        }
    }

    /** 
     * Get Library Simular Tracks
     * Handled in UserDAO
    */ 

    /** 
     * Get Feature Percentiles
     * Handled in UserDAO
    */ 

    /** 
     * Get Liked History
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
module.exports = TrackDAO;