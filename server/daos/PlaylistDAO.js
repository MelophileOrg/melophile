const mongoose = require('mongoose');

let PlaylistSchema = require('../schemas/PlaylistSchema.js');
let TrackSchema = require('../schemas/TrackSchema.js');

class PlaylistDAO {
    constructor(id) {
        this._id = id;
    }

    getID() {
        return this._id;
    }

    retrieve() {
        
    }

    save() {
        
    }
}