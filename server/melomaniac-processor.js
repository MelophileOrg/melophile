const mongoose = require('mongoose');

let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const User = Items.user;

class MelomaniacProcessor {
    constructor(accessToken) {
        this.setupSpotifyAPI(accessToken);
    }

    async start() {
        await this.createUser();
        await this.processSavedTracks();
        await this.processTopCharts();
        await this.processUserPlaylists();
        await this.updateUser();
    }

    setupSpotifyAPI(accessToken) {
        this.spotifyAPI = new SpotifyWebApi();
        this.spotifyAPI.setAccessToken(accessToken);
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
                    privacy: {
                        public: false,
                        protected: true,
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
            console.log(error);
            res.sendStatus(500);
        }
    }

    async processSavedTracks() {
        this.savedTracks = {};
        this.savedArtists = {};
        await this.retrieveSavedTracks(0);
    }

    async retrieveSavedTracks(offset) {
        let tracks;
        try {
            tracks = await this.getSavedTracks(offset);
            await this.saveTracks(tracks.map(track => track.track));
        } catch(error) {
            console.log(error);
            res.sendStatus(500);
        }
        for (let i = 0; i < tracks.length; i++) {
            try {
                this.savedTracks[tracks[i].track.id] = (await new Date(tracks[i].added_at)).getTime();
            } catch(error) {
                console.log(error);
            }
        }
        if (!(tracks.length < 50))
            await this.retrieveSavedTracks(offset + 50);
    }

    async processTopCharts() {
        this.topTracks = [];
        this.topArtists = [];
        await this.retrieveTopTracks();
        await this.retrieveTopArtists();
    }

    async retrieveTopTracks() {
        for (let i = 0; i < 3; i++) {
            try {
                let trackIDs = await this.saveTracks(await this.getTopTracks(i, 0));
                this.topTracks.push(trackIDs);
            } catch(error) {
                console.log(error);
            }
        }
    }

    async retrieveTopArtists(newArtists) {
        for (let i = 0; i < 3; i++) {
            try {
                let artistIDs = await this.savedArtists(await this.getTopArtists(i, 0));
                this.topArtists.push(artistIDs);
            } catch(error) {
                console.log(error);
            }
        }
    }

    async processUserPlaylists() {
        // Get All
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
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    async saveTracks(tracks) {
        let unsaved = [];
        let artists = [];
        for (let i = 0; i < tracks.length; i++) {
            try {
                if (this.trackInDatabase(tracks[i].id) && this.savedTracks[tracks[i].id] == null) 
                    unsaved.push(tracks[i]);
            } catch(error) {
                console.log(error);
                unsaved.push(artists[i]);
            }
        }
        let trackData = unsaved;
        if (trackData[0].artists == null || trackData[0].name == null || trackData[0].album == null) trackData = await this.getTracks(unsaved.map(track => track.id));
        let audioFeatures
        try {
            audioFeatures = await this.getAudioFeaturesForTracks(trackData.map(track => track.id));
        } catch(error) {
            console.log(error);
            return;
        }
        for (let i = 0; i < trackData.length; i++) {
            for (let j = 0; j < trackData[i].artists.length; j++)
                artists = this.concatUnique(artists, trackData[i].artists.map(artist => artist.id));
            try {
                let image;
                if (trackData[i].album.images.length == 0) 
                    image = "Undefined";
                else    
                    image = trackData[i].album.images[0].url;
                let track = new Track({
                    _id: trackData[i].id,
                    name: trackData[i].name,
                    artists: trackData[i].artists.map(artist => artist.id),
                    image: image,
                    key: audioFeatures[i].key,
                    mode: audioFeatures[i].mode,
                    tempo: audioFeatures[i].tempo,
                    valence: audioFeatures[i].valence,
                    danceability: audioFeatures[i].danceability,
                    energy: audioFeatures[i].energy,
                    acousticness: audioFeatures[i].acousticness,
                    instrumentalness: audioFeatures[i].instrumentalness,
                    liveness: audioFeatures[i].liveness,
                    loudness: audioFeatures[i].loudness,
                    speechiness: audioFeatures[i].speechiness,
                });
                await track.save();
            } catch(error) {
                console.log(error);
                console.log(trackData[i]);
            }
        }
        await this.saveArtists(artists);
        return tracks.map(track => track.id);
    }

    async saveArtists(artists) {
        let unsaved = [];
        for (let i = 0; i < artists.length; i++) {
            try {
                if (await this.artistInDatabase(artists[i].id) && this.savedArtists[artists[i].id] == null)
                    unsaved.push(artists[i]);
            } catch(error) {
                console.log(error);
                unsaved.push(artists[i]);
            }
        }
        let artistData = unsaved;
        try {
            if (artistData[0].name == null || artistData[0].genres == null)
                artistData = await this.getArtists(artistData.map(artist => artist.id));
        } catch(error) {
            console.log(error);
            return;
        }
        for (let i = 0; i < artistsData.length; i++) {
            try {
                let image;
                if (artistData[i].images.length == 0) 
                    image = "Undefined";
                else    
                    image = artistData[i].images[0].url;
                let artist = new Artist({
                    _id: artistsData[i].id,
                    name: artistsData[i].name,
                    image: image,
                    genres: artistsData[i].genres,
                    tracks: newArtists[artistsData[i].id],
                });
                await artist.save();
            } catch(error) {
                console.log(error);
                console.log(artistData[i]);
            }
        }
        return artists.map(artist => artist.id);
    }

    async trackInDatabase(trackID) {
        try {
            return (await Track.find({_id: trackID})).length == 0;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    async artistInDatabase(artistID) {
        try {
            return (await Artist.find({_id: artistID})).length == 0;
        } catch(error) {
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
            console.log(error);
            return 1;
        }
    }
    async getTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getTracks(trackIDs);
            return response.body.tracks;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async getSavedTracks(offset) {
        try {
            let response = await this.spotifyAPI.getMySavedTracks({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getAudioFeaturesForTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTrack(trackID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getAudioFeaturesForTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
            console.log(response.audio_features);
            return response.body.audio_features;
        } catch (error) {
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
            console.log(error);
            return 1;
        } 
    }
    async getArtists(artistIDs) {
        try {
            let response = await this.spotifyAPI.getArtists(artistIDs);
            return response.body.artists;
        } catch (error) {
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
            console.log(error);
            return 1;
        }  
    }
    async getUserPlaylists(userID) {
        try {
            let response = await this.spotifyAPI.getUserPlaylists(userID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getPlaylistTracks(playlistID, offset) {
        try {
            let response = await this.spotifyAPI.getPlaylistTracks(playlistID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }

}

module.exports = {
    processor: MelomaniacProcessor
}