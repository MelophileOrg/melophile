const mongoose = require('mongoose');

let UserSchema = require('../schemas/UserSchema.js');

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

    async inDatabase() {
        return (await UserSchema.findOne({ _id: this._id })) != null;
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

    containsTrack(id) {
        return (id in this.tracks);
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

    getArtists() {
        return this.artists;
    }

    containsArtist(id) {
        return (id in this.artists);
    }

    addArtist(id, tracks) {
        if (this.containsGenre(id)) this.artists[id] = this.artists[id].concat(tracks);
        else this.artists[id] = tracks;
    }

    getGenres() {
        return this.genres;
    }

    containsGenre(name) {
        try {
            return (name in this.genres);
        } catch(error) {
            throw error;
        }
    }

    addGenre(name, artists, track_num) {
        if (!this.containsGenre(name)) this.genres[name] = {artists: artists ? artists : [], track_num: track_num ? track_num : 0};
        else {
            this.genres[name].artists = this.genres[name].artists.concat((artists ? artists : []));
            this.genres[name].track_num += (track_num ? track_num : 0);
        }
    }

    getPlaylists() {
        return this.playlists;
    }

    containsPlaylist(id) {
        return (this.playlists.includes(id));
    }

    addPlaylist(id) { 
        if (!this.containsPlaylist(id)) this.playlists.push(id);
    }

    getTopPlayed() {
        return this.topPlayed;
    }

    addTopPlayedTracks(list, index) {
        this.topPlayed.tracks[index] = list;
    }

    addTopPlayedArtists(list, index) {
        this.topPlayed.artists[index] = list;
    }

    getTopSaved() {
        return this.topSaved;
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

    getAudioFeatures() {
        return this.audioFeatures;
    }

    getHistory() {
        return this.history;
    }
}

module.exports = UserDAO;