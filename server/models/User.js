// Dependencies
const mongoose = require('mongoose');
const auth = require('../services/general/Authorization');
let generateSpotifyWebAPI = require('../services/general/GenerateSpotifyWebAPI.js');

// User Schema
const schema = new mongoose.Schema({
  spotifyID: String,
  username: String,
  images: [],
  tokens: [],
});

// Schema Methods
schema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.spotifyID;
  delete obj.tokens;
  return obj;
}

schema.methods.addToken = function(token) {
  this.tokens.push(token);
}

schema.methods.removeToken = function(token) {
  this.tokens = this.tokens.filter(t => t != token);
}

schema.methods.removeOldTokens = function() {
  this.tokens = auth.removeOldTokens(this.tokens);
}

schema.statics.verify = async function(req, res, next) {
  try {
    req.spotifyAPI = await generateSpotifyWebAPI(req.authToken);
    let response = await req.spotifyAPI.getMe();
    let me = response.body;
    if (me.id != req.userID)
      return res.clearCookie('melophile-token').status(204).send("Invalid User Account");
    const user = await User.findOne({
      spotifyID: req.userID
    });
    if (!user || !user.tokens.includes(req.token))
      return res.clearCookie('melophile-token').status(204).send("Invalid User Account");
    req.user = user;
    next();
  } catch(e) {
    return res.clearCookie('melophile-token').status(500).send("Internal Server Error");
  }
}

// User Object
const User = mongoose.model('User', schema);

// Export
module.exports = User;