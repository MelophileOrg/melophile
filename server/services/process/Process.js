// Dependencies
let generateSpotifyWebAPI = require('../general/GenerateSpotifyWebAPI.js');

// Models
let User = require('../../models/User.js');

// Data Access Objects
let ProfileDAO = require('../../daos/ProfileDAO.js');
let TracksDAO = require('../../daos/TracksDAO.js');
let ArtistsDAO = require('../../daos/ArtistsDAO.js');
let PlaylistDAO = require('../../daos/PlaylistDAO.js');

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
            await this.profile.averageFeatures();
            await this.processTopCharts();
            await this.processUserPlaylists();
            await this.profile.processTopSaved();
            await this.profile.save(this.spotifyAPI);
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
            this.socket.emit('ProcessMessage', {message: "Retrieving Your Liked Tracks: " + Math.round(offset / this.total * 100) + "%", percent: offset / this.total});
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
                this.socket.emit('ProcessMessage', {message: "Finished Processing Liked Tracks", percent: 1});
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    /**
     * Retrieve Top Charts
     * Retrieves user's top played tracks and artists.
    */
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
  
    /**
     * Retrieve Top Tracks
     * Retrieves user's top played tracks by time range.
    */
    async retrieveTopTracks() {
        try {
            for (let timeRange = 0; timeRange < 3; timeRange++) {
                this.socket.emit('ProcessMessage', {message: "Retrieving Your Top Played Tracks", percent: timeRange / 3});
                let tracks = new TracksDAO();
                await tracks.loadBaseDataObjects(await this.getTopTracks(timeRange, 0));
                await tracks.save(this.spotifyAPI);
                await this.profile.addTopPlayed('tracks', tracks, timeRange);
                this.socket.emit('ProcessMessage', {message: "Finished Processing Your Top Tracks", percent: 1});
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    /**
     * Retrieve Top Artists
     * Retrieves user's top played artists by time range.
    */
    async retrieveTopArtists() {
        try {
            for (let timeRange = 0; timeRange < 3; timeRange++) {
                this.socket.emit('ProcessMessage', {message: "Retrieving Your Top Played Artists", percent: timeRange / 3});
                let artists = new ArtistsDAO();
                await artists.loadBaseDataObjects(await this.getTopArtists(timeRange, 0));
                await artists.save(this.spotifyAPI);
                this.profile.addTopPlayed('artists', artists, timeRange);
                this.socket.emit('ProcessMessage', {message: "Finished Processing Your Top Artists", percent: 1});
            }
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }
  
    /**
     * Process User Playlists
     * Begins process of saving user's playlists to their profile.
    */
    async processUserPlaylists() {
        try {
            this.reportTotal = false;
            await this.retrieveUserPlaylists(0);
        } catch(error) {
            console.trace(error);
            throw error;
        }  
    }

    /**
     * Retrieve User Playlists
     * Retrieves user's playlists at offset and saves data. Retrieves 50 playlists at a time.
     * 
     * @param {number} offset Playlist to begin with.
    */
    async retrieveUserPlaylists(offset) {
        try {
            let playlists = await this.getUserPlaylists(offset);
            playlists = await playlists.map((playlist) => {
                return new PlaylistDAO(playlist.id, playlist);
            });
            for (let i = 0; i < playlists.length; i++) {
                let name = playlists[i].name;
                if (playlists[i].name.length > 18) name = playlists[i].name.substring(0, 15) + '...';
                this.socket.emit('ProcessMessage', {message: "Retrieving Your Playlists: " + name, percent: (offset + i) / this.total});
                await playlists[i].save(this.spotifyAPI);
                await this.profile.addPlaylist(playlists[i]._id);
            }
            if (!(playlists.length < 50)) 
                await this.retrieveUserPlaylists(offset + 50);
            else 
                this.socket.emit('ProcessMessage', {message: "Finished Processing Library", percent: 1});
        } catch(error) {
            console.trace(error);
            throw error;
        }
    }


    /**
     * Get Saved Tracks
     * Retrieves saved tracks from Spotify API based on offset.
    */
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

    /**
     * Get Top Tracks
     * Retrieves top played tracks based on time range and offset from Spotify API.
    */
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

    /**
     * Get Top Artists
     * Retrieves top played artists based on time range and offset from Spotify API.
    */
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

    /**
     * Get User Playlists
     * Retrieves user playlists by offset.
    */
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

/**
 * Process
 * Creates instance of Processor and starts the service.
 * 
 * @param {socket} socket socket.io instance of a socket connection
 * @param {string} authToken Spotify API authorization token for requests.
*/
let process = async function(socket, authToken) {
    try {
        let processor = await new Processor(socket, authToken);
        await processor.start();
    } catch(error) {
        throw error;
    }
};

// Export
module.exports = process;
