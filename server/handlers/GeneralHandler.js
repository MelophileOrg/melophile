// Dependencies
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

// Spotify Web API
let SpotifyWebApi = require('spotify-web-api-node');
// Object DAOs
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let AlbumDAO = require("../daos/AlbumDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let UserDAO = require("../daos/UserDAO.js");

/**
 * Search
 * Searches spotify for a given type of item.
 * 
 * @param query ID of Artist desired
 * @param offset ID of Artist desired
 * @param type ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Object with item properties
 */
router.put("/search", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let items;
        switch(req.body.type) {
            case 0: 
                items = (await spotifyAPI.searchTracks(req.body.query, {limit: 50, offset: req.body.offset})).tracks.items;
                items = items.map(async (item) => {
                    return await (await new TrackDAO(item.id, {
                        name: item.name,
                        album: item.album,
                        artists: item.artists, 
                        popularity: item.popularity,
                    }).getBaseData(spotifyAPI));
                });
                break;
            case 1:
                items = (await spotifyAPI.searchArtists(req.body.query, {limit: 50, offset: req.body.offset})).artists.items;
                items = items.map(async (item) => {
                    return await (await new ArtistDAO(item.id, {
                        name: item.name,
                        images: item.images,
                        genres: item.genres, 
                        popularity: item.popularity,
                    }).getData(spotifyAPI));
                });
                break;
            case 2:
                items = (await spotifyAPI.searchAlbums(req.body.query, {limit: 50, offset: req.body.offset})).albums.items;
                items = items.map(async (item) => {
                    return await (await new AlbumDAO(item.id, {
                        name: item.name,
                        images: item.images,
                        artists: item.artists, 
                        genres: item.genres,
                    }).getData(spotifyAPI));
                });
                break;
            case 3:
                items = (await spotifyAPI.searchPlaylists(req.body.query, {limit: 50, offset: req.body.offset})).playlists.items;
                items = items.map(async (item) => {
                    return await (await new AlbumDAO(item.id, {
                        name: item.name,
                        images: item.images, 
                        public: item.public,
                    }).getData(spotifyAPI));
                });
                break;
        }
        return res.send(items);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

/**
 * Recommends
 * Searches for recommends based on other items
 * 
 * @param options.seed_tracks ID of Artist desired
 * @param options.seed_artists ID of Artist desired
 * @param options.type ID of Artist desired
 * @param token Spotify Authorization token.
 * @return Object with item properties
 */
router.put("/recommends", async (req, res) => {
    try {
        let authorizedAxios = await generateAuthorizedAxios(req.body.token);
        let keys = Object.keys(req.body.options);
        let optionStrings = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == 'seed_tracks') {
                let seed_tracks = "seed_tracks=";
                for (let i = 0; i < req.body.options.seed_tracks.length; i++) {
                    seed_tracks += req.body.options.seed_tracks[i];
                    if (i < req.body.options.seed_tracks.length - 1) {
                        seed_tracks += "%2C%20";
                    }
                }
                optionStrings.push(seed_tracks);
            } else if (keys[i] == 'seed_artists') {
                let seed_artists = "seed_artists=";
                for (let i = 0; i < req.body.options.seed_artists.length; i++) {
                    seed_artists += req.body.options.seed_artists[i];
                    if (i < req.body.options.seed_artists.length - 1) {
                        seed_artists += "%2C%20";
                    }
                }
                optionStrings.push(seed_artists);
            } else {
                optionStrings.push(keys[i] + "=" + req.body.options[keys[i]]);
            }
        }
        let parameters = "";
        for (let i = 0; i < optionStrings.length; i++) {
            parameters += optionStrings[i];
            if (i < optionStrings.length - 1) {
                parameters += '&';
            }
        }
        let response = await authorizedAxios.get('https://api.spotify.com/v1/recommendations?' + parameters);
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        return res.send(await response.data.tracks.map(async (track) => {
            return await (await new TrackDAO(track.id, {
                artists: artists,
                name: name,
            })).getBaseData(spotifyAPI);
        }));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * Play Track
 * Plays a track on users current playback object.
 * 
 * @param id ID of Track desired
 * @param token Spotify Authorization token.
 */
router.put("/play/track", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        spotifyAPI.play({uris: ["spotify:track:" + req.body.id]});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * Play Tracks
 * Plays tracks on users current playback object.
 * 
 * @param ids ID of Tracks desired
 * @param token Spotify Authorization token.
 */
router.put("/play/tracks", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        this.spotifyAPI.play({uris: await req.body.ids.map(async (id) => {
            return "spotify:track:" + id;
        })});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * Play Artist
 * Plays an artist on users current playback object.
 * 
 * @param id ID of Artist desired
 * @param token Spotify Authorization token.
 */
router.put("/play/artist", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        spotifyAPI.play({context_uri: "spotify:artist:" + req.body.id});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * Play Album
 * Plays an album on users current playback object.
 * 
 * @param id ID of Album desired
 * @param token Spotify Authorization token.
 */
router.put("/play/album", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        spotifyAPI.play({context_uri: "spotify:album:" + req.body.id});
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
/**
 * Play Playlist
 * Plays an playlist on users current playback object.
 * 
 * @param id ID of Playlist desired
 * @param token Spotify Authorization token.
 */
router.put("/play/playlist", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        spotifyAPI.play({context_uri: "spotify:playlist:" + req.body.id});
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
 * Generate Authorized Axios
 * Creates an instanced of axios with authentication
 * 
 * @param token Spotify Authorization token.
 * @returns Axios Instance
 */
let generateAuthorizedAxios = async (token) => {
    return await axios.create({
        headers: {'Authorization': 'Bearer ' + token}
    });
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


module.exports = {
    routes: router,
}