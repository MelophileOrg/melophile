// Server Dependencies
const express = require("express");
const router = express.Router();

// Spotify Web API Wrapper
let SpotifyWebApi = require('spotify-web-api-node');
// Model's Data Access Objects (DAO)
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let AlbumDAO = require("../daos/AlbumDAO.js");
let UserDAO = require("../daos/UserDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * My Numerical Stats
 * Returns number of items in library
 * 
 * @param token Spotify Authorization token.
 * @returns Object with track_num, artist_num, genre_num and playlist_num
 */
router.put("/stats", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        console.log(await user.getTracks());
        return res.send({
            track_num: (await Object.keys(await user.getTracks())).length,
            artist_num: (await Object.keys(await user.getArtists())).length,
            genre_num: (await Object.keys(await user.getGenres())).length,
            playlist_num: (await user.getPlaylists()).length,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Audio Features
 * Returns audio feature data for user. 
 * 
 * @param token Spotify Authorization token.
 * @returns Object with each audio feature with distributions, averages and history.
 */
router.put("/features/all", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        return res.send(await user.getAudioFeatures());
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Added Timeline
 * Returns timeline of tracks added per month
 * 
 * @param token Spotify Authorization token.
 * @returns Array with value of tracks added. Index is months back.
 */
router.put("/history/added", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        return res.send((await user.getHistory()).added);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Top Played Tracks
 * Returns top played tracks in a given time range.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of track data objects.
 */
router.put("/chart/played/tracks/:time_range", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let tracks;
        let audioFeatures = null;
        if (!(await user.inDatabase()) || (await user.getTopPlayed()).tracks[0] == null) {
            let time_ranges = ['short_term', 'medium_term', 'long_term'];
            let response = await spotifyAPI.getMyTopTracks({limit: 50, time_range: time_ranges[parseInt(req.params.time_range, 10)]})
            tracks = response.body.items;
            console.log(tracks);
            response = await spotifyAPI.getAudioFeaturesForTracks(await tracks.map(track => track.id));
            audioFeatures = {};
            await response.body.audio_features.forEach(track => {
                audioFeatures[track.id] = track;
            });
            console.log(audioFeatures);
            return res.send(await tracks.map(async (track) => {
                return await (await new TrackDAO(track.id, {
                    name: track.name,
                    artists: track.artists,
                    album: track.album,
                    popularity: track.popularity,
                    key: audioFeatures[track.id].key,
                    mode: audioFeatures[track.id].mode,
                    tempo: audioFeatures[track.id].tempo,
                    valence: audioFeatures[track.id].valence,
                    danceability: audioFeatures[track.id].danceability,
                    energy: audioFeatures[track.id].energy,
                    acousticness: audioFeatures[track.id].acousticness,
                    instrumentalness: audioFeatures[track.id].instrumentalness,
                    liveness: audioFeatures[track.id].liveness,
                    speechiness: audioFeatures[track.id].speechiness,
                    loudness: audioFeatures[track.id].loudness,
                })).getData(spotifyAPI);
            }));
        } else {
            tracks = await (await user.getTopPlayed()).tracks[parseInt(req.params.time_range, 10)];
            let convertedTracks = [];
            for (let i = 0; i < tracks.length; i++) {
                let newTrack = await new TrackDAO(tracks[i]);
                convertedTracks.push(await newTrack.getData(spotifyAPI));
            }
            console.log(convertedTracks)
            return res.send(convertedTracks);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Top Arists
 * Returns top played artists in a given time range.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of artist data objects.
 */
router.put("/chart/played/artists/:time_range", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let artists;
        if (!(await user.inDatabase()) || (await user.getTopPlayed()).artists[0] == null) {
            let time_ranges = ['short_term', 'medium_term', 'long_term'];
            let response = await spotifyAPI.getMyTopArtists({limit: 50, time_range: time_ranges[parseInt(req.params.time_range, 10)]})
            artists = response.body.items;
            return res.send(await artists.map(async (artist) => {
                return await (await new ArtistDAO(artist.id, {
                    name: artist.name,
                    images: artist.artists,
                    genres: artist.album,
                    popularity: artist.popularity,
                })).getData(spotifyAPI);
            }));
        } else {
            artists = await (await user.getTopPlayed()).artists[parseInt(req.params.time_range, 10)];
            return res.send(await artists.map(async (artist) => {
                return await (await new ArtistDAO(artist.id)).getData(spotifyAPI);
            }));
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Top Saved Arists
 * Returns top saved artists.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of artist data objects.
 */
router.put("/chart/saved/artists", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        return res.send(await (await user.getTopSaved()).artists.map(async (artist) => {
            let newArtist = await (await new ArtistDAO(artist)).getData(spotifyAPI);
            newArtist.track_num = await user.getArtist(artist._id).length;
            return newArtist;
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Top Saved Genres
 * Returns top saved genres.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of genres data objects.
 */
router.put("/chart/saved/genres", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        let genres = await user.getGenres();
        return res.send(await (await user.getTopSaved()).genres.map(async (genre) => {
            return await user.getGenre(genre);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Extremes
 * Returns top or bottom tracks for a given feature.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of track data objects.
 */
router.put("/chart/extreme/:feature/:sort", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (req.params.sort == "min") {
            return res.send(await (await Object.entries(await user.getTracks())).sort(async (a, b) => { 
                let aTrack = await new TrackDAO(a[0]);
                let bTrack = await new TrackDAO(b[0]);
                let aData = await aTrack.getData(spotifyAPI);
                let bData = await bTrack.getData(spotifyAPI);
                let aValue = aData[req.params.feature];
                let bValue = bData[req.params.feature];
                return aValue - bValue;
            }).splice(0, 50));
        } else {
            return res.send(await (await Object.entries(await user.getTracks())).sort(async (a, b) => { 
                let aTrack = await new TrackDAO(a[0]);
                let bTrack = await new TrackDAO(b[0]);
                let aData = await aTrack.getData(spotifyAPI);
                let bData = await bTrack.getData(spotifyAPI);
                let aValue = aData[req.params.feature];
                let bValue = bData[req.params.feature];
                return bValue - aValue;
            }).splice(0, 50));
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * My Extremes
 * Returns top or bottom tracks for a given feature.
 * 
 * @param token Spotify Authorization token.
 * @returns Array of track data objects.
 */
router.put("/spotlight", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        return res.send({
            tracks: await (await user.getTopPlayed()).tracks[2].filter((val, index) => { return (index < 5); }),
            artists: await (await user.getTopPlayed()).artists[2].filter((val, index) => { return (index < 5); }),
            genres: await (await user.getTopSaved()).genres.filter((val, index) => { return (index < 5); }),
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/////////////////////////////////////////////////////
// Helper Functions /////////////////////////////////
/////////////////////////////////////////////////////
/**
 * Generate Spotify API Wrapper
 * Creates and returns an instance of Spotify API wrapper with token
 * 
 * @param token Spotify Authorization token.
 * @returns Spotify Web API Wrapper Object
 */
let generateSpotifyWebAPI = async (token) => {
    if (token == null) return null;
    let spotifyAPI = new SpotifyWebApi();
    await spotifyAPI.setAccessToken(token);
    return spotifyAPI;
}
/**
 * Generate User DAO Object for Given User
 * Uses Spotify API to confirm user identity and
 * retrieve User DAO Object.
 * 
 * @param spotifyAPI Spotify Web API Wrapper Object
 * @returns User DAO
 */
let requestUser = async (spotifyAPI) => {
    let response = await spotifyAPI.getMe();
    let user = await new UserDAO(response.body.id);
    await user.retrieve(spotifyAPI);
    return user;
}

// Exporting to Server
module.exports = {
    routes: router,
}