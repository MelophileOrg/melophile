// Dependencies
var express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const fs = require('fs');
// const https = require('https');

// Server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Endpoint Handlers
// General Data
const GeneralHandler = require("./handlers/GeneralHandler.js");
app.use("/api/general", GeneralHandler.routes);

// Your User Data
const MeHandler = require("./handlers/MeHandler.js");
app.use("/api/me", MeHandler.routes);

// Other Users
const UserHandler = require("./handlers/UserHandler.js");
app.use("/api/user", UserHandler.routes);

const TrackHandler = require("./handlers/TrackHandler.js");
app.use("/api/track", TrackHandler.routes);

const ArtistHandler = require("./handlers/ArtistHandler.js");
app.use("/api/artist", ArtistHandler.routes);

const PlaylistHandler = require("./handlers/PlaylistHandler.js");
app.use("/api/playlist", PlaylistHandler.routes);

const AlbumHandler = require("./handlers/AlbumHandler.js");
app.use("/api/album", AlbumHandler.routes);

const GenreHandler = require("./handlers/GenreHandler.js");
app.use("/api/genre", GenreHandler.routes);

// Starting Server
var server = app.listen(3003, function(){
    console.log("Listening on 3003");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));






