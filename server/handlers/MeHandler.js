const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

// Spotify Web API
let SpotifyWebApi = require('spotify-web-api-node');
// Object DAOs
let TrackDAO = require("../daos/TrackDAO.js");
let ArtistDAO = require("../daos/ArtistDAO.js");
let PlaylistDAO = require("../daos/PlaylistDAO.js");
let UserDAO = require("../daos/UserDAO.js");

// Helper Function
// Instance of Spotify Web API
let generateSpotifyWebAPI = async (token) => {
    if (token == null) return null;
    let spotifyAPI = new SpotifyWebApi();
    await spotifyAPI.setAccessToken(token);
    return spotifyAPI;
}

// Verifying user
let requestUser = async (spotifyAPI) => {
    let response = await spotifyAPI.getMe();
    return await new UserDAO(response.body.id);
}

router.put("/stats", async (req, res) => {
    try {
        let spotifyAPI = await generateSpotifyWebAPI(req.body.token);
        let user = await requestUser(spotifyAPI);
        if (!(await user.inDatabase())) return res.sendStatus(401);
        return res.send({
            track_num: Object.keys(await user.getTracks()).length,
            artist_num: Object.keys(await user.getArtists()).length,
            genre_num: Object.keys(await user.getGenres()).length,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

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

// router.put("/api/average/:feature", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/distribution/:feature", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// ///////////////////////////////////////////////////////////////////////////////////////
// // History ////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

// router.put("/api/timeline/:feature", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/timeline/added", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/history/:year", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/history/:year/:month", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/timeline/:feature", async (req, res) => {
// try {
//     console.log("Hello");
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// ///////////////////////////////////////////////////////////////////////////////////////
// // Charts /////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

// // { token: STRING, }
// router.put("/api/top/saved/:type", async (req, res) => {
// try {
//     let user = await requestUser(req.body.token);
//     let userData = await UserSchema.findOne({ _id: user.id });
//     if (userData == null) return res.send(null);
//     let items;
//     switch(req.params.type) {
//     case 'artists':
//         let convertedItems = [];
//         items = await ArtistSchema.find({ _id: {$in: userData.topSaved.artists.map(artist => artist._id)}});
//         for (let i = 0; i < items.length; i++)  {
//         let newItem = {};
//         newItem.image = items[i].image;
//         newItem._id = items[i]._id;
//         newItem.name = items[i].name;
//         newItem.genres = items[i].genres;
//         newItem.track_num = await userData.topSaved.artists.find(artist => artist._id == items[i]._id).track_num;
//         convertedItems.push(newItem);
//         }
//         return res.send(await convertedItems.sort((a, b) => b.track_num - a.track_num));
//     case 'genres':
//         let genres = [];
//         for (let i = 0; i < userData.topSaved.genres.length; i++) {
//         genres.push(await convertGenre(userData.topSaved.genres[i]));
//         }
//         return res.send(genres);
//     default:
//         return res.send(null);
//     }
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/extreme/:feature/:sort", async (req, res) => {
// try {
//     let user = await requestUser(req.body.token);
//     let userData = await UserSchema.findOne({ _id: user.id });
//     if (userData == null) return res.send(null);
//     let sort = {};
//     let sortTypes = [-1, 1];
//     sort[req.params.feature] = sortTypes[parseInt(req.params.sort, 10)];
//     let items = await TrackSchema.find({
//     _id: { $in : await Object.keys(userData.tracks)}
//     }).sort(sort).limit(50);
//     return res.send(items);
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// let convertGenre = async (genre) => {
// let randomArtists = await ArtistSchema.find({ genres: genre[0] }).limit(4);
// let newGenre = {name: genre[0], track_num: genre[1].track_num, image: randomArtists.map(artist => artist.image)};
// return newGenre;
// }


// ///////////////////////////////////////////////////////////////////////////////////////
// // Libary /////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////

// // { ids: [] }
// router.put("/api/tracks", async (req, res) => {
// try {
//     console.log(req.body);
//     let tracks = {};
//     for (let i = 0; i < req.body.ids.length; i++) 
//     tracks[req.body.ids[i]] = await TrackSchema.findOne({ _id: req.body.ids[i] });
//     return res.send({ tracks: tracks });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/tracks/:id", async (req, res) => {
// try {
//     let track = await TrackSchema.findOne({ _id: req.params.id });
//     return res.send({ track: track });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// // { ids: [] }
// router.put("/api/artists", async (req, res) => {
// try {
//     let artists = {};
//     for (let i = 0; i < req.body.ids.length; i++) 
//     artists[req.body.ids[i]] = await ArtistSchema.findOne({ _id: req.body.ids[i] });
//     return res.send({ artists: artists });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/artists/:id", async (req, res) => {
// try {
//     let artist = await ArtistSchema.findOne({ _id: req.params.id });
//     return res.send({ artist: artist });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// // { ids: [] }
// router.put("/api/playlists", async (req, res) => {
// try {
//     let playlists = {};
//     for (let i = 0; i < req.body.ids.length; i++) 
//     playlists[req.body.ids[i]] = await PlaylistSchema.findOne({ _id: req.body.ids[i] });
//     return res.send({ playlists: playlists });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });

// router.put("/api/playlists/:id", async (req, res) => {
// try {
//     let playlist = await PlaylistSchema.findOne({ _id: req.params.id });
//     return res.send({ playlist: playlist });
// } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
// }
// });
  
  
module.exports = {
    routes: router,
}