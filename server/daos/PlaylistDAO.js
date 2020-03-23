// Models
let Playlist = require('../models/Playlist.js');

// Associated DAOs
let TracksDAO = require('./TracksDAO.js');

/**
 * Playlist Data Access Object
 * Various methods for working with and retrieving a given playlist.
 */
class PlaylistDAO {
    /**
     * Contructor
     * Creates a new instance of Playlist Data Access object for a given playlist. Loads in data.
     * 
     * @param {string} id Spotify ID for playlist.
     * @param {object} data Option data to pre-load into DAO.
    */
    constructor(id, data) {
        if (!id) throw new Error("No ID Provided.");
        this._id = id;
        if (data) {
            this.name = (('name' in data) ? data.name : null);
            this.owner = (('owner' in data) ? data.owner : null);
            if ('external_urls' in this.owner) delete this.owner.external_urls;
            if ('href' in this.owner) delete this.owner.href;
            if ('type' in this.owner) delete this.owner.type;
            if ('uri' in this.owner) delete this.owner.uri;
            this.image = (('images' in data) ? data.images : null);
            this.description = (('description' in data) ? data.description : null);
            this.public = (('public' in data) ? data.public : null);
            this.tracks = (('tracks' in data) ? ('items' in data.tracks  ? this.loadTracks(data.tracks.items) : (!('total' in data.tracks)) ? data.tracks : null ) : null);
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
     * Return boolean if playlist is stored in database.
     * 
     * @returns {boolean}
    */
    async inDatabase() {
        try {
            return ((await Playlist.findOne({ _id: this._id })) != null);
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Get Full Object
     * Returns full playlist data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
     * @returns {object} object with full playlist data.
    */
    async getFullObject(spotifyAPI) {
        try {
            
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Retrieve Full Object
     * Retrieves full playlist data.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveFullObject(spotifyAPI) {
        try {
            if (typeof(this.name) == 'string' && typeof(this.description) == 'string' && this.owner && this.images instanceof Array && typeof(this.public) == 'boolean' && this.tracks && typeof(this.key) == 'number' && typeof(this.mode) == 'number' && typeof(this.tempo) == 'number' && typeof(this.valence) == 'number' && typeof(this.danceability) == 'number' && typeof(this.energy) == 'number' && typeof(this.acousticness) == 'number' && typeof(this.instrumentalness) == 'number' && typeof(this.liveness) == 'number' && typeof(this.loudness) == 'number' && typeof(this.speechiness) == 'number') 
                return;
            if (await this.inDatabase()) {
                await this.retrieveFullObjectFromDatabase();
            } else {
                await this.retrieveFullObjectFromSpotify(spotifyAPI);
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Retrieve Full Object From Database
     * Retrieves full playlist data from Database.
    */
    async retrieveFullObjectFromDatabase() {
        try {
            let playlist = await Playlist.findOne({ _id: this._id });
            if (playlist) {
                this.name = playlist.name;
                this.description = playlist.description;
                this.owner = playlist.owner;
                this.images = playlist.images;
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
            }
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Retrieve Full Object From Spotify API
     * Retrieves full playlist data from Spotify API.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveFullObjectFromSpotify(spotifyAPI) {
        try {
            let response = await spotifyAPI.getPlaylist(this._id);
            this.name = response.body.name;
            this.description = response.body.description;
            this.owner = response.body.owner;
            if ('external_urls' in this.owner) delete this.owner.external_urls;
            if ('href' in this.owner) delete this.owner.href;
            if ('type' in this.owner) delete this.owner.type;
            if ('uri' in this.owner) delete this.owner.uri;
            this.images = response.body.images;
            this.public = response.body.public;
            this.tracks = await this.loadTracks(response.body.tracks.items);
            await this.retrieveTracks(spotifyAPI);
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Retrieve Playlist Tracks
     * Retrieves all tracks for a given playlist.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async retrieveTracks(spotifyAPI) {
        try {
            if (this.tracks == null) this.tracks = {};
            let response;
            let offset = 0;
            let tracks = new TracksDAO();
            do {
                response = await spotifyAPI.getPlaylistTracks(this._id, {limit: 100, offset: offset});
                await this.loadTracks(response.body.items, offset);
                await tracks.loadBaseDataWithDate(response.body.items);
                offset += 100;
            } while (!(response.body.items.length < 100));
            await tracks.save(spotifyAPI);

        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Save to Database
     * Saves data to database. Retrieves data if nessisary.
     * 
     * @param {spotify-web-api} spotifyAPI spotify-web-api instance.
    */
    async save(spotifyAPI) {
        try {
            await this.retrieveFullObjectFromSpotify(spotifyAPI);
            if (await this.inDatabase()) {
                await Playlist.updateOne({
                    _id: this._id
                }, {
                    $set: {
                        "name": this.name, 
                        "description": this.description,
                        "images": this.images,
                        "public": this.public,
                        "tracks": this.tracks,
                        "key": 0,
                        "mode": 0,
                        "tempo": 0,
                        "valence": 0,
                        "danceability": 0,
                        "energy": 0,
                        "acousticness": 0,
                        "instrumentalness": 0,
                        "liveness": 0,
                        "loudness": 0,
                        "speechiness": 0,
                    }
                });
            } else {
                let playlist = new Playlist({
                    _id: this._id,
                    name: this.name, 
                    description: this.description,
                    owner: this.owner,
                    images: this.images,
                    public: this.public,
                    tracks: this.tracks,
                    key: 0,
                    mode: 0,
                    tempo: 0,
                    valence: 0,
                    danceability: 0,
                    energy: 0,
                    acousticness: 0,
                    instrumentalness: 0,
                    liveness: 0,
                    loudness: 0,
                    speechiness: 0,
                });
                await playlist.save();
            }
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Load Tracks
     * Loads tracks from playlist full object.
     * 
     * @param {array} tracks Tracks provided by request for full playlist.
    */
    loadTracks(tracks, offset) {
        try {
            if (typeof(offset) != 'number') offset = 0; 
            if (this.tracks == null) this.tracks = {};
            for (let i = 0; i < tracks.length; i++) {
                if (!tracks[i].track) continue;
                if (tracks[i].is_local) continue;
                if (tracks[i].track.id in this.tracks) continue;
                this.tracks[tracks[i].track.id] = {added: (new Date(tracks[i].added_at)).getTime(), index: offset + i};
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PlaylistDAO;


//          async getPlaylistTracks(spotifyAPI) {
    //         try {
    //             if (!this._id) throw new Error("No ID");
    //             if (!this.tracks) await this.retrieveTracks(spotifyAPI);
    //             return await this.trackDAOs();
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async getDistributions(spotifyAPI) {
    //         try {
    //             if (!this._id) throw new Error("No ID");
    //             if (!this.tracks) await this.retrieveTracks(spotifyAPI);
    //             let distributions = {
    //                 valence: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 danceability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 tempo: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 energy: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 acousticness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 instrumentalness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 liveness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //                 speechiness: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //             }
    //             let trackKeys = Object.keys(this.tracks);
    //             if (trackKeys.length == 0) return distributions;
    //             let audioFeatures = [];
    //             while (trackKeys.length > 0) {
    //                 let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
    //                 audioFeatures = await audioFeatures.concat(response.body.audio_features);
    //             }
    //             let features = await Object.keys(distributions);
    //             for (let i = 0; i < audioFeatures.length; i++) {
    //                 if (!audioFeatures[i]) continue;
    //                 for (let j = 0; j < features.length; j++) {
    //                     if (features[j] == 'tempo') 
    //                         distributions[features[j]][ (Math.round(audioFeatures[i][features[j]] / 250) * 20) ] += 1;
    //                     else 
    //                         distributions[features[j]][ Math.round(audioFeatures[i][features[j]] * 20) ] += 1;
    //                 }
    //             }
    //             return distributions;
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async getTimelines(spotifyAPI) {
    //         try {
    //             if (!this._id) throw new Error("No ID");
    //             if (!this.tracks) await this.retrieveTracks(spotifyAPI);
    //             let timelines = {
    //                 valence: [0, 0],
    //                 danceability: [0, 0],
    //                 tempo: [0, 0],
    //                 energy: [0, 0],
    //                 acousticness: [0, 0],
    //                 instrumentalness: [0, 0],
    //                 liveness: [0, 0],
    //                 speechiness: [0, 0],
    //             }
    //             let trackKeys = Object.keys(this.tracks);
    //             if (trackKeys.length == 0) return timelines;
    //             let audioFeatures = [];
    //             while (trackKeys.length > 0) {
    //                 let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
    //                 audioFeatures = await audioFeatures.concat(response.body.audio_features);
    //             }
    //             let features = await Object.keys(timelines);
    //             for (let i = 0; i < audioFeatures.length; i++) {
    //                 for (let j = 0; j < features.length; j++) {
    //                     if (!audioFeatures[i]) 
    //                         timelines[features[j]].push(0);
    //                     else if (features[j] == 'tempo') 
    //                         timelines[features[j]].push(audioFeatures[i][features[j]] / 250);
    //                     else 
    //                         timelines[features[j]].push(audioFeatures[i][features[j]]);
    //                 }
    //             }
    //             return timelines;
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    
    //     async getPlaylistGenres() {
    //         try {
    //             if (!this._id) throw new Error("No ID");
    //             if (!this.tracks) await this.retrieveTracks(spotifyAPI);
    //             let genres = {};
    //             await (await Object.keys(this.tracks)).map(async (track) => {
    //                 let trackDAO = await new TrackDAO(track);
    //                 let trackGenres = await trackDAO.getTrackGenres(spotifyAPI);
    //                 await trackGenres.map(async (genre) => {
    //                     let genreID = genre.getID;
    //                     if (genreID in genres) genres[genreID].track_num += 1;
    //                     else genres[genreID] = {_id: genreID, name: genreID, track_num: 1};
    //                 });
    //                 return track;
    //             });
    //             return await Object.values(genres);
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async getPlaylistArtists(spotifyAPI) {
    //         try {
    //             let tracks = await this.getPlaylistTracks(spotifyAPI);
    //             let artists = {};
    //             for (let i = 0; i < tracks.length; i++) {
    //                 let trackID = await tracks[i].getID();
    //                 let trackArtists = await track.getTrackArtists(spotifyAPI);
    //                 for (let j = 0; j < trackArtists.length; j++) {
    //                     let artistID = await trackArtists[j].getID();
    //                     if (!(artistID in artists)) {
    //                         artists[artistID] = await trackArtists.getData(spotifyAPI);
    //                         artists[artistID].tracks = [trackID];
    //                     } else {
    //                         artists[artistID].tracks.push(trackID);
    //                     }
    //                 }
    //             }
    //             return (await Object.values(artists));
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async save(spotifyAPI) {
    //         try {
    //             if (!this._id) return;
    //             if (typeof(this.name) != 'string' || !this.owner || this.image.length || typeof(this.description) != 'string' || typeof(this.public) != "boolean")
    //                 await this.retrieve(spotifyAPI);
    //             if (!Object.keys(this.tracks).length) 
    //                 await this.retrieveTracks(spotifyAPI);
    //             if (typeof(this.key) != 'number' || typeof(this.mode) != 'number' || typeof(this.tempo) != 'number' || typeof(this.valence) != 'number' || typeof(this.danceability) != 'number' || typeof(this.energy) != 'number' || typeof(this.acousticness) != 'number' || typeof(this.instrumentalness) != 'number' || typeof(this.liveness) != 'number' || typeof(this.loudness) != 'number' || typeof(this.speechiness) != 'number')
    //                 await this.retrieveAudioFeatures(spotifyAPI);
    //             if (!(await this.inDatabase())) {
    //                 let playlist = new PlaylistSchema({
    //                     _id: this._id,
    //                     name: this.name,
    //                     owner: this.owner,
    //                     image: this.image,
    //                     description: this.description,
    //                     public: this.public,
    //                     tracks: this.tracks,
    //                     key: this.key,
    //                     mode: this.mode,
    //                     tempo: this.tempo,
    //                     valence: this.valence,
    //                     danceability: this.danceability,
    //                     energy: this.energy,
    //                     acousticness: this.acousticness,
    //                     instrumentalness: this.instrumentalness,
    //                     liveness: this.liveness,
    //                     loudness: this.loudness,
    //                     speechiness: this.speechiness,
    //                 });
    //                 await playlist.save();
    //             } else {
    //                 await PlaylistSchema.updateOne({
    //                     _id: this._id
    //                 }, {
    //                     $set: {
    //                         "_id": this._id,
    //                         "name": this.name,
    //                         "owner": this.owner,
    //                         "image": this.image,
    //                         "description": this.description,
    //                         "public": this.public,
    //                         "tracks": this.tracks,
    //                         "key": this.key,
    //                         "mode": this.mode,
    //                         "tempo": this.tempo,
    //                         "valence": this.valence,
    //                         "danceability": this.danceability,
    //                         "energy": this.energy,
    //                         "acousticness": this.acousticness,
    //                         "instrumentalness": this.instrumentalness,
    //                         "liveness": this.liveness,
    //                         "loudness": this.loudness,
    //                         "speechiness": this.speechiness,
    //                     }
    //                 });
    //             }
    //             return Object.keys(this.tracks);
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    // // Helper Methods
    
    //     async retrieve(spotifyAPI) {
    //         try {
    //             if (!this._id) {
    //                 throw new Error("No ID");
    //             } else if (typeof(this.name) == 'string' && this.owner && typeof(this.image) == 'string' && typeof(this.description) == 'string' && typeof(this.public) == 'boolean' && this.tracks) {
    //                 return;
    //             } else if (await this.inDatabase()) {
    //                 await this.retrieveFromDatabase();
    //             } else if (spotifyAPI != null) {
    //                 await this.retrieveFromAPI(spotifyAPI);
    //             }
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async retrieveFromDatabase() {
    //         try {
    //             let playlist = await PlaylistSchema.findOne({ _id: this._id });
    //             this.name = playlist.name;
    //             this.owner = playlist.owner;
    //             this.image = playlist.image;
    //             this.description = playlist.description;
    //             this.public = playlist.public;
    //             this.tracks = playlist.tracks;
    //             this.key = playlist.key;
    //             this.mode = playlist.mode;
    //             this.tempo = playlist.tempo;
    //             this.valence = playlist.valence;
    //             this.danceability = playlist.danceability;
    //             this.energy = playlist.energy;
    //             this.acousticness = playlist.acousticness;
    //             this.instrumentalness = playlist.instrumentalness;
    //             this.liveness = playlist.liveness;
    //             this.loudness = playlist.loudness;
    //             this.speechiness = playlist.speechiness;
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async retrieveFromAPI(spotifyAPI) {
    //         try {
    //             let response = await spotifyAPI.getPlaylist(this._id);
    //             let playlist = response.body;
    //             this.name = playlist.name;
    //             this.owner = playlist.owner;
    //             this.image = ('images' in playlist && playlist.images.length ? playlist.images[0].url : "");
    //             this.description = playlist.description;
    //             this.public = playlist.public;
    //             this.tracks = await this.retrieveTracks(spotifyAPI);
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     async retrieveTracks(spotifyAPI) {  
    //         try {
    //             this.tracks = {};
    //             let response = await spotifyAPI.getPlaylistTracks(this._id, {offset: 0});
    //             let tracks = response.body.items;
    //             let total = response.body.total;
    //             for (let i = 0; i < tracks.length; i++) {
    //                 this.addTrack(tracks[i].track.id, tracks[i].added_at);
    //             }
    //             for (let i = 100; i < total; i += 100) {
    //                 response = await spotifyAPI.getPlaylistTracks(this._id, {offset: i});
    //                 tracks = response.body.items;
    //                 for (let i = 0; i < tracks.length; i++) {
    //                     this.addTrack(tracks[i].track.id, tracks[i].added_at);
    //                 }
    //             }
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
        
    //     async retrieveAudioFeatures(spotifyAPI) {
    //         try {
    //             if (!this.tracks) 
    //                 await this.retrieveTracks(spotifyAPI);
    //             let audioFeatures = [];
    //             let trackKeys = Object.keys(this.tracks);
    //             if (trackKeys.length == 0) {
    //                 this.key = -1;
    //                 this.mode = .5;
    //                 this.tempo = 210;
    //                 this.valence = .5;
    //                 this.danceability = .5;
    //                 this.energy = .5;
    //                 this.acousticness = .5;
    //                 this.instrumentalness = .5;
    //                 this.liveness = .5;
    //                 this.loudness = -10;
    //                 this.speechiness = .5;
    //                 return;
    //             }
    //             let trackNum = trackKeys.length;
    //             while (trackKeys.length > 0) {
    //                 let response = await spotifyAPI.getAudioFeaturesForTracks(trackKeys.splice(0, 50));
    //                 audioFeatures = audioFeatures.concat(response.body.audio_features);
    //             }
    //             let totals = await audioFeatures.reduce(this.reduceAudioFeatures);
    //             let keys = Object.keys(totals);
    //             for (let i = 0; i < keys.length; i++) {
    //                 this[keys[i]] = totals[keys[i]] / trackNum;
    //             }
    //         } catch(error) {
    //             throw error;
    //         }
    //     }
    
    //     reduceAudioFeatures(total, item) {
    //         if (total == null || total.key == null) return item;
    //         if (item == null || item.key == null) return total;
    //         let newTotal = {
    //             key: total.key + item.key,
    //             mode: total.mode + item.mode,
    //             tempo: total.tempo + item.tempo,
    //             valence: total.valence + item.valence,
    //             danceability: total.danceability + item.danceability,
    //             energy: total.energy + item.energy,
    //             acousticness: total.acousticness + item.acousticness,
    //             instrumentalness: total.instrumentalness + item.instrumentalness,
    //             liveness: total.liveness + item.liveness,
    //             loudness: total.loudness + item.loudness,
    //             speechiness: total.speechiness + item.speechiness,
    //         }
    //         return newTotal;
    //     }
    
    //     getID() {
    //         return this._id;
    //     }
    
    //     getTracks() {
    //         return this.tracks;
    //     }
    
    //     async addTrack(trackID, dateAdded) {
    //         this.tracks[trackID] = (await new Date(dateAdded)).getTime();
    //     }
    
    //     async trackDAOs() {
    //         return await (await Object.keys(this.tracks)).map(async (track) => {
    //             return await new TrackDAO(track);
    //         });
    //     }
        
    //     getName() {
    //         return this.name;
    //     }
    
    //     getOwner() {
    //         return this.owner;
    //     }
    
    //     getImage() {
    //         return this.image;
    //     }
    
    //     getDescription() {
    //         return this.description;
    //     }
    
    //     getPublic() {
    //         return this.public;
    //     }