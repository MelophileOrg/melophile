const mongoose = require('mongoose');
const express = require("express");
const { checkSchema, body } = require('express-validator');
const router = express.Router();

// Track Object
const profileSchema = new mongoose.Schema({
    id: String,
    name: String,
    privacy: Boolean,
    likes: Array,
    trackNum: Number,
    artistNum: Number,
    genreNum: Number,
    valence: Number,
    energy: Number,
    danceability: Number,
    include: Object,
});
const Profile = mongoose.model('Profile', profileSchema);

module.exports = {
    model: Profile,
    routes: router,
}