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
const GeneralHandler = require("./handlers/GeneralHandler.js");
app.use("/api/general", GeneralHandler.routes);

const MeHandler = require("./handlers/MeHandler.js");
app.use("/api/me", MeHandler.routes);

const UserHandler = require("./handlers/UserHandler.js");
app.use("/api/user", UserHandler.routes);

// Starting Server
var server = app.listen(3003, function(){
    console.log("Listening on 3003");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));






