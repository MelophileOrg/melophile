// Dependencies
let express = require('express');
let socket = require('socket.io');
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let process = require("./services/process/Process.js");

// Server Initialization
let app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Start Server
let server = app.listen(3000, function(){ console.log("Process Endpoints Ready on: 3000");});

// Socket Server
let io = socket(server);
let clients = [];

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

io.on('connection', function(socket) {
    clients.push(socket.id);
    console.log(socket);

    socket.on('process', async function(data) {
        await process(socket, data.authToken);
    });

    socket.on('disconnect', function() {
        clients.splice(clients.indexOf(socket.id), 1);
    });
});

// Export
module.exports = server;