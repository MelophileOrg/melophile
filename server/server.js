// Dependencies
var express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const fs = require('fs');
// const https = require('https');

// Server Initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/**
 * Authorization Handler
 * Endpoints for user authorization and login.
 */
const AuthHandler = require("./handlers/AuthHandler.js");
app.use("/api/auth", AuthHandler.routes);

/**
 * Me Handler
 * Endpoints for profile data following a library analysis.
 */
const MeHandler = require("./handlers/MeHandler.js");
app.use("/api/me", MeHandler.routes);

/**
 * Search Handler
 * Endpoints for search and discovery of new tracks.
 */
const SearchHandler = require("./handlers/SearchHandler.js");
app.use("/api/search", SearchHandler.routes);

/**
 * Play Handler
 * Endpoints for playing items on the user's current playback device
 */
const PlayHandler = require("./handlers/PlayHandler.js");
app.use("/api/play", PlayHandler.routes);

/**
 * Track Handler
 * Endpoints for fetching data relevent to a given track.
 */
// const TrackHandler = require("./handlers/TrackHandler.js");
// app.use("/api/track", TrackHandler.routes);

/**
 * Artist Handler
 * Endpoints for fetching data relevent to a given artist.
 */
// const ArtistHandler = require("./handlers/ArtistHandler.js");
// app.use("/api/artist", ArtistHandler.routes);

/**
 * Album Handler
 * Endpoints for fetching data relevent to a given album.
 */
// const AlbumHandler = require("./handlers/AlbumHandler.js");
// app.use("/api/album", AlbumHandler.routes);

/**
 * Playlist Handler
 * Endpoints for fetching data relevent to a given playlist.
 */
// const PlaylistHandler = require("./handlers/PlaylistHandler.js");
// app.use("/api/playlist", PlaylistHandler.routes);

/**
 * Genre Handler
 * Endpoints for fetching data relevent to a given genre.
 */
// const GenreHandler = require("./handlers/GenreHandler.js");
// app.use("/api/genre", GenreHandler.routes);

module.exports = app;