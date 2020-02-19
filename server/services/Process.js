let mongoose = require('mongoose');

let UserDAO = require("../daos/UserDAO.js");
let TrackDAO = require("../daos/TrackDAO.js");
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
            let tracks = await this.getSavedTracks(offset);
            // Emit Progress
            this.socket.emit('ProcessMessage', {message: "Processing Liked Tracks", percent: offset / this.total});

            for (let i = 0; i < tracks.length; i++) {
                // Create new Track item.
                let track = await(new TrackDAO(tracks[i].track.id, {name: tracks[i].track.name, album: tracks[i].track.album, artists: tracks[i].track.artists, popularity: tracks[i].track.popularity}));
                // Check if added to user.
                if (!this.user.containsTrack(track._id)) {
                    this.user.addTrack(track._id, (await new Date(tracks[i].added_at)).getTime());
                }
                let trackArtists;
                // Check if saved.
                if (!track.inDatabase()) {
                    trackArtists = await track.save(this.spotifyAPI);
                } else {
                    trackArtists = await track.artistDAOs();
                }
                // Run through track artists.
                for (let j = 0; j < trackArtists.length; j++) {
                    // Add artist to user.
                    this.user.addArtist(trackArtists[j]._id, [track._id]);
                    // Retrieve artist data.
                    await trackArtists[j].retrieve(this.spotifyAPI);
                    // Run through artist genres.
                    let artistGenres = trackArtists[j].genres;
                    for (let k = 0; k < artistGenres.length; i++) {
                        // Add to user object artist and track.
                        this.user.addGenre(artistGenres[k], [trackArtists[j]._id], 1);
                    }
                    // Save artist if nessisary.
                    if (!trackArtists[j].inDatabase()) {
                        trackArtists[j].save(this.spotifyAPI);
                    }
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
                    if (!track.inDatabase())
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
                    if (!artist.inDatabase())
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
                this.user.addPlaylist(playlist._id)
                // Save Playlist
                let tracks = await playlist.save(this.spotifyAPI);
                for (let j = 0; j < tracks.length; j++) {
                    // Save Tracks.
                    let artists = await tracks[j].save(this.spotifyAPI);
                    for (let k = 0; k < artists.length; k++) {
                        // Save artists.
                        artists[k].save(this.spotifyAPI);
                    }
                }
                // Update Progress
                this.socket.emit('ProcessMessage', {message: "Processing Playlists: " + playlist[i].name, percent: (offset + 1) / this.total});
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
};

module.exports = Process;