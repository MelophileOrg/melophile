// Dependencies
const mongoose = require('mongoose');

// Models
let Track = require('../models/Track.js');

// Associated DAOs
let ArtistDAO = require('./ArtistDAO.js');
let AlbumDAO = require('./AlbumDAO.js');

class TrackDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.name = ((data && 'name' in data) ? data.name : null);
        this.artists = ((data && 'artists' in data) ? data.artists.map(this.minify) : null);
        this.album = ((data && 'album' in data) ? this.minify(data.album) : null);
        this.image = ((data && 'album' in data && 'images' in data.album && data.album.images.length) ? data.album.images[0].url : "");
        this.key = ((data && 'key' in data) ? data.key : null);
        this.mode = ((data && 'mode' in data) ? data.mode : null);
        this.tempo = ((data && 'tempo' in data) ? data.tempo : null);
        this.valence = ((data && 'valence' in data) ? data.valence : null);
        this.danceability = ((data && 'danceability' in data) ? data.danceability : null);
        this.energy = ((data && 'energy' in data) ? data.energy : null);
        this.acousticness = ((data && 'acousticness' in data) ? data.acousticness : null);
        this.instrumentalness = ((data && 'instrumentalness' in data) ? data.instrumentalness : null);
        this.liveness = ((data && 'liveness' in data) ? data.liveness : null);
        this.loudness = ((data && 'loudness' in data) ? data.loudness : null);
        this.speechiness = ((data && 'speechiness' in data) ? data.speechiness : null);
        this.popularity = ((data && 'popularity' in data) ? data.popularity : null);
    }

// Public Methods

    // Returns boolean of whether track is saved in database.
    async inDatabase() {
        try {
            return (await TrackSchema.findOne({ _id: this._id })) != null;
        } catch(error) {
            throw error;
        }
    }
    // Returns Data Object (Retrieves Data if Needed)
    async getData(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.name || !this.artists || !this.album || !this.image || typeof(this.popularity) != 'number' || typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
                await this.retrieve(spotifyAPI);
            return {
                _id: this._id,
                name: this.name,
                artists: this.artists, 
                album: this.album,  
                image: this.image,
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
                popularity: this.popularity,
            };
        } catch(error) {
            throw error;
        }
    }
    async getBaseData(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (typeof(this.name) != 'string' || !(this.artists instanceof Array) || !this.album || !this.image.length)
                await this.retrieve(spotifyAPI, true);
            return {
                _id: this._id,
                name: this.name,
                artists: this.artists, 
                album: this.album,  
                image: this.image,
            };
        } catch(error) {
            throw error;
        }
    }
    // Saves track to Database (Retrieves Data if Needed)
    async save(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.name || !this.artists || !this.album || !this.image || typeof(this.popularity) != 'number' || typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
                await this.retrieve(spotifyAPI);
            if (await this.inDatabase()) return this.artists;
            let track = new TrackSchema({
                _id: this._id,
                name: this.name,
                artists: this.artists, 
                album: this.album,  
                image: this.image,
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
                popularity: this.popularity,
            });
            await track.save();
            return this.artists;
        } catch(error) {
            throw error;
        }
    }
    // Returns object of audio features (Retrieves Data if Needed)
    async getAudioFeatures(spotifyAPI) {
        if (typeof(this.key) != 'number') {
            if (await this.inDatabase()) {
                await this.retrieveFromDatabase();
            } else {
                await this.retrieveAudioFeatures(spotifyAPI);
            }
        }
        return {
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
    }
    // Returns array with audio analysis
    async getAudioAnalysis(spotifyAPI) {
        try {
            let response = await spotifyAPI.getAudioAnalysisForTrack(this._id); 
            return await this.processAudioAnalysis(response.body);
        } catch(error) {
            throw error;
        }
    }

    async processAudioAnalysis(apiReturn) {
        let audioAnalysisSegments = 80;
        let newSegments = [];
        if (apiReturn.segments.length < audioAnalysisSegments)
            audioAnalysisSegments = apiReturn.segments.length;
        let width = Math.round(apiReturn.segments.length / audioAnalysisSegments);
          
        for (var i = 0; i < audioAnalysisSegments; i++)
        {
            let itemIndex = Math.round(width * i);
            if (itemIndex > apiReturn.segments.length - 1)
            {
                itemIndex = apiReturn.segments.length - 2;
            }
            let sum = 0;
            for (var j = 0; j < apiReturn.segments[itemIndex].pitches.length; j++)
            {
                sum += apiReturn.segments[itemIndex].pitches[j];
            }
            let averagePitch = sum / apiReturn.segments[itemIndex].pitches.length; 
            let color = await this.HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
            let loudness = (Math.round(((apiReturn.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);

            newSegments.push({
                start: Math.round(apiReturn.segments[itemIndex].start),
                loudness_max: loudness, 
                red: color.r,
                green: color.g,
                blue: color.b,
            });
        }
        return newSegments;
    }

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
    
    // Get recommendations for simular tracks.
    async getRecommendations(spotifyAPI) {
        try {

        } catch(error) {
            throw error;
        }
    }

    async getTrackArtists(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!(this.artists instanceof Array)) await this.retrieve(spotifyAPI, true);
            return await this.artistDAOs();
        } catch(error) {
            throw error;
        }
    }

    async getTrackGenres(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.album) await this.retrieve(spotifyAPI, true);
            let album = await new AlbumDAO(this.album._id, {name: this.album.name});
            return await album.getAlbumGenres(spotifyAPI);
        } catch(error) {
            throw error;
        }
    }


