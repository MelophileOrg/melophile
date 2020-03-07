// Dependencies
let mongoose = require('mongoose');
// Database Initialization
mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Start Servers
const process = require('./socket.js');
process.listen(3000, function(){ console.log("Process Endpoints Ready on: 3000");});
const analysis = require('./server.js');
analysis.listen(3001, function(){ console.log("Analysis Endpoints Ready on: 3001");});