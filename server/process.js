const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

let SpotifyWebApi = require('spotify-web-api-node');

let melomaniac_processor = require('./melomaniac-processor.js');
let MelomaniacProcessor = melomaniac_processor.processor;




////////////////////////////////////////////////////////////////////////////////////////////
// LIBRARY ANALYSIS PROCESS ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
    let processor = await new MelomaniacProcessor(req.body.accessToken);
    await processor.start();
    res.send({tracks: await processor.getSavedTracksArray(), artists: await processor.getSavedArtistsArray()});
});

////////////////////////////////////////////////////////////////////////////////////////////
// SPOTIFY API REQUESTS ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// USERS
const getMe = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.getMe();
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const getUser = async (spotifyAPI, userID) => {
    try {
        let response = await spotifyAPI.getUser(userID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const followUser = async (spotifyAPI, userID) => {
    try {
        let response = await spotifyAPI.followUsers([userID]);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const unfollowUser = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.unfollowUsers([userID]);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const checkFollowingUser = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.isFollowingUsers([userID]);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
// TRACKS
const getTrack = async (spotifyAPI, trackID) => {
    try {
        let response = await spotifyAPI.getTrack(trackID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const getTracks = async (spotifyAPI, trackIDs) => {
    try {
        let response = await spotifyAPI.getTracks(trackIDs);
        console.log(response.tracks);
        return response.tracks;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const getSavedTracks = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getMySavedTracks({limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getAudioFeaturesForTrack = async (spotifyAPI, trackID) => {
    try {
        let response = await spotifyAPI.getAudioFeaturesForTrack(trackID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getAudioAnalysisForTrack = async (spotifyAPI, trackID) => {
    try {
        let response = await spotifyAPI.getAudioAnalysisForTrack(trackID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }    
};
const getAudioFeaturesForTracks = async (spotifyAPI, trackIDs) => {
    try {
        let response = await spotifyAPI.getAudioFeaturesForTracks(trackIDs);
        console.log(response.audio_features);
        return response.audio_features;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const addToSavedTracks = async (spotifyAPI, trackIDs) => {
    try {
        let response = await spotifyAPI.addToMySavedTracks(trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const removeSavedTrack = async (spotifyAPI, trackIDs) => {
    try {
        let response = await spotifyAPI.removeFromMySavedTracks(trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }
};
const checkSavedTracks = async (spotifyAPI, trackIDs) => {
    try {
        let response = await spotifyAPI.containsMySavedTracks(trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
// ARTIST
const getArtist = async (spotifyAPI, artistID) => {
    try {
        let response = await spotifyAPI.getArtist(artistID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getArtists = async (spotifyAPI, artistIDs) => {
    try {
        let response = await spotifyAPI.getArtists(artistIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getArtistAlbums = async (spotifyAPI, artistID, offset) => {
    try {
        let response = await spotifyAPI.getArtistAlbums(artistID, {limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getArtistTopTracks = async (spotifyAPI, artistID) => {
    try {
        let response = await spotifyAPI.getArtistTopTracks(artistID);
        console.log(response.tracks);
        return response.tracks;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getArtistsRelatedArtists = async (spotifyAPI, artistID) => {
    try {
        let response = await spotifyAPI.getArtistRelatedArtists(artistID);
        console.log(response.artists);
        return response.artists;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const followArtist = async (spotifyAPI, artistIDs) => {
    try {
        let response = await spotifyAPI.followArtists(artistIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const unfollowArtist = async (spotifyAPI, artistIDs) => {
    try {
        let response = await spotifyAPI.unfollowArtists(artistIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const checkFollowingArtist = async (spotifyAPI, artistIDs) => {
    try {
        let response = await spotifyAPI.isFollowingArtists(artistIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getFollowingArtists = async (spotifyAPI, artistID) => {
    try {
        let response = await spotifyAPI.getFollowedArtists({limit: 50, after: artistID});
        console.log(response.artists);
        return response.artists;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
// ALBUMS
const getAlbum = async (spotifyAPI, albumID) => {
    try {
        let response = await spotifyAPI.getAlbum(albumID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
}; 
const getAlbums = async (spotifyAPI, albumIDs) => {
    try {
        let response = await spotifyAPI.getAlbums(albumIDs);
        console.log(response.albums);
        return response.albums;
    } catch (error) {
        console.log(error);
        return 1;
    }  
}; 
const getAlbumTracks = async (spotifyAPI, albumID, offset) => {
    try {
        let response = await spotifyAPI.getAlbumTracks(albumID, {limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    } 
}; 
const getSavedAlbums = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getMySavedAlbums({limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const addToSavedAlbums = async (spotifyAPI, albumIDs) => {
    try {
        let response = await spotifyAPI.addToMySavedAlbums(albumIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const removedSavedAlbum = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.removeFromMySavedAlbums(albumIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const checkSavedAlbums = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.containsMySavedAlbums(albumIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getNewReleases = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getNewReleases({limit: 50, offset: offset});
        console.log(response.albums);
        return response.albums;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
// CHARTS
const getTopArtists = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getMyTopArtists({limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getTopTracks = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getMyTopTracks({limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getRecentlyPlayed = async (spotifyAPI, offset) => {
    try {
        let response = await spotifyAPI.getMyRecentlyPlayedTracks({limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
// PLAYLIST
const getPlaylist = async (spotifyAPI, playlistID) => {
    try {
        let response = await spotifyAPI.getPlaylist(playlistID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getUserPlaylists = async (spotifyAPI, userID) => {
    try {
        let response = await spotifyAPI.getUserPlaylists(userID, {limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const getPlaylistTracks = async (spotifyAPI, playlistID, offset) => {
    try {
        let response = await spotifyAPI.getPlaylistTracks(playlistID, {limit: 50, offset: offset});
        console.log(response.items);
        return response.items;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const createPlaylist = async (spotifyAPI, userID, name, publicBool, description) => {
    try {
        let response = await spotifyAPI.createPlaylist(userID, {name: name, public: publicBool, description: description});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    }  
};
const addTrackToPlaylist = async (spotifyAPI, playlistID, trackIDs) => {
    try {
        let response = await spotifyAPI.addTracksToPlaylist(playlistID, trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const replaceTracksFromPlaylist = async (spotifyAPI, playlistID, trackIDs) => {
    try {
        let response = await spotifyAPI.replaceTracksInPlaylist(playlistID, trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const removeTracksFromPlaylist = async (spotifyAPI, playlistID, trackIDs) => {
    try {
        let response = await spotifyAPI.removeTracksFromPlaylist(playlistID, trackIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const uploadCustomPlaylistCoverImage = async (spotifyAPI, playlistID, imageData) => {
    try {
        let response = await spotifyAPI.uploadCustomPlaylistCoverImage(playlistID, imageData);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const followPlaylist = async (spotifyAPI, playlistID) => {
    try {
        let response = await spotifyAPI.followPlaylist(playlistID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const unfollowPlaylist = async (spotifyAPI, playlistID) => {
    try {
        let response = await spotifyAPI.unfollowPlaylist(playlistID);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const checkFollowingPlaylist = async (spotifyAPI, playlistID, userIDs) => {
    try {
        let response = await spotifyAPI.areFollowingPlaylist(playlistID, userIDs);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
// MISC 
const search = async (spotifyAPI, query, offset) => {
    try {
        let response = await spotifyAPI.search(query, ['album', 'artist', 'playlist', 'track'], {limit: 50, offset: offset});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getRecommendations = async (spotifyAPI, seed_artists, seed_genres, seed_tracks) => {
    try {
        let options = {
            limit: 50,
            seed_artists: seed_artists,
            seed_genres: seed_genres,
            seed_tracks: seed_tracks, // Max 5 Total
            // max_*
            // min_*
            // target_*
        };
        let response = await spotifyAPI.getRecommendations(options);
        console.log(response.tracks);
        return response.tracks;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getAvailableGenreSeeds = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.getAvailableGenreSeeds(options);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const getMyCurrentPlayingTrack = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.getMyCurrentPlayingTrack();
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const play = async (spotifyAPI, uris) => {
    try {
        let response = await spotifyAPI.play({uris: uris});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const skipToNext = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.skipToNext({uris: uris});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};
const pause = async (spotifyAPI) => {
    try {
        let response = await spotifyAPI.pause();
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return 1;
    } 
};







// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// const dotenv = require('dotenv');
// dotenv.config();

// const discogsKey = process.env.discogsKey;
// const discogsSecret = process.env.discogsSecret;

// router.get("/artist/:id", async (req, res) => { 
//     try {
//         let response = await axios.get('https://api.discogs.com/database/search?q=' + req.params.id + '&type=artist&key=' + discogsKey + '&secret=' + discogsSecret);
//         let artist_id;
//         for (let i = 0; i < response.data.results.length; i++) {
//             if (response.data.results[i].type == 'artist') {
//                 artist_id = response.data.results[i].id;
//                 break;
//             }
//         }
//         let artist = await axios.get('https://api.discogs.com/artists/' + artist_id + '?key=' + discogsKey + '&secret=' + discogsSecret);
//         res.send(artist.data);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(500);
//     }
// });

module.exports = {
    routes: router,
}