// Helper Methods

    async retrieve(spotifyAPI, base) {
        try {
            if (!this._id) throw new Error("No ID");
            else if (this.name && this.artists instanceof Array && this.album && this.image.length && typeof(this.key) == 'number' && typeof(this.mode) == 'number' && typeof(this.tempo) == 'number' && typeof(this.valence) == 'number' && typeof(this.danceability) == 'number' && typeof(this.energy) == 'number' && typeof(this.acousticness) == 'number' && typeof(this.instrumentalness) == 'number' && typeof(this.instrumentalness) == 'number' && typeof(this.liveness) == 'number' && typeof(this.loudness) == 'number' && typeof(this.speechiness) == 'number') 
                throw new Error("Already Retrieved");
             else if (await this.inDatabase()) 
                await this.retrieveFromDatabase();
             else if (spotifyAPI != null) 
                await this.retrieveFromAPI(spotifyAPI, base);
        } catch(error) {
            throw error;
        }
    }

    async retrieveFromDatabase() {
        try {
            let track = await TrackSchema.findOne({ _id: this._id });
            this.name = track.name;
            this.artists = track.artists;
            this.album = track.album;
            this.image = track.image;
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
        } catch(error) {
            throw error;
        }
    }

    async retrieveFromAPI(spotifyAPI, base) {
        try {
            let response = await spotifyAPI.getTrack(this._id);
            await this.convertTrack(response.body);
            if (!base)
            await this.retrieveAudioFeatures(spotifyAPI);
        } catch(error) {
            console.log(error);
        }
    }

    async retrieveAudioFeatures(spotifyAPI) {
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
        } catch(error) {
            throw error;
        }
    }

    async convertTrack(track) {
        this._id = track.id;
        this.name = track.name;
        this.image = ((track.album.images.length ? track.album.images[0].url : ""));
        this.artists = await track.artists.map(this.minify);
        this.album = await this.minify(track.album);
        this.popularity = track.popularity;
    }

    minify(item) {
        let min = {
            _id: ('id' in item) ? item.id : (('_id' in item) ? item._id : null),
            name: ('name' in item) ? item.name : "",
        }
        return min;
    }

// Get Methods

    getID() {
        return this._id;
    }

    getName() {
        return this.name;
    }

    getArtists() {
        return this.artists;
    }

    async artistDAOs() {
        return await this.artists.map(async (artist) => {
            return await new ArtistDAO(artist._id, {name: artist.name});
        });
    }

    getAlbum() {
        return this.album;
    }

    getImage() {
        return this.image;
    }

    getKey() {
        return this.key;
    }

    getMode() {
        return this.mode;
    }

    getTempo() {
        return this.tempo;
    }

    getValence() {
        return this.valence;
    }

    getDanceability() {
        return this.danceability;
    }

    getEnergy() {
        return this.energy;
    }

    getAcousticness() {
        return this.acousticness;
    }

    getInstrumentalness() {
        return this.instrumentalness;
    }

    getLiveness() {
        return this.liveness;
    }

    getLoudness() {
        return this.loudness;
    }

    getSpeechiness() {
        return this.speechiness;
    }

    getPopularity() {
        return this.popularity;
    }
}

module.exports = TrackDAO;