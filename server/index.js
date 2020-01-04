//server-spotify-3002
const express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

var cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melomaniac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

let SpotifyWebApi = require('spotify-web-api-js');
let spotifyApi = new SpotifyWebApi();

const auth = require("./auth.js");
app.use("/api/auth", auth.routes);

const process = require("./process.js");
app.use("/api/process", process.routes);


app.listen(3002, () => console.log('Server listening on port 3002!'));
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));