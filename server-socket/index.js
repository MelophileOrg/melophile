var express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

var socket = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melomaniac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

var server = app.listen(3002, function(){
    console.log("Listening on 3002");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var io = socket(server);

let test = require("./test.js")(io);

let auth = require("./auth.js")(io);


// const auth = require("./auth.js");
// const auth_route = io.of('/auth').on('connection', auth.connect(socket));

// const process = require("./process.js");
// const process_route = io.of('/process').on('connection', process.connect(socket));

// const analysis = require("./analysis.js");
// const analysis_route = io.of('/analysis').on('connection', analysis.connect(socket));

