// Model Schema
let PlaylistSchema = require('../schemas/PlaylistSchema.js');
// Other Affiliated DAOs
let TrackDAO = require('./TrackDAO.js');

class PlaylistDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.name = ((data && 'name' in data) ? data.name : null);
        this.owner = ((data && 'owner' in data) ? data.owner : null);
        this.image = ((data && 'images' in data && data.images.length) ? data.images[0].url : (data && 'image' in data) ? data.image : "");
        this.description = ((data && 'description' in data) ? data.description : null);
        this.public = ((data && 'public' in data) ? data.public : null);
        this.tracks = ((data && 'tracks' in data) ? data.tracks : null);
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
    }

// Public Methods

    async inDatabase() {
        try {
            return ((await PlaylistSchema.findOne({ _id: this._id })) != null);
        } catch(error) {
            throw error;
        }
    }

    async permission(spotifyAPI, user) {
        try {
            if (!this._id) throw new Error("No ID");
            if (typeof(this.public) == 'boolean' && this.public) return true;
            if (!this.owner) await this.retrieve(spotifyAPI);
            if (this.owner && this.owner.id == await user.getID()) return true;
            return false;
        } catch(error) {
            throw error;
        }
    }

    async getPlaylistTracks(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.tracks) await this.retrieveTracks(spotifyAPI);
            return await this.trackDAOs();
        } catch(error) {
            throw error;
        }
    }

    async getDistributions(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.tracks) await this.retrieveTracks(spotifyAPI);
            let distributions = {
                valence: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                danceability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                tempo: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                energy: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                acousticness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                instrumentalness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                liveness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                speechiness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            }
            let trackKeys = Object.keys(this.tracks);
            if (trackKeys.length == 0) return distributions;
            let audioFeatures = [];
            while (trackKeys.length > 0) {
                let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
                audioFeatures = await audioFeatures.concat(response.body.audio_features);
            }
            let features = await Object.keys(distributions);
            for (let i = 0; i < audioFeatures.length; i++) {
                if (!audioFeatures[i]) continue;
                for (let j = 0; j < features.length; j++) {
                    if (features[j] == 'tempo') 
                        distributions[features[j]][ (Math.round(audioFeatures[i][features[j]] / 250) * 20) ] += 1;
                    else 
                        distributions[features[j]][ Math.round(audioFeatures[i][features[j]] * 20) ] += 1;
                }
            }
            return distributions;
        } catch(error) {
            throw error;
        }
    }

    async getTimelines(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.tracks) await this.retrieveTracks(spotifyAPI);
            let timelines = {
                valence: [0, 0],
                danceability: [0, 0],
                tempo: [0, 0],
                energy: [0, 0],
                acousticness: [0, 0],
                instrumentalness: [0, 0],
                liveness: [0, 0],
                speechiness: [0, 0],
            }
            let trackKeys = Object.keys(this.tracks);
            if (trackKeys.length == 0) return timelines;
            let audioFeatures = [];
            while (trackKeys.length > 0) {
                let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
                audioFeatures = await audioFeatures.concat(response.body.audio_features);
            }
            let features = await Object.keys(timelines);
            for (let i = 0; i < audioFeatures.length; i++) {
                for (let j = 0; j < features.length; j++) {
                    if (!audioFeatures[i]) 
                        timelines[features[j]].push(0);
                    else if (features[j] == 'tempo') 
                        timelines[features[j]].push(audioFeatures[i][features[j]] / 250);
                    else 
                        timelines[features[j]].push(audioFeatures[i][features[j]]);
                }
            }
            return timelines;
        } catch(error) {
            throw error;
        }
    }


    async getPlaylistGenres() {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.tracks) await this.retrieveTracks(spotifyAPI);
            let genres = {};
            await (await Object.keys(this.tracks)).map(async (track) => {
                let track = await new TrackDAO(track);
                let trackGenres = await track.getTrackGenres(spotifyAPI);
                await trackGenres.map(async (genre) => {
                    let genreID = genre.getID;
                    if (genreID in genres) genres[genreID].track_num += 1;
                    else genres[genreID] = {_id: genreID, name: genreID, track_num: 1};
                });
                return track;
            });
            return await Object.values(genres);
        } catch(error) {
            throw error;
        }
    }

    async getPlaylistArtists(spotifyAPI) {
        try {
            let tracks = await this.getPlaylistTracks(spotifyAPI);
            let artists = {};
            for (let i = 0; i < tracks.length; i++) {
                let trackID = await tracks[i].getID();
                let trackArtists = await track.getTrackArtists(spotifyAPI);
                for (let j = 0; j < trackArtists.length; j++) {
                    let artistID = await trackArtists[j].getID();
                    if (!(artistID in artists)) {
                        artists[artistID] = await trackArtists.getData(spotifyAPI);
                        artists[artistID].tracks = [trackID];
                    } else {
                        artists[artistID].tracks.push(trackID);
                    }
                }
            }
            return (await Object.values(artists));
        } catch(error) {
            throw error;
        }
    }

    async save(spotifyAPI) {
        try {
            if (!this._id) return;
            if (typeof(this.name) != 'string' || !this.owner || this.image.length || typeof(this.description) != 'string' || typeof(this.public) != "boolean")
                await this.retrieve(spotifyAPI);
            if (!Object.keys(this.tracks).length) 
                await this.retrieveTracks(spotifyAPI);
            if (typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
                await this.retrieveAudioFeatures(spotifyAPI);
            if (!(await this.inDatabase())) {
                let playlist = new PlaylistSchema({
                    _id: this._id,
                    name: this.name,
                    owner: this.owner,
                    image: this.image,
                    description: this.description,
                    public: this.public,
                    tracks: this.tracks,
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
                await playlist.save();
            } else {
                await PlaylistSchema.updateOne({
                    _id: this._id
                }, {
                    $set: {
                        "_id": this._id,
                        "name": this.name,
                        "owner": this.owner,
                        "image": this.image,
                        "description": this.description,
                        "public": this.public,
                        "tracks": this.tracks,
                        "key": this.key,
                        "mode": this.mode,
                        "tempo": this.tempo,
                        "valence": this.valence,
                        "danceability": this.danceability,
                        "energy": this.energy,
                        "acousticness": this.acousticness,
                        "instrumentalness": this.instrumentalness,
                        "liveness": this.liveness,
                        "loudness": this.loudness,
                        "speechiness": this.speechiness,
                    }
                });
            }
            return Object.keys(this.tracks);
        } catch(error) {
            throw error;
        }
    }

// Helper Methods

    async retrieve(spotifyAPI) {
        try {
            if (!this._id) {
                throw new Error("No ID");
            } else if (typeof(this.name) == 'string' && this.owner && typeof(this.image) == 'string' && typeof(this.description) == 'string' && typeof(this.public) == 'boolean' && this.tracks) {
                return;
            } else if (await this.inDatabase()) {
                await this.retrieveFromDatabase();
            } else if (spotifyAPI != null) {
                await this.retrieveFromAPI(spotifyAPI);
            }
        } catch(error) {
            throw error;
        }
    }

    async retrieveFromDatabase() {
        try {
            let playlist = await PlaylistSchema.findOne({ _id: this._id });
            this.name = playlist.name;
            this.owner = playlist.owner;
            this.image = playlist.image;
            this.description = playlist.description;
            this.public = playlist.public;
            this.tracks = playlist.tracks;
            this.key = playlist.key;
            this.mode = playlist.mode;
            this.tempo = playlist.tempo;
            this.valence = playlist.valence;
            this.danceability = playlist.danceability;
            this.energy = playlist.energy;
            this.acousticness = playlist.acousticness;
            this.instrumentalness = playlist.instrumentalness;
            this.liveness = playlist.liveness;
            this.loudness = playlist.loudness;
            this.speechiness = playlist.speechiness;
        } catch(error) {
            throw error;
        }
    }

    async retrieveFromAPI(spotifyAPI) {
        try {
            let response = await spotifyAPI.getPlaylist(this._id);
            let playlist = response.body;
            this.name = playlist.name;
            this.owner = playlist.owner;
            this.image = ('images' in playlist && playlist.images.length ? playlist.images[0].url : "");
            this.description = playlist.description;
            this.public = playlist.public;
            this.tracks = await this.retrieveTracks(spotifyAPI);
        } catch(error) {
            throw error;
        }
    }

    async retrieveTracks(spotifyAPI) {  
        try {
            this.tracks = {};
            let response = await spotifyAPI.getPlaylistTracks(this._id, {offset: 0});
            let tracks = response.body.items;
            let total = response.body.total;
            for (let i = 0; i < tracks.length; i++) {
                this.addTrack(tracks[i].track.id, tracks[i].added_at);
            }
            for (let i = 100; i < total; i += 100) {
                response = await spotifyAPI.getPlaylistTracks(this._id, {offset: i});
                tracks = response.body.items;
                for (let i = 0; i < tracks.length; i++) {
                    this.addTrack(tracks[i].track.id, tracks[i].added_at);
                }
            }
        } catch(error) {
            throw error;
        }
    }
    
    async retrieveAudioFeatures(spotifyAPI) {
        try {
            if (!this.tracks) 
                await this.retrieveTracks(spotifyAPI);
            let audioFeatures = [];
            let trackKeys = Object.keys(this.tracks);
            if (trackKeys.length == 0) {
                this.key = -1;
                this.mode = .5;
                this.tempo = 210;
                this.valence = .5;
                this.danceability = .5;
                this.energy = .5;
                this.acousticness = .5;
                this.instrumentalness = .5;
                this.liveness = .5;
                this.loudness = -10;
                this.speechiness = .5;
                return;
            }
            let trackNum = trackKeys.length;
            while (trackKeys.length > 0) {
                let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
                audioFeatures = audioFeatures.concat(response.body.audio_features);
            }
            let totals = await audioFeatures.reduce(this.reduceAudioFeatures);
            let keys = Object.keys(totals);
            for (let i = 0; i < keys.length; i++) {
                this[keys[i]] = totals[keys[i]] / trackNum;
            }
        } catch(error) {
            throw error;
        }
    }

    reduceAudioFeatures(total, item) {
        if (total == null || total.key == null) return item;
        if (item == null || item.key == null) return total;
        let newTotal = {
            key: total.key + item.key,
            mode: total.mode + item.mode,
            tempo: total.tempo + item.tempo,
            valence: total.valence + item.valence,
            danceability: total.danceability + item.danceability,
            energy: total.energy + item.energy,
            acousticness: total.acousticness + item.acousticness,
            instrumentalness: total.instrumentalness + item.instrumentalness,
            liveness: total.liveness + item.liveness,
            loudness: total.loudness + item.loudness,
            speechiness: total.speechiness + item.speechiness,
        }
        return newTotal;
    }

    getID() {
        return this._id;
    }

    getTracks() {
        return this.tracks;
    }

    async addTrack(trackID, dateAdded) {
        this.tracks[trackID] = (await new Date(dateAdded)).getTime();
    }

    async trackDAOs() {
        return await (await Object.keys(this.tracks)).map(async (track) => {
            return await new TrackDAO(track);
        });
    }
    
    getName() {
        return this.name;
    }

    getOwner() {
        return this.owner;
    }

    getImage() {
        return this.image;
    }

    getDescription() {
        return this.description;
    }

    getPublic() {
        return this.public;
    }
}

module.exports = PlaylistDAO;