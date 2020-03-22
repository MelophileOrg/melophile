// Dependencies
let generateSpotifyWebAPI = require('../general/GenerateSpotifyWebAPI.js');

let User = require('../../models/User.js');

// Data Access Objects
let ProfileDAO = require('../../daos/ProfileDAO.js');
let TracksDAO = require('../../daos/TracksDAO.js');
//let ArtistsDAO = require('../../daos/ArtistsDAO.js');
// let PlaylistDAO = require('../../daos/PlaylistDAO.js');
// let PlaylistsDAO = require('../../daos/PlaylistDAO.js');

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
            this.token = authToken;
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
            this.spotifyAPI = await generateSpotifyWebAPI(this.token);
            await this.initializeProfile();
            await this.processSavedTracks();
            this.profile.averageFeatures();
            console.log(this.profile);
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
     * Sets up Profile DAO with blank slate.
     */
    async initializeProfile() {
        try {
            let response = await this.spotifyAPI.getMe();
            this.user = await User.findOne({
                spotifyID: response.body.id
            });
            this.profile = await new ProfileDAO(this.user);
            await this.profile.initialize();
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }

    /**
     * Process Saved Tracks
     * Begins process of saving user's tracks to their profile.
    */
    async processSavedTracks() {
        try {
            this.reportTotal = false;
            await this.retrieveSavedTracks(0);
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    /**
     * Retrieve Saved Tracks
     * Retrieves user's saved tracks at offset and saves data. Retrieves 50 tracks at a time.
     * 
     * @param {number} offset Track to begin with.
    */
    async retrieveSavedTracks(offset) {
        try {
            console.log(offset);
            this.socket.emit('ProcessMessage', {message: "Processing Liked Tracks: " + Math.round(offset / this.total * 100) + "%", percent: offset / this.total});
            let response = await this.getSavedTracks(offset);
            // Tracks
            let tracks = new TracksDAO();
            await tracks.loadBaseDataWithDate(response);
            await tracks.save(this.spotifyAPI);
            await tracks.addToProfile(this.profile);
            // Artists
            let artists = await tracks.getArtists(this.spotifyAPI);
            await artists.save(this.spotifyAPI);
            await artists.addToProfile(this.profile);
            // Genres
            let genres = await artists.getGenres();
            await this.profile.addGenres(genres);
            // Recurse
            if (!(response.length < 50)) {
                await this.retrieveSavedTracks(offset + 50);
            } else  {
                this.socket.emit('ProcessMessage', {message: "Finished Liked Tracks", percent: 1});
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    // async processTopCharts() {
    //   try {
    //       // Get Tracks
    //       await this.retrieveTopTracks();
    //       // Get Artists
    //       await this.retrieveTopArtists();
    //   } catch(error) {
    //     console.trace(error);  
    //     throw error;
    //   }
    // }
  
    // async retrieveTopTracks() {
    //     try {
    //         // Different Time Ranges
    //         for (let i = 0; i < 3; i++) {
    //             this.socket.emit('ProcessMessage', {message: "Retrieving Top Tracks", percent: i / 3});
    //             // Request for tracks.
    //             let tracks = await this.getTopTracks(i, 0);
    //             let audioFeatures = await this.retrieveAudioFeatures(tracks);
    //             // Add tracks to user.
    //             this.user.addTopPlayedTracks(await tracks.map(track => track.id), i);
    //             // Run through each track.
    //             for (let j = 0; j < tracks.length; j++) {
    //                 let track = await (new TrackDAO(tracks[j].id, {
    //                     name: tracks[j].name, 
    //                     artists: tracks[j].artists, 
    //                     album: tracks[j].album, 
    //                     popularity: tracks[j].popularity,
    //                     key: audioFeatures[tracks[j].id].key,
    //                     mode: audioFeatures[tracks[j].id].mode,
    //                     tempo: audioFeatures[tracks[j].id].tempo,
    //                     valence: audioFeatures[tracks[j].id].valence,
    //                     danceability: audioFeatures[tracks[j].id].danceability,
    //                     energy: audioFeatures[tracks[j].id].energy,
    //                     acousticness: audioFeatures[tracks[j].id].acousticness,
    //                     instrumentalness: audioFeatures[tracks[j].id].instrumentalness,
    //                     liveness: audioFeatures[tracks[j].id].liveness,
    //                     loudness: audioFeatures[tracks[j].id].loudness,
    //                     speechiness: audioFeatures[tracks[j].id].speechiness,
    //                 }));
    //                 // Save if not in database.
    //                 if (!(await track.inDatabase()))
    //                     track.save(this.spotifyAPI);
    //             }
    //         }
    //     } catch(error) {
    //         console.trace(error);
    //         throw error;
    //     }
    // }
  
    // async retrieveTopArtists() {
    //     try {
    //         // Different Time Ranges
    //         for (let i = 0; i < 3; i++) {
    //             this.socket.emit('ProcessMessage', {message: "Retrieving Top Artists", percent: i / 3});
    //             // Request for artists.
    //             let artists = await this.getTopArtists(i, 0);
    //             // Add artists to user.
    //             this.user.addTopPlayedArtists(await artists.map(artist => artist.id), i);
    //             // Run through each artist.
    //             for (let j = 0; j < artists.length; j++) {
    //                 let artist = await (new ArtistDAO(artists[j].id, {name: artists[j].name, genres: artists[j].genres, images: artists[j].images, popularity: artists[j].popularity}));
    //                 // Save if not in database.
    //                 if (!(await artist.inDatabase()))
    //                     artist.save(this.spotifyAPI);
    //             }
    //         }
    //     } catch(error) {
    //         console.trace(error);
    //         throw error;
    //     }
    // }
  
    // async processUserPlaylists() {
    //     try {
    //         // Start new progress bar.
    //         this.reportTotal = false;
    //         // Start retrieving at playlist 0
    //         await this.retrieveUserPlaylists(0);
    //     } catch(error) {
    //         console.trace(error);
    //         throw error;
    //     }  
    // }
  
    // async retrieveUserPlaylists(offset) {
    //     try {
    //         // Get playlist objects
    //         let playlists = await this.getUserPlaylists(offset);
    //         // For ever playlist
    //         for (let i = 0; i < playlists.length; i++) {
    //             // Create Data Access Object
    //             let playlist = await (new PlaylistDAO(playlists[i].id, {
    //                 name: playlists[i].name, 
    //                 owner: playlists[i].owner, 
    //                 images: playlists[i].images, 
    //                 description: playlists[i].description, 
    //                 public: playlists[i].public
    //             }));
    //             this.user.addPlaylist(playlist._id);
    //             // Save Playlist
    //             await playlist.retrieveAudioFeatures(this.spotifyAPI);
    //             await playlist.save(this.spotifyAPI);
    //             this.socket.emit('ProcessMessage', {message: "Processing Playlists: " + playlists[i].name, percent: (offset + i) / this.total});
    //         }
    //         // Get the next 50
    //         if (!(playlists.length < 50)) 
    //             await this.retrieveUserPlaylists(offset + 50);
    //         else 
    //             this.socket.emit('ProcessMessage', {message: "Finished Processing Playlists", percent: 1});
    //     } catch(error) {
    //         console.trace(error);
    //         throw error;
    //     }
    // }

    // async getTracks(trackIDs) {
    //     try {
    //         let response = await this.spotifyAPI.getTracks(trackIDs);
    //         return response.body.tracks;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     }
    // }

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

    // async getAudioFeaturesForTracks(trackIDs) {
    //     try {
    //         let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
    //         return response.body.audio_features;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     }
    // }

    // async getArtists(artistIDs) {
    //     try {
    //         let response = await this.spotifyAPI.getArtists(artistIDs);
    //         return response.body.artists;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     } 
    // }

    // // CHARTS
    // async getTopArtists(time_range, offset) {
    //     try {
    //         let time_ranges = ["short_term", "medium_term", "long_term"];
    //         let adjusted_time_range = time_ranges[time_range];
    //         let response = await this.spotifyAPI.getMyTopArtists({time_range: adjusted_time_range, limit: 50, offset: offset});
    //         return response.body.items;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     } 
    // }

    // async getTopTracks(time_range, offset) {
    //     try {
    //         let time_ranges = ["short_term", "medium_term", "long_term"];
    //         let adjusted_time_range = time_ranges[time_range];
    //         let response = await this.spotifyAPI.getMyTopTracks({time_range: adjusted_time_range, limit: 50, offset: offset});
    //         return response.body.items;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     }  
    // }

    // async getUserPlaylists(offset) {
    //     try {
    //         let response = await this.spotifyAPI.getUserPlaylists({limit: 50, offset: offset});
    //         if (!this.reportTotal) {
    //             this.total = response.body.total;
    //             this.reportTotal = true;
    //         }
    //         return response.body.items;
    //     } catch (error) {
    //         console.trace(error);
    //         throw error;
    //     }  
    // }
    
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
