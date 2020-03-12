// Dependencies
const mongoose = require('mongoose');
const auth = require('../services/general/Authorization');

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
  const user = await User.findOne({
    _id: req.userID
  });
  if (!user || !user.tokens.includes(req.token))
    return res.clearCookie('melophile-token').status(403).send({
      error: "Invalid user account."
    });
  req.user = user;
  next();
}

// User Object
const User = mongoose.model('User', schema);

// Export
module.exports = User;