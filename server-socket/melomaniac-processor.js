const mongoose = require('mongoose');

let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const Playlist = Items.playlist;
const User = Items.user;

class MelomaniacProcessor {
    constructor(accessToken, socket) {
        this.tokenSet = false;
        this.setupSpotifyAPI(accessToken);
        this.socket = socket;
    }

    async start() {
        try {
            this.artistNum = 0;
            if (!this.tokenSet) 
                return;
            this.socket.emit('ProcessMessage', {message: "Creating User"});
            await this.createUser();
            this.socket.emit('ProcessMessage', {message: "Processing Liked Tracks"});
            await this.processSavedTracks();
            this.socket.emit('ProcessMessage', {message: "Processing Top Charts"});
            await this.processTopCharts();
            this.socket.emit('ProcessMessage', {message: "Processing Playlists"});
            this.totalSent = false;
            await this.processUserPlaylists();
            this.socket.emit('ProcessMessage', {message: "Saving Data"});
            await this.updateUser();
            this.socket.emit('ProcessMessage', {message: "Finished"});
            console.log(this.artistNum);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    setupSpotifyAPI(accessToken) {
        this.totalSent = false;
        this.spotifyAPI = new SpotifyWebApi();
        this.spotifyAPI.setAccessToken(accessToken);
        this.tokenSet = true;
    }

    async createUser() {
        try {
            let userData = await this.getMe();
            let foundUser = await User.find({_id: userData.id});
            if (foundUser.length == 0) {
                let user = new User({
                    _id: userData.id,
                    username: userData.display_name,
                    images: userData.images,
                    tracks: [],
                    topPlayed: {
                        tracks: [],
                        artists: [],
                    },
                    playlists: [],
                    privacy: {
                        public: false,
                        protected: true,
                        values: false, // saved songs, artists, genres,
                        audioFeatures: {
                            characteristics: false, // valence, danceability, energy
                            averages: false, // tempo, mode, loudness, key
                            probabilities: false, // speechiness, instrumentalness, acousticness, liveness
                        },
                        topPlayed: {
                            tracks: false,
                            artists: false,
                        },
                        topSaved: {
                            artists: false,
                            genres: false,
                        },
                        extremes: {
                            valence: false,
                            danceability: false,
                            energy: false,
                            tempo: false,
                            loudness: false,
                            speechiness: false,
                            instrumentalness: false,
                            acousticness: false,
                            liveness: false,
                        },
                        history: {
                            added: false,
                            months: false,
                            years: false,
                            valence: false,
                            danceability: false,
                            energy: false,
                            tempo: false,
                            loudness: false,
                            speechiness: false,
                            instrumentalness: false,
                            acousticness: false,
                            liveness: false,
                        },
                    },
                });
                user.save();
            }
            this.userID = userData.id;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            res.sendStatus(500);
        }
    }

    async processSavedTracks() {
        try {
            this.savedTracks = {};
            this.savedArtists = {};
            await this.retrieveSavedTracks(0);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async retrieveSavedTracks(offset) {
        try {
            this.socket.emit('ProcessedTracks', {processed: offset});
            let tracks = await this.getSavedTracks(offset);
            await this.saveTracks(tracks.map(track => track.track));
            for (let i = 0; i < tracks.length; i++)
                this.savedTracks[tracks[i].track.id] = (await new Date(tracks[i].added_at)).getTime();
            if (!(tracks.length < 50))
                await this.retrieveSavedTracks(offset + 50);
            else {
                this.socket.emit('DoneTracks');
            }
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async processTopCharts() {
        try {
            this.topTracks = [];
            this.topArtists = [];
            await this.retrieveTopTracks();
            await this.retrieveTopArtists();
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async retrieveTopTracks() {
        try {
            for (let i = 0; i < 3; i++) {
                let trackIDs = await this.saveTracks(await this.getTopTracks(i, 0));
                this.topTracks.push(trackIDs);
            }
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async retrieveTopArtists() {
        try {
            for (let i = 0; i < 3; i++) {
                let artistIDs = await this.saveArtists(await this.getTopArtists(i, 0));
                this.topArtists.push(artistIDs);
            }
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async processUserPlaylists() {
        try {
            this.playlists = [];
            await this.retrieveUserPlaylists(0);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
            
    }

    async retrieveUserPlaylists(offset) {
        try {
            this.socket.emit('ProcessedTracks', {processed: offset});
            let playlists = await this.getUserPlaylists(offset);
            this.playlists = this.playlists.concat(playlists.map(playlist => playlist.id));
            for (let i = 0; i < playlists.length; i++) {
                let tracks = [];
                let playlistTracks = {};
                for (let j = 0; j < Math.ceil(playlists[i].tracks.total / 50); j++) {
                    let trackData = await this.getPlaylistTracks(playlists[i].id, (j * 50));
                    tracks = await this.concatUnique(tracks, await trackData.map(track => track.track));
                    for (let k = 0; k < trackData.length; k++) {
                        playlistTracks[trackData[k].track.id] = (await new Date(trackData[k].added_at)).getTime();
                    }
                }
                let image;
                if (playlists[i].images.length == 0) 
                    image = "Undefined";
                else    
                    image = playlists[i].images[0].url;
                if ((await this.playlistInDatabase(playlists[i].id))) {
                    await Playlist.updateOne({
                        _id: playlists[i].id,
                    }, {
                        $set: {
                            "name": playlists[i].name,
                            "description": playlists[i].description,
                            "image": image,
                            "public": playlists[i].public,
                            "tracks": playlistTracks,
                        }
                    });
                }
                else {
                    let playlist = await new Playlist({
                        _id: playlists[i].id,
                        name: playlists[i].name, 
                        owner: playlists[i].owner,
                        image: image,
                        description: playlists[i].description,
                        public: playlists[i].public,
                        tracks: playlistTracks,
                    });
                    await playlist.save();
                }
               await this.saveTracks(tracks);
            }
            if (!(playlists.length < 50)) 
                await this.retrieveUserPlaylists(offset + 50);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
        
    }

    async updateUser() {
        try {
            await User.updateOne({
                _id: this.userID
            },
            {
                $set: {
                    "tracks": this.savedTracks,
                    "topPlayed.tracks": this.topTracks, 
                    "topPlayed.artists": this.topArtists,
                    "playlists": this.playlists,
                }
            });
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async saveTracks(tracks) {
        try {
            let unsaved = {};
            let newArtists = {};
            for (let i = 0; i < tracks.length; i++) {
                if (!(tracks[i].id in this.savedTracks) && !(tracks[i].id in unsaved) && !(await this.trackInDatabase(tracks[i].id))) {
                    unsaved[tracks[i].id] = {track: tracks[i]};
                }     
            }
            let ids = Object.keys(unsaved);
            if (ids.length > 0) {
                let invalid = (!('artists' in unsaved[ids[0]]) || !('name' in unsaved[ids[0]]) || !('album' in unsaved[ids[0]]))
                let parsedIDS = Object.keys(unsaved);
                while (parsedIDS.length > 0) {
                    let max = 50;
                    if (parsedIDS.length < 50) 
                        max = parsedIDS.length;
                    let cutIds = parsedIDS.splice(0, max);
                    if (invalid) {
                        let trackData = await this.getTracks(cutIds);
                        for (let i = 0; i < trackData.length; i++) {
                            unsaved[trackData[i].id].track = trackData[i];
                        }
                    }
                    let audioFeatures = await this.getAudioFeaturesForTracks(cutIds);
                    for (let i = 0; i < audioFeatures.length; i++) {
                        unsaved[audioFeatures[i].id].audioFeatures = audioFeatures[i];
                    }
                }
                console.log(unsaved);
                for (let i = 0; i < ids.length; i++) {
                    if (!('audioFeatures' in unsaved[ids[i]]) || unsaved[ids[i]] == null) {
                        console.log("AUDIO FEATURES MISSING");
                        continue;
                    }
                    for (let j = 0; j < unsaved[ids[i]].track.artists.length; j++) {
                        if (!(unsaved[ids[i]].track.artists[j].id in newArtists))
                            newArtists[unsaved[ids[i]].track.artists[j].id] = unsaved[ids[i]].track.artists[j];
                    }
                    let image;
                    if (unsaved[ids[i]].track.album.images.length == 0) 
                        image = "Undefined";
                    else    
                        image = unsaved[ids[i]].track.album.images[0].url;
                    let track = new Track({
                        _id: ids[i] 
                        name: unsaved[ids[i]].track.name,
                        artists: unsaved[ids[i]].track.artists.map(artist => artist.id),
                        image: image,
                        key: unsaved[ids[i]].audioFeatures.key,
                        mode: unsaved[ids[i]].audioFeatures.mode,
                        tempo: unsaved[ids[i]].audioFeatures.tempo,
                        valence: unsaved[ids[i]].audioFeatures.valence,
                        danceability: unsaved[ids[i]].audioFeatures.danceability,
                        energy: unsaved[ids[i]].audioFeatures.energy,
                        acousticness: unsaved[ids[i]].audioFeatures.acousticness,
                        instrumentalness: unsaved[ids[i]].audioFeatures.instrumentalness,
                        liveness: unsaved[ids[i]].audioFeatures.liveness,
                        loudness: unsaved[ids[i]].audioFeatures.loudness,
                        speechiness: unsaved[ids[i]].audioFeatures.speechiness,
                    });
                    await track.save();
                }
                await this.saveArtists(Object.values(newArtists));
            }
            return tracks.map(track => track.id);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async saveArtists(artists) {
        try {
            let unsaved = [];
            for (let i = 0; i < artists.length; i++) {
                this.artistNum += 1;
                if (!(artists[i].id in this.savedArtists) && !(await this.artistInDatabase(artists[i].id)))
                    unsaved.push(artists[i]);
            }
            if (unsaved.length > 0) {
                let artistData;
                if (!('name' in unsaved[0]) || !('genres' in unsaved[0])) {
                    artistData = [];
                    while (unsaved.length > 0) {
                        let max = 50;
                        if (unsaved.length < 50) 
                            max = unsaved.length;
                        let cutArtists = unsaved.splice(0, max);
                        let ids = cutArtists.map(artist => artist.id);
                        artistData = this.concatUnique(artistData, await this.getArtists(ids));
                    }
                }
                else {
                    artistData = unsaved;
                }
                for (let i = 0; i < artistData.length; i++) {
                    let image;
                    if (artistData[i].images.length == 0) 
                        image = "Undefined";
                    else    
                        image = artistData[i].images[0].url;
                    let artist = new Artist({
                        _id: artistData[i].id,
                        name: artistData[i].name,
                        image: image,
                        genres: artistData[i].genres,
                    });
                    await artist.save();
                }
            }
            return artists.map(artist => artist.id);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }

    async trackInDatabase(trackID) {
        try {
            return (await Track.find({_id: trackID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }

    async artistInDatabase(artistID) {
        try {
            return (await Artist.find({_id: artistID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }

    async playlistInDatabase(playlistID) {
        try {
            return (await Playlist.find({_id: playlistID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }

    concatUnique(arr1, arr2) {
        let newArr = arr1;
        for (let i = 0; i < arr2.length; i++) {
            if (!(newArr.includes(arr2[i])))
                newArr.push(arr2[i]);
        }
        return newArr;
    }

    getSavedTracksArray() {
        return Object.keys(this.savedTracks);
    }

    getSavedArtistsArray() {
        return Object.keys(this.savedArtists);
    }

    async getMe() {
        try {
            let response = await this.spotifyAPI.getMe();
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }

    // TRACKS
    async getTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getTrack(trackID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }

    async getTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getTracks(trackIDs);
            return response.body.tracks;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }

    async getSavedTracks(offset) {
        try {
            let response = await this.spotifyAPI.getMySavedTracks({limit: 50, offset: offset});
            if (!this.totalSent) 
                this.socket.emit('TotalTracks', {total: response.body.total});
            this.totalSent = true;
            
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

    async getAudioFeaturesForTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTrack(trackID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

    async getAudioFeaturesForTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
            return response.body.audio_features;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }

    // ARTIST
    async getArtist(artistID) {
        try {
            let response = await this.spotifyAPI.getArtist(artistID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }

    async getArtists(artistIDs) {
        try {
            let response = await this.spotifyAPI.getArtists(artistIDs);
            return response.body.artists;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }

    // CHARTS
    async getTopArtists(time_range, offset) {
        try {
            let time_ranges = ["short_term", "medium_term", "long_term"];
            let adjusted_time_range = time_ranges[time_range];
            let response = await this.spotifyAPI.getMyTopArtists({time_range: adjusted_time_range, limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }

    async getTopTracks(time_range, offset) {
        try {
            let time_ranges = ["short_term", "medium_term", "long_term"];
            let adjusted_time_range = time_ranges[time_range];
            let response = await this.spotifyAPI.getMyTopTracks({time_range: adjusted_time_range, limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

    // PLAYLIST
    async getPlaylist(playlistID) {
        try {
            let response = await this.spotifyAPI.getPlaylist(playlistID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

    async getUserPlaylists(offset) {
        try {
            let response = await this.spotifyAPI.getUserPlaylists({limit: 50, offset: offset});
            if (!this.totalSent) 
                this.socket.emit('TotalTracks', {total: response.body.total});
            this.totalSent = true;
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

    async getPlaylistTracks(playlistID, offset) {
        try {
            let response = await this.spotifyAPI.getPlaylistTracks(playlistID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }

}

module.exports = {
    processor: MelomaniacProcessor
}