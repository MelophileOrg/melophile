const mongoose = require('mongoose');

let TrackDAO = require('./TrackDAO.js');
let ArtistDAO = require('./ArtistDAO.js');

let UserSchema = require('../schemas/UserSchema.js');
let TrackSchema = require('../schemas/TrackSchema.js');

let Proximity = require('../services/Proximity.js');

class UserDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.username = ((data && data.username) ? data.username : null);
        this.updated = ((data && data.updated) ? data.updated : null);
        this.images = ((data && data.images) ? data.images : []);
        this.tracks = ((data && data.tracks) ? data.tracks : {});
        this.artists = ((data && data.artists) ? data.artists : {});
        this.genres = ((data && data.genres) ? data.genres : {});
        this.playlists = ((data && data.playlists) ? data.playlists : []);
        this.topPlayed = ((data && data.topPlayed) ? data.topPlayed : {
            tracks: [null,null,null],
            artists: [null,null,null],
        });
        this.topSaved = ((data && data.topSaved) ? data.topSaved : {
            artists: [],
            genres: [],
        });
        this.audioFeatures = ((data && data.audioFeatures) ? data.audioFeatures : {
            valence: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            danceability: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            energy: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            acousticness: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            instrumentalness: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            liveness: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            loudness: {
                average: 0,
            },
            speechiness: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            key: {
                average: 0,
            },
            mode: {
                average: 0,
            },
            tempo: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
        });
        this.total = 0;
        this.history = ((data && data.history) ? data.history : {
            added: [],
            genres: [],
            artists: [],
        });
        this.privacy = ((data && data.privacy) ? data.privacy : {
            public: false,
            protected: true,
            values: false, // saved songs, artists, genres,
            audioFeatures: {
                valence: {average: false, distribtion: false, timeline: false, extremes: false},
                danceability: {average: false, distribtion: false, timeline: false, extremes: false},
                energy: {average: false, distribtion: false, timeline: false, extremes: false},
                tempo: {average: false, distribtion: false, timeline: false, extremes: false},
                mode: {average: false, distribtion: false, timeline: false, extremes: false},
                loudness: {average: false, distribtion: false, timeline: false, extremes: false},
                key: {average: false, distribtion: false, timeline: false, extremes: false},
                speechiness: {average: false, distribtion: false, timeline: false, extremes: false},
                instrumentalness: {average: false, distribtion: false, timeline: false, extremes: false},
                acousticness: {average: false, distribtion: false, timeline: false, extremes: false},
                liveness: {average: false, distribtion: false, timeline: false, extremes: false},
            },
            topPlayed: {
                tracks: false,
                artists: false,
            },
            topSaved: {
                artists: false,
                genres: false,
            },
            history: {
                added: false,
                months: false,
                years: false,
                artists: false,
                genres: false,
            },
        });
    }

