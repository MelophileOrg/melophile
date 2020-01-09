const mongoose = require('mongoose');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const Playlist = Items.playlist;
const User = Items.user;

mongoose.connect('mongodb://localhost:27017/melomaniac4', {
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
    } catch(error) {
        console.log(error);
    }
}

deleteAll();
