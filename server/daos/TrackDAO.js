const mongoose = require('mongoose');

let TrackSchema = require('../schemas/TrackSchema.js');

let ArtistDAO = require('./ArtistDAO.js');

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

    async inDatabase() {
        try {
            return (await TrackSchema.findOne({ _id: this._id })) != null;
        } catch(error) {
            throw error;
        }
    }

    async retrieve(spotifyAPI) {
        try {
            if (!this._id) {
                return;
            } else if (this.name && this.artists && this.album && this.image.length) {
                return;
            } else if (await this.inDatabase()) {
                let track = await TrackSchema.findOne({ _id: this._id });
                this._id = track._id;
                this.name = track.name;
                this.artists = track.artists;
                this.album = track.album;
                this.image = track.image;
                this.popularity = track.popularity;
            } else if (spotifyAPI != null) {
                let response = await spotifyAPI.getTrack(this._id);
                await this.convertTrack(response.body);
            } 
        } catch(error) {
            throw error;
        }
    }

    async retrieveAudioFeatures(spotifyAPI) {
        try {
            if (typeof(this.key) == 'number' && typeof(this.mode) == 'number' && typeof(this.tempo) == 'number' && typeof(this.valence) == 'number' && typeof(this.danceability) == 'number' && typeof(this.energy) == 'number' && typeof(this.acousticness) == 'number' && typeof(this.instrumentalness) == 'number' && typeof(this.liveness) == 'number' && typeof(this.loudness) == 'number' && typeof(this.speechiness) == number) return;
            let response = await spotifyAPI.getAudioFeaturesForTrack(this._id);
            let audioFeatures = response.body;
            this.key = audioFeatures.key;
            this.mode = audioFeatures.mode;
            this.tempo = audioFeatures.tempo;
            this.valence = audioFeatures.valence;
            this.danceability = audioFeatures.danceability;
            this.energy = audioFeatures.energy;
            this.acousticness = audioFeatures.acousticness;
            this.instrumentalness = audioFeatures.instrumentalness;
            this.liveness = audioFeatures.liveness;
            this.loudness = audioFeatures.loudness;
            this.speechiness = audioFeatures.speechiness;
        } catch(error) {
            throw error;
        }
    }

    async getAudioFeatures() {
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

    retrieveAudioAnalysis(spotifyAPI) {

    }

    retrieveLibraryCompairison(spotifyAPI) {

    }

    async getData(spotifyAPI) {
        try {
            if (!this._id) return;
            if (!this.name || !this.artists || !this.album || !this.image || typeof(this.popularity) != 'number')
                await this.retrieve(spotifyAPI);
            if (typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
                await this.retrieveAudioFeatures(spotifyAPI);
            return {
                _id: this._id,
                name: this._name,
                artists: this._artists, 
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

    async save(spotifyAPI) {
        try {
            if (!this._id) return;
            if (!this.name || !this.artists || !this.album || !this.image || typeof(this.popularity) != 'number')
                await this.retrieve(spotifyAPI);
            if (typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
                await this.retrieveAudioFeatures(spotifyAPI);
            let track = new TrackSchema({
                _id: this._id,
                name: this._name,
                artists: this._artists, 
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
            return await this.artists;
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

    getID() {
        return this._id;
    }

    resetID(id) {
        this._id = id;
        this.name = null;
        this.artists = null;
        this.album = null;
        this.image = null;
        this.key = null;
        this.mode = null;
        this.tempo = null;
        this.valence = null;
        this.danceability = null;
        this.energy = null;
        this.acousticness = null;
        this.instrumentalness = null;
        this.liveness = null;
        this.loudness = null;
        this.speechiness = null;
        this.popularity = null;
    }

    getName() {
        return this.name;
    }

    getArtists() {
        return this.artists;
    }

    artistDAOs() {
        let artists = [];
        for (let i = 0; i < this.artists.length; i++) {
            artists.push(new ArtistDAO(this.artists[i]._id, {name: this.artists[i].name}));
        }
        return artists;
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