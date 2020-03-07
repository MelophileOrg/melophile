// Dependencies
let express = require('express');
let socket = require('socket.io');
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let querystring = require('querystring');
let request = require('request');
let SpotifyWebApi = require('spotify-web-api-node');

let app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

module.exports = app;