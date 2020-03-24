// Models
let Profile = require('../models/Profile.js');

/**
 * Proflie Data Access Object
 * Various methods for working with and storing Profile Data.
 */
class ProfileDAO {
    /**
     * Constructor
     * Creates a new instance of Profile Data access object for a given user.
     * 
     * @param {User} user User object for owner of profile.
     */
    constructor(user) {
        this.user = user._id;
    }

    /**
     * Is In Database
     * Return boolean if profile is stored in database.
     * 
     * @returns {boolean}
    */
    async inDatabase() {
        try {
            return (await Profile.findOne({ user: this.user })) != null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Initialize
     * Resets data
    */
    async initialize() {
        try {
            this.tracks = {};
            this.artists = {};
            this.genres = {};
            this.playlists = [];
            this.topPlayed = {
                tracks: [[],[],[]],
                artists: [[],[],[]],
            },
            this.topSaved = {
                artists: [],
                genres: [],
            }
            this.total = 0;
            this.audioFeatures = {
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
            }
            this.history = {
                added: [],
                artists: [],
                genres: [],
            },
            this.privacy = {
                public: false,
                link: false,
                numerics: false,
                audioFeatures: {
                    characteristics: false,
                    probabilibites: false,
                    averages: false,
                    distributions: false,
                    extremes: false,
                    topPlayed: false,
                },
                topPlayed: {
                    tracks: [false, false, false],
                    artists: [false, false, false],
                },
                topSaved: {
                    artists: false,
                    genres: false,
                },
                history: {
                    added: false,
                    artists: false,
                    genres: false,
                },
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Save Profile
     * Saves the profile to the database.
    */
    async save() {
        try {
            if (!await this.inDatabase()) {
                let profile = new Profile({
                    user: this.user,
                    tracks: this.tracks,
                    artists: this.artists,
                    genres: this.genres,
                    playlists: this.playlists,
                    topPlayed: {
                        tracks: this.topPlayed.tracks,
                        artists: this.topPlayed.artists,
                    },
                    topSaved: {
                        artists: this.topSaved.artists,
                        genres: this.topSaved.genres,
                    },
                    audioFeatures: this.audioFeatures,
                    history: this.history,
                    privacy: this.privacy,
                });
                await profile.save();
            } else {
                await Profile.updateOne({
                    user: this.user,
                }, {
                    $set: {
                        "tracks": this.tracks,
                        "artists": this.artists,
                        "genres": this.genres,
                        "playlists": this.playlists,
                        "topPlayed.tracks": this.topPlayed.tracks,
                        "topPlayed.artists": this.topPlayed.artists,
                        "topSaved.artists": this.topSaved.artists,
                        "topSaved.genres": this.topSaved.genres,
                        "audioFeatures": this.audioFeatures,
                        "history": this.history,
                        "privacy": this.privacy,
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve Data
     * Retrieves the profile from database.
    */
    async retrieveData() {
        try {
            let profile = Profile.findOne({
                user: this.user
            });
            if (profile == null) throw new Error("Profile not found");
            else {
                this.user = user._id;
                this.tracks = profile.tracks;
                this.artists = profile.artists;
                this.genres = profile.genres;
                this.playlists = profile.playlists;
                this.topPlayed = profile.topPlayed;
                this.topSaved = profile.topSaved;
                this.audioFeatures = profile.audioFeatures;
                this.history = profile.history;
                this.privacy = profile.privacy;
            }
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /** 
     * Add Track
     * Adds track to list at given date.
     * 
     * @param {string} id Track ID
     * @param {number} added Date track was added
     */
    addSavedTrack(id, added, dao) {
        this.tracks[id] = added;
        let audioFeatures = [
            {key: "valence", arrays: true},
            {key: "danceability", arrays: true},
            {key: "energy", arrays: true},
            {key: "acousticness", arrays: true},
            {key: "instrumentalness", arrays: true},
            {key: "liveness", arrays: true},
            {key: "loudness", arrays: false},
            {key: "speechiness", arrays: true},
            {key: "key", arrays: false},
            {key: "mode", arrays: false},
            {key: "tempo", arrays: true},
        ];
        const MONTH = 2628000000;
        let now = new Date();
        let diff = Math.floor((now.getTime() - added) / MONTH);
        while (this.history.added.length - 1 < diff) {
            this.history.added.push([]);
        }
        this.history.added[diff].push(id);
        for (let i = 0; i < audioFeatures.length; i++) {
            this.audioFeatures[audioFeatures[i].key].average += dao[audioFeatures[i].key];
            if (audioFeatures[i].arrays) {
                if (audioFeatures[i].key != 'tempo')
                    this.audioFeatures[audioFeatures[i].key].distribution[ Math.round(dao[audioFeatures[i].key] * 20) ] += 1;
                else 
                    this.audioFeatures[audioFeatures[i].key].distribution[ Math.round(dao[audioFeatures[i].key] * 20 / 250) ] += 1;
                while (this.audioFeatures[audioFeatures[i].key].history.length - 1 < diff) {
                    this.audioFeatures[audioFeatures[i].key].history.push({total: 0, average: 0});
                }
                this.audioFeatures[audioFeatures[i].key].history[diff].total += 1;
                this.audioFeatures[audioFeatures[i].key].history[diff].average += dao[audioFeatures[i].key];
            }
        }
        this.total += 1;
    }

    /**
     * Average Features
     * Calculates averages for all features.
    */
    averageFeatures() {
        for (let feature in this.audioFeatures) {
            this.audioFeatures[feature].average /= this.total;
        }
    }

    /** 
     * Add Artist
     * Adds artist to list with tracks.
     * 
     * @param {string} id Artist ID
     * @param {number} tracks Array of Track IDs
     */
    addSavedArtist(id, tracks) {
        if (id in this.artists) {
            this.artists[id] = this.artists[id].concat(tracks);
        } else {
            this.artists[id] = tracks;
        } 
    }

    /** 
     * Add Saved Genre
     * Adds genre to list
     * 
     * @param {object} genres Object with genres and ids
     */
    addGenres(genres) {
        for (let genre in genres) {
            if (genre in this.genres) {
                this.genres[genre].trackNum += genres[genre].trackNum;
                this.genres[genre].artists = this.genres[genre].artists.concat(genres[genre].artists);
            } else {
                this.genres[genre] = genres[genre].getProfileObject();
            }
        }
    }

    /** 
     * Add Top Played
     * Fills in ids for a chart of top played items.
     * 
     * @param {string} type artists or tracks
     * @param {TracksDAO | ArtistsDAO} items items to be filled in
     * @param {number} timeRange Time range for top played items. 
     */
    addTopPlayed(type, items, timeRange) {
        this.topPlayed[type][timeRange] = items.getIDs();
    }

    /**
     * Add Playlist
     * Adds playlist id to list of playlists in profile
     * 
     * @param {string} id Playlist ID 
     */
    addPlaylist(id) {
        this.playlists.push(id);
    }

    /**
     * Process Top Saved
     * Determines top saved artists and genres.
     */
    async processTopSaved() {
        try {
            let allArtists = await Object.entries(this.artists).sort((a, b) => {
                return b[1].length - a[1].length;
            }).splice(0, 50);
            this.topSaved.artists = await allArtists.map((artist) => artist[0]);
            let allGenres = await Object.entries(this.genres).sort((a, b) => {
                return b[1].trackNum - a[1].trackNum;
            }).splice(0, 50);
            this.topSaved.genres = await allGenres.map((genre) => genre[0]);
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }


    getSimularSaved(track) {
        
    }

    getTracksLikedFromArtist(id) {

    }

    getTracksLikedFromGenre(id) {

    }

    getArtistsLikedFromGenre(id) {

    }

    getHistoryFromTracks(trackIDs) {

    }

    sortTracksByDate(tracks) {

    }

    getPercentiles(track) {

    }
}


module.exports = ProfileDAO;



//     async getNearest(trackDAO, n, spotifyAPI) {
//         try {
//             let tracks = await (await Object.keys(this.tracks)).map(async (track) => {
//                 return await (await new TrackDAO(track)).getData(spotifyAPI);
//             });
//             var distance = function(a, b) {
//                 return Math.pow((a.tempo / 250) - (b.tempo / 250), 2) + Math.pow(a.valence - b.valence, 2) + Math.pow(a.danceability - b.danceability, 2) + Math.pow(a.energy - b.energy, 2) + Math.pow(a.acousticness - b.acousticness, 2)+ Math.pow(a.instrumentalness - b.instrumentalness, 2)+ Math.pow(a.liveness - b.liveness, 2)+ Math.pow(a.speechiness - b.speechiness, 2);
//             }
//             let tree = new Proximity.kdTree(tracks, distance, ["tempo", "valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "speechiness"]);
//             let track = await trackDAO.getData(spotifyAPI);
//             return await tree.nearest(track, n);
//         } catch(error) {
//             throw(error);
//         }
//     }


//     async historyFromTracks(tracks) {
//         try {
//             tracks = await tracks.filter(async (track) => { return await this.containsTrack(await track.getID())});
//             const MONTH_MILI = 2628000000;
//             let now = (new Date()).getTime();
//             let history = [];
//             for (let i = 0; i < tracks.length; i++) {
//                 let date = this.tracks[tracks[i].getID()];
//                 let diff = Math.floor((now - date) / MONTH_MILI);
//                 while (history.length <= diff) {
//                     history.push(0);
//                 }
//                 history[diff] += 1;
//             }
//             return history;
//         } catch(error) {
//             throw error;
//         }
//     }

//     async sortTracksByDate(spotifyAPI, tracks) {
//         try {
//             tracks = await tracks.filter(async (track) => { return await this.containsTrack(await track.getID())});
//             tracks = await tracks.map(async (track) => {
//                 let sortObject = await track.getData(spotifyAPI);
//                 sortObject.dateAdded = await this.tracks[await track.getID()];
//                 return sortObject;
//             });
//             return await tracks.sort((a, b) => {
//                 return a.dateAdded - b.dateAdded;
//             });
//         } catch(error) {
//             throw error;
//         }
//     }

//     async getPercentiles(spotifyAPI, track) {
//         try {
//             if (!this._id) throw new Error("No ID");
//             if (!Object.keys(this.tracks).length)
//                 await this.retrieve(spotifyAPI);
//             let percentiles = {
//                 // if less than
//                 tempo: 0,
//                 valence: 0,
//                 danceability: 0,
//                 energy: 0,
//                 acousticness: 0,
//                 instrumentalness: 0,
//                 liveness: 0,
//                 loudness: 0,
//                 speechiness: 0,
//             }
//             if (!Object.keys(this.tracks).length)
//                 return percentiles;
//             let total = 0;
//             let trackAudioFeatures = await track.getAudioFeatures(spotifyAPI);
//             let percentileKeys = Object.keys(percentiles);
//             let tracks = await TrackSchema.find({_id : { $in : await Object.keys(this.tracks)}});
//             for (let i = 0; i < tracks.length; i++) {
//                 for (let j = 0; j < percentileKeys.length; j++)
//                     if (trackAudioFeatures[percentileKeys[j]] > tracks[i][percentileKeys[j]]) 
//                         percentiles[percentileKeys[j]] += 1;
//                 total += 1;
//             }
//             for (let j = 0; j < percentileKeys.length; j++)
//                 percentiles[percentileKeys[j]] /= total;
//             return percentiles;
//         } catch(error) {
//             throw error;
//         }
//     }

