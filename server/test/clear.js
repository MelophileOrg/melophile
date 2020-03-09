const mongoose = require('mongoose');
const Track = require('../models/Track.js');
const Artist = require('../models/Artist.js');
const Playlist = require('../models/Playlist.js');
const User = require('../models/User.js');

mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


let deleteTracks = async() => {
    try {
        await Track.deleteMany({});
    } catch(error) {
        console.log(error);
    }
}

let deleteArtists = async() => {
    try {
        await Artist.deleteMany({});
    } catch(error) {
        console.log(error);
    }
}

let deletePlaylist = async() => {
    try {
        await Playlist.deleteMany({});
    } catch(error) {
        console.log(error);
    }
}

let deleteUser = async() => {
    try {
        await User.deleteMany({});
    } catch(error) {
        console.log(error);
    }
}

let deleteAll = async() => {
    try {
        console.log("Deleting All Documents...");
        await deleteTracks();
        await deleteArtists()
        await deletePlaylist();
        await deleteUser();
        console.log("All Documents Deleted");
        return;
    } catch(error) {
        console.log(error);
    }
}

deleteAll();
