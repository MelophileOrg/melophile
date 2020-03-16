// Dependencies
let generateSpotifyWebAPI = require('../general/GenerateSpotifyWebAPI.js');

// Data Access Objects
let ProfileDAO = require('../../daos/ProfileDAO.js');
let TrackDAO = require('../../daos/TrackDAO.js');
let TracksDAO = require('../../daos/TracksDAO.js');
let ArtistDAO = require('../../daos/ArtistDAO.js');
let ArtistsDAO = require('../../daos/ArtistsDAO.js');
let PlaylistDAO = require('../../daos/PlaylistDAO.js');
let PlaylistsDAO = require('../../daos/PlaylistDAO.js');

/**
 * Processor Service
 * retrieves and saves all user library information.
*/
class Processor {
    /**
     * Contructor
     * Creates a new instance of Process service for a given user.
     * 
     * @param {socket} socket socket.io socket instance object.
     * @param {string} authToken Authorization token from Spotify
    */
    constructor(socket, authToken) {
        try {
            this.socket = socket;
            this.spotifyAPI = generateSpotifyWebAPI(authToken);
            this.retrieveUser();
        } catch(error) {
            throw error;
        }
    }

    /**
     * Retrieve User
     * Requests user data to access profile.
    */
    async retrieveUser() {
        try {
            let response = await this.spotifyAPI.getMe();
            this.user = new UserDAO(response.body.id, {username: response.body.display_name, images: response.body.images});
        } catch(error) {
            throw error;
        }
    }