// Public Methods

    // Returns boolean of whether user is saved in database.
    async inDatabase() {
        try {
            return (await UserSchema.findOne({ _id: this._id })) != null;
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

    async save(spotifyAPI) {
        try {
            if (typeof(this.username) != 'string' || !this.topPlayed.tracks[0] || !this.playlists.length || typeof(this.images) != 'string' || this.privacy || !Object.keys(this.tracks).length || !Object.keys(this.artists).length || !Object.keys(this.genres).length || !this.audioFeatures.valence.history.length || !this.history.added.length)
                await this.retrieve(spotifyAPI);
            this.updated = (await new Date()).getTime();
            await this.averageAudioFeatures();
            await this.findTopSaved();
            if (await this.inDatabase()) {
                await UserSchema.updateOne({
                    _id: this._id,
                }, {
                    $set: {
                        "username": this.username,
                        "images": this.images,
                        "tracks": this.tracks,
                        "artists": this.artists,
                        "genres": this.genres,
                        "playlists": this.playlists,
                        "topPlayed": this.topPlayed,
                        "topSaved": this.topSaved,
                        "audioFeatures": this.audioFeatures,
                        "history": this.history,
                        "privacy": this.privacy,
                        "updated": this.updated,
                    }
                });
            } else {
                let user = new UserSchema({
                    _id: this._id,
                    username: this.username,
                    images: this.images,
                    tracks: this.tracks,
                    artists: this.artists,
                    genres: this.genres,
                    playlists: this.playlists,
                    topPlayed: this.topPlayed,
                    topSaved: this.topSaved,
                    audioFeatures: this.audioFeatures,
                    history: this.history,
                    privacy: this.privacy,
                    updated: this.updated,
                });
                await user.save();
            }
        } catch(error) {
            throw error;
        }
    }

    async getNearest(trackDAO, n, spotifyAPI) {
        try {
            let tracks = await (await Object.keys(this.tracks)).map(async (track) => {
                return await (await new TrackDAO(track)).getData(spotifyAPI);
            });
            var distance = function(a, b) {
                return Math.pow((a.tempo / 250) - (b.tempo / 250), 2) + Math.pow(a.valence - b.valence, 2) + Math.pow(a.danceability - b.danceability, 2) + Math.pow(a.energy - b.energy, 2) + Math.pow(a.acousticness - b.acousticness, 2)+ Math.pow(a.instrumentalness - b.instrumentalness, 2)+ Math.pow(a.liveness - b.liveness, 2)+ Math.pow(a.speechiness - b.speechiness, 2);
            }
            let tree = new Proximity.kdTree(tracks, distance, ["tempo", "valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "speechiness"]);
            let track = await trackDAO.getData(spotifyAPI);
            return await tree.nearest(track, n);
        } catch(error) {
            throw(error);
        }
    }

    getArtist(artistID) {
        try {
            if (!this.containsArtist(artistID)) return null;
            return this.artists[artistID];
        } catch(error) {
            throw error;
        }
    }

    // Returns Track DAO's of artist tracks liked.
    async getTracksFromArtist(artistID) {
        try {
            if (!this.containsArtist(artistID)) return [];
            let tracks = this.artists[artistID];
            return await tracks.map(async (track) => {
                return await new TrackDAO(track);
            });
        } catch(error) {
            throw error;
        }
    }

    // Genre Object
    async getGenre(genreID) {
        try {
            if (!this.containsGenre(genreID)) return null;
            return this.genres[genreID];
        } catch(error) {
            throw error;
        }
    }

    // Returns Liked Artist's DAOs of a given genre
    async getArtistsFromGenre(genreID) {
        try {
            if (!this.containsGenre(genreID)) return [];
            let artists = this.genres[genreID].artists;
            artists = await artists.sort((a, b) => {
                return this.artists[b].length - this.artists[a].length;
            });
            return await artists.map(async (artist) => {
                return await new ArtistDAO(artist);
            });
        } catch(error) {
            throw error;
        }
    }

    async historyFromTracks(tracks) {
        try {
            tracks = await tracks.filter(async (track) => { return await this.containsTrack(await track.getID())});
            const MONTH_MILI = 2628000000;
            let now = (new Date()).getTime();
            let history = [];
            for (let i = 0; i < tracks.length; i++) {
                let date = this.tracks[tracks[i].getID()];
                let diff = Math.floor((now - date) / MONTH_MILI);
                while (history.length <= diff) {
                    history.push(0);
                }
                history[diff] += 1;
            }
            return history;
        } catch(error) {
            throw error;
        }
    }

    async sortTracksByDate(spotifyAPI, tracks) {
        try {
            tracks = await tracks.filter(async (track) => { return await this.containsTrack(await track.getID())});
            tracks = await tracks.map(async (track) => {
                let sortObject = await track.getData(spotifyAPI);
                sortObject.dateAdded = await this.tracks[await track.getID()];
                return sortObject;
            });
            return await tracks.sort((a, b) => {
                return a.dateAdded - b.dateAdded;
            });
        } catch(error) {
            throw error;
        }
    }

    containsTrack(id) {
        return (id in this.tracks);
    }

    containsArtist(id) {
        return (id in this.artists);
    }

    containsPlaylist(id) {
        return (this.playlists.includes(id));
    }

    containsGenre(name) {
        try {
            return (name in this.genres);
        } catch(error) {
            throw error;
        }
    }

    async getPercentiles(spotifyAPI, track) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!Object.keys(this.tracks).length)
                await this.retrieve(spotifyAPI);
            let percentiles = {
                // if less than
                tempo: 0,
                valence: 0,
                danceability: 0,
                energy: 0,
                acousticness: 0,
                instrumentalness: 0,
                liveness: 0,
                loudness: 0,
                speechiness: 0,
            }
            if (!Object.keys(this.tracks).length)
                return percentiles;
            let total = 0;
            let trackAudioFeatures = await track.getAudioFeatures(spotifyAPI);
            let percentileKeys = Object.keys(percentiles);
            let tracks = await TrackSchema.find({_id : { $in : await Object.keys(this.tracks)}});
            for (let i = 0; i < tracks.length; i++) {
                for (let j = 0; j < percentileKeys.length; j++)
                    if (trackAudioFeatures[percentileKeys[j]] > tracks[i][percentileKeys[j]]) 
                        percentiles[percentileKeys[j]] += 1;
                total += 1;
            }
            for (let j = 0; j < percentileKeys.length; j++)
                percentiles[percentileKeys[j]] /= total;
            return percentiles;
        } catch(error) {
            throw error;
        }
    }

// Process Methods

    averageAudioFeatures() {
        let features = ['valence', 'energy', 'danceability', 'tempo', 'key', 'mode', 'speechiness', 'instrumentalness', 'acousticness', 'loudness', 'liveness'];
        for (let i = 0; i < features.length; i++) {
            this.audioFeatures[features[i]].average /= this.total;
            if (features[i] == 'key' || features[i] == 'mode' || features[i] == 'loudness') continue;
            for (let j = 0; j < this.audioFeatures[features[i]].history.length; j++) {
                if (this.audioFeatures[features[i]].history[j].total > 0)
                    this.audioFeatures[features[i]].history[j].value /= this.audioFeatures[features[i]].history[j].total;
                else if (features[i] == 'tempo')
                    this.audioFeatures[features[i]].history[j].value = 125;
                else
                    this.audioFeatures[features[i]].history[j].value = .5;
            }
        }
    }

    async findTopSaved() {
        this.topSaved.artists = (await Object.entries(this.artists)).sort((a, b) => { return b[1].length - a[1].length}).splice(0, 50).map(artist => artist[0]);
        this.topSaved.genres = (await Object.entries(this.genres)).sort((a, b) => { return b[1].track_num - a[1].track_num}).splice(0, 50).map(genre => genre[0]);
    }

    async addTrack(track, dateAdded) {
        this.tracks[track.getID()] = dateAdded;
        const MONTH_MILI = 2628000000;
        let now = (new Date()).getTime();
        let diff = Math.floor((now - dateAdded) / MONTH_MILI);
        await this.historyPadding(diff);
        this.history.added[diff] += 1;
        this.addFeatureValues(await track.getAudioFeatures(), diff);
    }

    async addFeatureValues(track, diff) {
        let features = ['valence', 'energy', 'danceability', 'tempo', 'key', 'mode', 'speechiness', 'instrumentalness', 'acousticness', 'loudness', 'liveness'];
        for (let i = 0; i < features.length; i++) {
            this.audioFeatures[features[i]].average += track[features[i]];
            let divider;
            switch(i) {
                case 3:
                    divider = 250;
                    break;
                case 4:
                case 5:
                case 9:
                    continue;
                default:
                    divider = 1;
                    break;
            }
            let index = Math.round((track[features[i]] / divider) * 20);
            this.audioFeatures[features[i]].distribution[ ( index < 21 ? index : 20) ] += 1;
            await this.featureHistoryPadding(diff, features[i]);
            this.audioFeatures[features[i]].history[diff].total += 1;
            this.audioFeatures[features[i]].history[diff].value += track[features[i]];
        }
        this.total += 1;
    }

    featureHistoryPadding(index, feature) {
        while (this.audioFeatures[feature].history.length <= index) {
            this.audioFeatures[feature].history.push({total: 0, value: 0});
        }
    }

    historyPadding(index) {
        while (this.history.added.length <= index) {
            this.history.added.push(0);
        }
    }

    addTopPlayedTracks(list, index) {
        this.topPlayed.tracks[index] = list;
    }

    addTopPlayedArtists(list, index) {
        this.topPlayed.artists[index] = list;
    }

    addArtist(id, tracks) {
        if (this.containsGenre(id)) this.artists[id] = this.artists[id].concat(tracks);
        else this.artists[id] = tracks;
    }

    addGenre(name, artists, track_num) {
        if (!this.containsGenre(name)) this.genres[name] = {artists: artists ? artists : [], track_num: track_num ? track_num : 0};
        else {
            this.genres[name].artists = this.genres[name].artists.concat((artists ? artists : []));
            this.genres[name].track_num += (track_num ? track_num : 0);
        }
    }

    addPlaylist(id) { 
        if (!this.containsPlaylist(id)) this.playlists.push(id);
    }

    addTopSavedArtists(artists) {
        this.topSaved.artists = artists;
    }

    generateTopSavedArtists() {
        this.topSaved.artists = (((Object.entries(this.artists)).sort((a, b) =>  b[1].length - a[1].length)).splice(0, 50)).map(this.minTopSavedArtist);
    }

    minTopSavedArtist(artist) {
        let newArtist = {
            _id: artist[0],
            track_num: artist[1].length
        }
        return newArtist;
    }

    addTopSavedGenres(genres) {
        this.topSaved.genres = genres;
    }

    generateTopSavedGenres() {
        this.topSaved.genres = ((Object.entries(this.genres)).sort((a, b) => b[1].track_num - a[1].track_num)).splice(0, 50);
    }

// Helper Methods

    async retrieve(spotifyAPI) {
        try {
            let response = await spotifyAPI.getMe();
            let user = response.body;
            this._id = user.id;
            this.username = user.display_name;
            this.images = user.images;
            if (await this.inDatabase()) {
                let savedData = await UserSchema.findOne({ _id: this._id });
                let keys = Object.keys(savedData._doc);
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] == '_id' || keys[i] == 'username' || keys[i] == 'images' || keys[i] == '__v') continue;
                    this[keys[i]] = savedData._doc[keys[i]];
                }
            }
        } catch(error) {
            throw error;
        }
    }

// Get Methods

    getID() {
        return this._id;
    }

    getUsername() {
        return this.username;
    }

    getImages() {
        return this.images;
    }

    getTracks() {
        return this.tracks;
    }

    getArtists() {
        return this.artists;
    }

    getGenres() {
        return this.genres;
    }

    getPlaylists() {
        return this.playlists;
    }

    getTopPlayed() {
        return this.topPlayed;
    }

    getTopSaved() {
        return this.topSaved;
    }

    getAudioFeatures() {
        return this.audioFeatures;
    }

    getHistory() {
        return this.history;
    }
}
// Export
module.exports = UserDAO;