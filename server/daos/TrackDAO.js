const mongoose = require('mongoose');

let TrackSchema = require('../schemas/TrackSchema.js');

let ArtistDAO = require('./ArtistDAO.js');

class TrackDAO {
    constructor(id, data) {
        this._id = id;
        if (data) {
            if ('name' in data) this.name = data.name;
            if ('artists' in data) this.artists = data.artists;
        }
    }

    async inDatabase() {
        return (await TrackSchema.findOne({ _id: this._id })) != null;
    }

    async retrieve(spotifyAPI) {
        if (this.name && this.artists.length && this.album && this.image) {
            return;
        } else if (await this.inDatabase()) {
            let track = await TrackSchema.findOne({ _id: this._id });
            this._id = track.id;
            this.name = track.name;
            this.artists = track.artists;
            this.album = track.album;
            this.image = track.image;
        } else if (spotifyAPI != null) {
            let track = await spotifyAPI.getTrack(id);
            this.convertTrack(track);
        } else {
            return;
        }
    }

    async retrieveAudioFeatures(spotifyAPI) {
        if (this.key && this.mode && this.tempo && this.valence && this.danceability && this.energy && this.acousticness && this.instrumentalness && this.liveness && this.loudness && this.speechiness) return;
        let audioFeatures = await spotifyAPI.getAudioFeaturesForTrack(this._id);
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
    }

    retrieveAudioAnalysis(spotifyAPI) {

    }

    retrieveLibraryCompairison(spotifyAPI) {

    }

    async save(spotifyAPI) {
        if (!this.name || !this.artists || !this.album || !this.image)
            await this.retrieve(spotifyAPI);
        if (!this.key || !this.mode || !this.tempo || !this.valence || !this.danceability || !this.energy || !this.acousticness || !this.instrumentalness || !this.liveness || !this.loudness || !this.speechiness)
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
        });
        await track.save();
        let aristDAOs = [];
        for (let i = 0; i < this.artists.length; i++) {
            aristDAOs.push(new ArtistDAO(artists[i]._id));
        }
        return aristDAOs;
    }

    convertTrack(track) {
        this._id = track.id;
        this.name = track.name;
        if (track.album.images.length) this.image = track.album.images[0].url;
        else this.image = "Undefined";
        this.artists = track.artists.map(this.minify);
        this.album = this.minify(track.album);
    }

    minify(item) {
        let min = {
            _id: item.id,
            name: item.name,
        }
        return min;
    }

    get _id() {
        return this._id;
    }

    set _id(id) {
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
    }

    get name() {
        return this.name;
    }

    get artists() {
        return this.artists;
    }

    get album() {
        return this.album;
    }

    get image() {
        return this.image;
    }

    get key() {
        return this.key;
    }

    get mode() {
        return this.mode;
    }

    get tempo() {
        return this.tempo;
    }

    get valence() {
        return this.valence;
    }

    get danceability() {
        return this.danceability;
    }

    get energy() {
        return this.energy;
    }

    get acousticness() {
        return this.acousticness;
    }

    get instrumentalness() {
        return this.instrumentalness;
    }

    get liveness() {
        return this.liveness;
    }

    get loudness() {
        return this.loudness;
    }

    get speechiness() {
        return this.speechiness;
    }
}

// _id: String,
// name: String,
// artists: Array, 
// album: Object,  
// image: String,
// key: Number,
// mode: Number,
// tempo: Number,
// valence: Number,
// danceability: Number,
// energy: Number,
// acousticness: Number,
// instrumentalness: Number,
// liveness: Number,
// loudness: Number,
// speechiness: Number,