// Dependencies
const express = require("express");
const auth = require('../services/general/Authorization.js');
const router = express.Router();

// Models
let User = require('../models/User.js');

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

module.exports = {
    routes: router,
}