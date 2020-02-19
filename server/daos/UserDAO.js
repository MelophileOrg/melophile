const mongoose = require('mongoose');

let UserSchema = require('../schemas/UserSchema.js');

class UserDAO {
    constructor(id, data) {
        this.id = id ? id : null;
        this.username = (data && data.username) ? data.username : null;
        this.updated = (data && data.updated) ? data.updated : null;
        this.images = (data && data.images) ? data.images : [];
        this.tracks = (data && data.tracks) ? data.tracks : {};
        this.artists = (data && data.artists) ? data.artists : {};
        this.genres = (data && data.genres) ? data.genres : {};
        this.playlists = (data && data.playlists) ? data.playlists : [];
        this.topPlayed = (data && data.topPlayed) ? data.topPlayed : {
            tracks: [null,null,null],
            artists: [null,null,null],
        };
        this.topSaved = (data && data.topSaved) ? data.topSaved : {
            artists: [],
            genres: [],
        };
        this.audioFeatures = (data && data.audioFeatures) ? data.audioFeatures : {
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
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            speechiness: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            key: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            mode: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            },
            tempo: {
                average: 0,
                distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
                history: [],
            }
        };
        this.history = (data && data.history) ? data.history : {
            added: [],
            genres: [],
            artists: [],
        };
        this.privacy = (data && data.privacy) ? data.privacy : {
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
        };
    }

    async retrieve(spotifyAPI) {
        try {
            let response = await spotifyAPI.getMe();
            let user = response.body;
            this._id = user.id;
            this.username = user.display_name;
            this.images = images;
            if (this.inDatabase()) 
                this.privacy = (await UserSchema.findOne({ _id: this._id })).privacy;
            
        } catch(error) {
            console.log(error);
        }
    }

    async inDatabase() {
        return (await UserSchema.findOne({ _id: this._id })) != null;
    }

    async save(spotifyAPI) {
        try {
            if (!this.username || !this.images || !this.privacy)
                await this.retrieve(spotifyAPI);
            if (!this.tracks || !this.artists || !this.genres || !this.audioFeatures || !this.history)
                await this.retrieveSavedTracks(spotifyAPI);
            if (!this.topPlayed) 
                await this.retrieveCharts(spotifyAPI);
            if (!this.playlists) 
                await this.retrievePlaylists(spotifyAPI);
            this.updated = (await new Date()).getTime();
            if (this.inDatabase()) {
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
            console.log(error);
        }
    }

    get _id() {
        return this._id;
    }

    get username() {
        return this.username;
    }

    get images() {
        return this.images;
    }

    get tracks() {
        return this.tracks;
    }

    containsTrack(id) {
        return (id in this.tracks);
    }

    addTrack(id, dateAdded) {
        if (!this.containsTrack(id))
            this.tracks[id] = {dateAdded: (await new Date(dateAdded)).getTime()};
    }

    get artists() {
        return this.artists;
    }

    containsArtist(id) {
        return (id in this.artists);
    }

    addArtist(id, tracks) {
        if (this.containsGenre(id)) this.artists[id] = this.artists[id].concat(tracks);
        else this.artists[id] = tracks;
    }

    get genres() {
        return this.genres;
    }

    containsGenre(name) {
        return (name in this.genres);
    }

    addGenre(name, artists, track_num) {
        if (!this.containsGenre(name)) this.genres[name] = {artists: artists ? artists : [], track_num: track_num ? track_num : 0};
        else {
            this.genres[name].artists = this.genres[name].artists.concat((artists ? artists : []));
            this.genres[name].track_num += (track_num ? track_num : 0);
        }
    }

    get playlists() {
        return this.playlists;
    }

    containsPlaylist(id) {
        return (this.playlists.includes(id));
    }

    addPlaylist(id) { 
        if (!this.containsPlaylist(id)) this.playlists.push(id);
    }

    get topPlayed() {
        return this.topPlayed;
    }

    addTopPlayedTracks(list, index) {
        this.topPlayed.tracks[index] = list;
    }

    addTopPlayedArtists(list, index) {
        this.topPlayed.artists[index] = list;
    }

    get topSaved() {
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

    get audioFeatures() {
        return this.audioFeatures;
    }

    get history() {
        return this.history;
    }
}

module.exports = UserDAO;