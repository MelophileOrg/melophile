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

// Endpoint Handlers
const AuthHandler = require("./handlers/AuthHandler.js");
app.use("/api/auth", AuthHandler.routes);

const UserHandler = require("./handlers/UserHandler.js");
app.use("/api/user", UserHandler.routes);

const SearchHandler = require("./handlers/SearchHandler.js");
app.use("/api/search", SearchHandler.routes);

const TrackHandler = require("./handlers/TrackHandler.js");
app.use("/api/track", TrackHandler.routes);

const ArtistHandler = require("./handlers/ArtistHandler.js");
app.use("/api/artist", ArtistHandler.routes);

const AlbumHandler = require("./handlers/AlbumHandler.js");
app.use("/api/album", AlbumHandler.routes);

const PlaylistHandler = require("./handlers/PlaylistHandler.js");
app.use("/api/playlist", PlaylistHandler.routes);

const GenreHandler = require("./handlers/GenreHandler.js");
app.use("/api/genre", GenreHandler.routes);

module.exports = app;