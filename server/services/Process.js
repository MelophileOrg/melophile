let mongoose = require('mongoose');

let UserDAO = require("../daos/UserDAO.js");
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");

class Process {
    constructor(socket, spotifyAPI, userID) {
        // Reference to Spotify API Wrapper.
        this.spotifyAPI = spotifyAPI;
        // Reference to socket connected for communication of progress.
        this.socket = socket;
        // New User Data Access Object.
        this.user = new UserDAO(userID);
    }
  
    async start() {
        try {
            // Inicialize Username, Image and ID.
            await this.user.retrieve(this.spotifyAPI);
            // Run through and save all tracks.
            await this.processSavedTracks();
            // Retrieve top played
            await this.processTopCharts();
            // Process playlists.
            await this.processUserPlaylists();
            // Save all relevent data in user object.
            await this.user.save(this.spotifyAPI);
        } catch(error) {
            console.log(error);
        }
    }

    async processSavedTracks() {
        try {
            // Start new progress bar.
            this.reportTotal = false;
            // Start process at track 0
            await this.retrieveSavedTracks(0);
        } catch(error) {
            console.log(error);
        }
    }
  
    async retrieveSavedTracks(offset) {
        try {
            // Retrieve Tracks from Spotify
            console.log("Retrieving Tracks", offset);
            let tracks = await this.getSavedTracks(offset);
            let audioFeatures = await this.retrieveAudioFeatures(tracks);
            // Track artists holder
            let artists = {};
            // Emit Progress
            this.socket.emit('ProcessMessage', {message: "Processing Liked Tracks", percent: offset / this.total});

            for (let i = 0; i < tracks.length; i++) {
                // Create new Track item.
                let track = await(new TrackDAO(tracks[i].track.id, {
                    name: tracks[i].track.name, 
                    album: tracks[i].track.album, 
                    artists: tracks[i].track.artists, 
                    popularity: tracks[i].track.popularity,
                    key: audioFeatures[tracks[i].track.id].key,
                    mode: audioFeatures[tracks[i].track.id].mode,
                    tempo: audioFeatures[tracks[i].track.id].tempo,
                    valence: audioFeatures[tracks[i].track.id].valence,
                    danceability: audioFeatures[tracks[i].track.id].danceability,
                    energy: audioFeatures[tracks[i].track.id].energy,
                    acousticness: audioFeatures[tracks[i].track.id].acousticness,
                    instrumentalness: audioFeatures[tracks[i].track.id].instrumentalness,
                    liveness: audioFeatures[tracks[i].track.id].liveness,
                    loudness: audioFeatures[tracks[i].track.id].loudness,
                    speechiness: audioFeatures[tracks[i].track.id].speechiness,
                }));
                // Check if added to user.
                if (!this.user.containsTrack(track._id)) {
                    this.user.addTrack(track._id, (await new Date(tracks[i].added_at)).getTime());
                }
                let trackArtists;
                // Check if saved.
                if (!(await track.inDatabase())) {
                    trackArtists = await track.save(this.spotifyAPI);
                    console.log("Saved");
                } else {
                    trackArtists = await track.getArtists();
                    console.log("Did not save");
                }
                for (let j = 0; j < trackArtists.length; j++) {
                    // Add artist to user.
                    this.user.addArtist(trackArtists[j]._id, [track._id]);
                    if (!(trackArtists[j]._id in artists))
                        artists[trackArtists[j]._id] = [track._id];
                    else 
                        artists[trackArtists[j]._id].push(track._id);
                }
            }
            let artistKeys = Object.keys(artists);
            let artistData = await this.retrieveArtists(artistKeys);
            // Run through track artists.
            for (let i = 0; i < artistKeys.length; i++) {
                if (artistData[artistKeys[i]] == null) continue;
                let artistDAO = new ArtistDAO(artistKeys[i], {
                    name: artistData[artistKeys[i]].name,
                    images: artistData[artistKeys[i]].images,
                    genres: artistData[artistKeys[i]].genres,
                    popularity: artistData[artistKeys[i]].popularity,
                });
                for (let j = 0; j < artistData[artistKeys[i]].genres.length; j++) {
                    // Add to user object artist and track.
                    console.log("Saving Genre");
                    this.user.addGenre(artistData[artistKeys[i]].genres[j], artists[artistKeys[i]], 1);
                }
                if (!(await artistDAO.inDatabase())) {
                    console.log("Artist Saved");
                    artistDAO.save(this.spotifyAPI);
                }
            }

            // Repeat for next 50
            if (!(tracks.length < 50)) {
                await this.retrieveSavedTracks(offset + 50);
            } else  {
                this.socket.emit('ProcessMessage', {message: "Finished Processing Tracks", percent: 1});
            }
        } catch(error) {
            console.log(error);
        }
    }

