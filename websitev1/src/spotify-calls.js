
//import SpotifyWebApi from './spotify-web-api'


module.exports = {
    inicializeSpotifyApi(spotifyApi, access_token) {
        spotifyApi.setAccessToken(access_token);
        inicialized = true;
    },
    
    // clientID 42903eeb2bf943c4bd4903370f7a93f5
    
    
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopArtists(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
            let response = await spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }  
    },
    
    // {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
    async getTopTracks(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Top Played Tracks.', 'color: blue;');
            let response = await spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }  
    },
    
    // {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds}
    async getRecentlyPlayed(spotifyApi, payload) {
        try {
            console.log('%c Retrieving Recently Played Tracks.', 'color: blue;');
            let response = await spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit, after: payload.range});
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {trackId: String}
    async getTrack(spotifyApi, payload) {
        try {
            console.log('%c Requesting Track.', 'color: blue;');
            let response = await spotifyApi.getTrack(payload.trackId);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {artistId: String}
    async getArtist(spotifyApi, payload) {
        try {
            console.log('%c Requesting Artist.', 'color: blue;');
            let response = await spotifyApi.getArtist(payload.artistId);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // Array IDs
    async getAudioFeaturesForTracks(spotifyApi, track_ids) {
        try {
            console.log('%c Requesting Song Data.', 'color: blue;');
            let response = await spotifyApi.getAudioFeaturesForTracks(track_ids);
            console.table(response.audio_features);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    async getAudioAnalysis(spotifyApi, track_id) {
        try {
            console.log('%c Requesting Audio Analysis.', 'color: blue;');
            let response = await spotifyApi.getAudioAnalysisForTrack(track_id);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
    async getRecomendations(spotifyApi, payload) {
        try {
            console.log('%c Requesting Recommendations.', 'color: blue;');
            let response = await spotifyApi.getRecommendations(payload);
            console.table(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // {limit: 1-50, offset: first index}
    async getMaxSavedTracks(spotifyApi, payload) {
        try {
            console.log('%c Requesting Library Data.', 'color: blue;');
            let response = await spotifyApi.getMySavedTracks(payload);
            console.table(response.items);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // None
    async getUser() {
        try {
        console.log('%c Requesting Library Data.', 'color: blue;');
        let response = await spotifyApi.getMe();
        console.table(response);
        return response;
        } catch (error) {
            console.log(error);
        }
    },
    
    // Array IDs
    async searchSpotify(payload) {
        try {
            console.log('%c Searching.', 'color: blue;');
            let response = await spotifyApi.search(payload.query, ['track'], {limit: 25});
            console.table(response.audio_features);
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    

}


