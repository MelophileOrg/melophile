// Dependencies
let express = require('express');
let socket = require('socket.io');
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let process = require("./services/process/Process.js");
// const fs = require('fs');
// const https = require('https');

// Server Initialization
let app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Start Server
let server = app.listen(3000, function(){ console.log("Process Endpoints Ready on: 3000");});

// Web-Socket Initialization
let io = socket(server);
let activeClients = 0;

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Socket : On Connection
 * Run when a socket makes a connection with the server.
 * 
 * @param {socket} socket Instance of socket.io socket connection
 */
io.on('connection', function(socket) {
    activeClients += 1;

    /**
     * Socket : Process
     * Begins the library process for a given user.
     * 
     * @param {object} data Contains authorization token for Spotify User.
     */
    socket.on('process', async function(data) {
        await process(socket, data.authToken);
    });

    /**
     * Socket : Disconnect
     * Upon a user's disconnection from the service.
     */
    socket.on('disconnect', function() {
        activeClients -= 1;
    });
});

// Export
module.exports = server;