    async retrieveAudioFeatures(tracks) {
        try {
            let arr = await this.getAudioFeaturesForTracks(await tracks.map(track => track.track.id));
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                obj[arr[i].id] = arr[i];
            }
            return obj;
        } catch(error) {
            console.log(error);
        }
    }

    async retrieveArtists(artists) {
        try {
            let arr = [];
            while (artists.length > 0) {
                arr.concat(await this.getArtists(artists.splice(0, 50)));
            }
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                obj[arr[i].id] = arr[i];
            }
            return obj;
        } catch(error) {
            console.log(error);
        }
    }
  
    async processTopCharts() {
      try {
          // Get Tracks
          await this.retrieveTopTracks();
          // Get Artists
          await this.retrieveTopArtists();
      } catch(error) {
          console.log(error);
      }
    }
  
    async retrieveTopTracks() {
        try {
            // Different Time Ranges
            for (let i = 0; i < 3; i++) {
                // Request for tracks.
                let tracks = await this.getTopTracks(i, 0);
                // Add tracks to user.
                this.user.addTopPlayedTracks(await tracks.map(track => track.id), i);
                // Run through each track.
                for (let j = 0; j < tracks.length; j++) {
                    let track = new TrackDAO(tracks[j].id, {name: tracks[j].name, artists: tracks[j].artists, album: tracks[j].album, popularity: tracks[j].popularity});
                    // Save if not in database.
                    if (!(await track.inDatabase()))
                        track.save(this.spotifyAPI);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
  
    async retrieveTopArtists() {
        try {
            // Different Time Ranges
            for (let i = 0; i < 3; i++) {
                // Request for artists.
                let artists = await this.getTopArtists(i, 0);
                // Add artists to user.
                this.user.addTopPlayedArtists(await artists.map(artist => artist.id), i);
                // Run through each artist.
                for (let j = 0; j < artists.length; j++) {
                    let artist = new TrackDAO(artists[j].id, {name: artists[j].name, genres: artists[j].genres, images: artists[j].images, popularity: artists[j].popularity});
                    // Save if not in database.
                    if (!(await artist.inDatabase()))
                        artist.save(this.spotifyAPI);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
  
    async processUserPlaylists() {
        try {
            // Start new progress bar.
            this.reportTotal = false;
            // Start retrieving at playlist 0
            await this.retrieveUserPlaylists(0);
        } catch(error) {
            console.log(error);
        }  
    }
  
    async retrieveUserPlaylists(offset) {
        try {
            // Get playlist objects
            let playlists = await this.getUserPlaylists(offset);
            // For ever playlist
            for (let i = 0; i < playlists.length; i++) {
                // Create Data Access Object
                let playlist = new PlaylistDAO(playlists[i].id, {name: playlists[i].name, owner: playlists[i].owner, images: playlists[i].images, description: playlists[i].description, public: playlists[i].public});
                this.user.addPlaylist(playlist._id);
                // Save Playlist
                let tracks = await playlist.save(this.spotifyAPI);

                // for (let j = 0; j < tracks.length; j++) {
                //     // Save Tracks.
                //     let artists = await tracks[j].save(this.spotifyAPI);
                //     for (let k = 0; k < artists.length; k++) {
                //         // Save artists.
                //         artists[k].save(this.spotifyAPI);
                //     }
                // }
                // Update Progress
                this.socket.emit('ProcessMessage', {message: "Processing Playlists: " + playlists[i].name, percent: (offset + i) / this.total});
            }
            // Get the next 50
            if (!(playlists.length < 50)) 
                await this.retrieveUserPlaylists(offset + 50);
            else 
                this.socket.emit('ProcessMessage', {message: "Finished Processing Playlists", percent: 1});
        } catch(error) {
            console.log(error);
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
            if (!this.reportTotal) {
                this.total = response.body.total;
                this.reportTotal = true;
            }
            return response.body.items;
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

    async getUserPlaylists(offset) {
        try {
            let response = await this.spotifyAPI.getUserPlaylists({limit: 50, offset: offset});
            if (!this.reportTotal) {
                this.total = response.body.total;
                this.reportTotal = true;
            }
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
};

module.exports = Process;