    /**
     * Start
     * Starts the processing service.
    */
    async start() {
        try {
            await this.initializeProfile();
            // await this.processSavedTracks();
            // await this.processTopCharts();
            // await this.processUserPlaylists();
            // await this.user.save(this.spotifyAPI);
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Profile Inicialization
     * 
     */
    async initializeProfile() {
        try {
            this.profile = new ProfileDAO(this.user._id, {username: this.user.username, images: this.user.images});
            if (this.profile.inDatabase())
                this.profile.loadFromDatabase();
            else 
                this.profile.initializeNew();
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }


    async processSavedTracks() {
        try {
            // Start new progress bar.
            this.reportTotal = false;
            // Start process at track 0
            await this.retrieveSavedTracks(0);
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    async retrieveSavedTracks(offset) {
        try {
            // Retrieve Tracks from Spotify
            let tracks = await this.getSavedTracks(offset);
            let audioFeatures = await this.retrieveAudioFeatures(await tracks.map(track => track.track));
            // Track artists holder
            let artists = {};
            // Emit Progress
            this.socket.emit('ProcessMessage', {message: "Processing Library", percent: offset / this.total});

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
                if (!this.user.containsTrack(track.getID())) {
                    this.user.addTrack(track, (await new Date(tracks[i].added_at)).getTime());
                }
                let trackArtists;
                // Check if saved.
                if (!(await track.inDatabase())) {
                    trackArtists = await track.save(this.spotifyAPI);
                } else {
                    trackArtists = await track.getArtists();
                }
                for (let j = 0; j < trackArtists.length; j++) {
                    // Add artist to user.
                    this.user.addArtist(trackArtists[j]._id, [track.getID()]);
                    if (!(trackArtists[j]._id in artists))
                        artists[trackArtists[j]._id] = [track.getID()];
                    else 
                        artists[trackArtists[j]._id].push(track.getID());
                }
            }
            let artistKeys = Object.keys(artists);
            let artistData = await this.retrieveArtists(Object.keys(artists));
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
                    this.user.addGenre(artistData[artistKeys[i]].genres[j], artists[artistKeys[i]], 1);
                }
                if (!(await artistDAO.inDatabase())) {
                    artistDAO.save(this.spotifyAPI);
                }
            }

            // Repeat for next 50
            if (!(tracks.length < 50)) {
                await this.retrieveSavedTracks(offset + 50);
            } else  {
                this.socket.emit('ProcessMessage', {message: "Finished Library", percent: 1});
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    async retrieveAudioFeatures(tracks) {
        try {
            let arr = await this.getAudioFeaturesForTracks(await tracks.map(track => track.id));
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                obj[arr[i].id] = arr[i];
            }
            return obj;
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    async retrieveArtists(artists) {
        try {
            let arr = [];
            while (artists.length > 0) {
                arr = arr.concat(await this.getArtists(artists.splice(0, 50)));
            }
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                obj[arr[i].id] = arr[i];
            }
            return obj;
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    async processTopCharts() {
      try {
          // Get Tracks
          await this.retrieveTopTracks();
          // Get Artists
          await this.retrieveTopArtists();
      } catch(error) {
        console.trace(error);  
        throw error;
      }
    }
  
    async retrieveTopTracks() {
        try {
            // Different Time Ranges
            for (let i = 0; i < 3; i++) {
                this.socket.emit('ProcessMessage', {message: "Retrieving Top Tracks", percent: i / 3});
                // Request for tracks.
                let tracks = await this.getTopTracks(i, 0);
                let audioFeatures = await this.retrieveAudioFeatures(tracks);
                // Add tracks to user.
                this.user.addTopPlayedTracks(await tracks.map(track => track.id), i);
                // Run through each track.
                for (let j = 0; j < tracks.length; j++) {
                    let track = await (new TrackDAO(tracks[j].id, {
                        name: tracks[j].name, 
                        artists: tracks[j].artists, 
                        album: tracks[j].album, 
                        popularity: tracks[j].popularity,
                        key: audioFeatures[tracks[j].id].key,
                        mode: audioFeatures[tracks[j].id].mode,
                        tempo: audioFeatures[tracks[j].id].tempo,
                        valence: audioFeatures[tracks[j].id].valence,
                        danceability: audioFeatures[tracks[j].id].danceability,
                        energy: audioFeatures[tracks[j].id].energy,
                        acousticness: audioFeatures[tracks[j].id].acousticness,
                        instrumentalness: audioFeatures[tracks[j].id].instrumentalness,
                        liveness: audioFeatures[tracks[j].id].liveness,
                        loudness: audioFeatures[tracks[j].id].loudness,
                        speechiness: audioFeatures[tracks[j].id].speechiness,
                    }));
                    // Save if not in database.
                    if (!(await track.inDatabase()))
                        track.save(this.spotifyAPI);
                }
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    async retrieveTopArtists() {
        try {
            // Different Time Ranges
            for (let i = 0; i < 3; i++) {
                this.socket.emit('ProcessMessage', {message: "Retrieving Top Artists", percent: i / 3});
                // Request for artists.
                let artists = await this.getTopArtists(i, 0);
                // Add artists to user.
                this.user.addTopPlayedArtists(await artists.map(artist => artist.id), i);
                // Run through each artist.
                for (let j = 0; j < artists.length; j++) {
                    let artist = await (new ArtistDAO(artists[j].id, {name: artists[j].name, genres: artists[j].genres, images: artists[j].images, popularity: artists[j].popularity}));
                    // Save if not in database.
                    if (!(await artist.inDatabase()))
                        artist.save(this.spotifyAPI);
                }
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    async processUserPlaylists() {
        try {
            // Start new progress bar.
            this.reportTotal = false;
            // Start retrieving at playlist 0
            await this.retrieveUserPlaylists(0);
        } catch(error) {
            console.trace(error);
            throw error;
        }  
    }
  
    async retrieveUserPlaylists(offset) {
        try {
            // Get playlist objects
            let playlists = await this.getUserPlaylists(offset);
            // For ever playlist
            for (let i = 0; i < playlists.length; i++) {
                // Create Data Access Object
                let playlist = await (new PlaylistDAO(playlists[i].id, {
                    name: playlists[i].name, 
                    owner: playlists[i].owner, 
                    images: playlists[i].images, 
                    description: playlists[i].description, 
                    public: playlists[i].public
                }));
                this.user.addPlaylist(playlist._id);
                // Save Playlist
                await playlist.retrieveAudioFeatures(this.spotifyAPI);
                await playlist.save(this.spotifyAPI);
                this.socket.emit('ProcessMessage', {message: "Processing Playlists: " + playlists[i].name, percent: (offset + i) / this.total});
            }
            // Get the next 50
            if (!(playlists.length < 50)) 
                await this.retrieveUserPlaylists(offset + 50);
            else 
                this.socket.emit('ProcessMessage', {message: "Finished Processing Playlists", percent: 1});
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    async getTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getTracks(trackIDs);
            return response.body.tracks;
        } catch (error) {
            console.trace(error);
            throw error;
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
            console.trace(error);
            throw error;
        }  
    }

    async getAudioFeaturesForTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
            return response.body.audio_features;
        } catch (error) {
            console.trace(error);
            throw error;
        }
    }

    async getArtists(artistIDs) {
        try {
            let response = await this.spotifyAPI.getArtists(artistIDs);
            return response.body.artists;
        } catch (error) {
            console.trace(error);
            throw error;
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
            console.trace(error);
            throw error;
        } 
    }

    async getTopTracks(time_range, offset) {
        try {
            let time_ranges = ["short_term", "medium_term", "long_term"];
            let adjusted_time_range = time_ranges[time_range];
            let response = await this.spotifyAPI.getMyTopTracks({time_range: adjusted_time_range, limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.trace(error);
            throw error;
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
            console.trace(error);
            throw error;
        }  
    }
    
}
// Process Function
let process = async function(socket, authToken) {
    try {
        let processor = await new Processor(socket, authToken);
        await processor.start();
    } catch(error) {
        throw error;
    }
};

module.exports = process;
