//server-spotify-3002
const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

co

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const profile = require("./profile.js");
app.use("/api/profile", profile.routes);

const tracks = require("./tracks.js");
app.use("/api/tracks", tracks.routes);

const artists = require("./artists.js");
app.use("/api/artists", artists.routes);

const genres = require("./genres.js");
app.use("/api/genres", genres.routes);

const collections = require("./collections.js");
app.use("/api/collections", collections.routes);

const discogs = require("./discogs.js");
app.use("/api/discogs", discogs.routes);

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(3002, () => console.log('Example app listening on port 3002! Go to https://localhost:3002/'));