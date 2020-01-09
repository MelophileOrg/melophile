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

mongoose.connect('mongodb://localhost:27017/melomaniac4', {
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

let clients = [];

io.on('connection', function(socket) {
  console.log("Clients:", clients.length);
  clients.push(socket.id);

  require('./auth.js')(socket);

  require('./process.js')(socket);

  require('./analysis.js')(socket);

  socket.on('getClientNum', function() {
    socket.emit('ConsoleLog', {message: clients.length});
  });
  
  socket.on('disconnect', function() {
    console.log("Clients:", clients.length);
    clients.splice(clients.indexOf(socket.id), 1);
  });
});


