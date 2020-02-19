const mongoose = require('mongoose');

let PlaylistSchema = require('../schemas/PlaylistSchema.js');

let TrackDAO = require('./TrackDAO.js');

class PlaylistDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.name = ((data && 'name' in data) ? data.name : null);
        this.owner = ((data && 'owner' in data) ? data.owner : null);
        this.image = ((data && 'images' in data && data.images.length) ? data.images[0].url : (data && 'image' in data) ? data.image : "");
        this.description = ((data && 'description' in data) ? data.description : null);
        this.public = ((data && 'public' in data) ? data.public : null);
        this.tracks = ((data && 'tracks' in data) ? data.tracks : null);
    }

    async inDatabase() {
        try {
            return ((await PlaylistSchema.findOne({ _id: this._id })) != null);
        } catch(error) {
            console.log(error);
        }
    }

    async retrieve(spotifyAPI) {
        try {
            if (!this._id) {
                return;
            } else if (this.name && this.owner && this.image && this.description && typeof(this.public) == 'boolean' && this.tracks) {
                return;
            } else if (await this.inDatabase()) {
                let playlist = await PlaylistSchema.findOne({ _id: this._id });
                this.name = playlist.name;
                this.owner = playlist.owner;
                this.image = playlist.image;
                this.description = playlist.description;
                this.public = playlist.public;
                this.tracks = playlist.tracks;
            } else if (spotifyAPI != null) {
                let response = await spotifyAPI.getPlaylist(this._id);
                let playlist = response.body;
                this.name = playlist.name;
                this.owner = playlist.owner;
                this.image = ('images' in playlist && playlist.images.length ? playlist.images[0].url : "");
                this.description = playlist.description;
                this.public = playlist.public;
                this.tracks = await this.retrieveTracks(spotifyAPI);
            }
        } catch(error) {
            console.log(error);
        }
    }

    async save(spotifyAPI) {
        try {
            if (!this._id) return;
            if (!this.name || !this.owner || this.image.length || !this.description || typeof(this.public) != "boolean")
                await this.retrieve(spotifyAPI);
            if (!this.tracks) 
                await this.retrieveTracks(spotifyAPI);
            if (!this.inDatabase()) {
                let playlist = new PlaylistSchema({
                    _id: this._id,
                    name: this.name,
                    owner: this.owner,
                    image: this.image,
                    description: this.description,
                    public: this.public,
                    tracks: this.tracks,
                });
                await playlist.save();
            } else {
                await PlaylistSchema.updateOne({
                    _id: this._id
                }, {
                    $set: {
                        "_id": this._id,
                        "name": this.name,
                        "owner": this.owner,
                        "image": this.image,
                        "description": this.description,
                        "public": this.public,
                        "tracks": this.tracks,
                    }
                });
            }
            return Object.keys(this.tracks);
        } catch(error) {
            console.log(error);
        }
    }

    async retrieveTracks(spotifyAPI) {  
        try {
            this.tracks = {};
            let response = await spotifyAPI.getPlaylistTracks(this._id, {offset: 0});
            let tracks = response.body.items;
            let total = response.body.total;
            for (let i = 0; i < tracks.length; i++) {
                this.addTrack(tracks[i].track.id, tracks[i].added_at);
            }
            for (let i = 100; i < total; i += 100) {
                response = await spotifyAPI.getPlaylistTracks(this._id, {offset: i});
                tracks = response.body.items;
                for (let i = 0; i < tracks.length; i++) {
                    this.addTrack(tracks[i].track.id, tracks[i].added_at);
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
    
    async retrieveAudioFeatures() {
        try {

        } catch(error) {
            console.log(error);
        }
    }

    getID() {
        return this._id;
    }

    getTracks() {
        return this.tracks;
    }

    async addTrack(trackID, dateAdded) {
        this.tracks[trackID] = (await new Date(dateAdded)).getTime();
    }

    async trackDAOs() {
        let tracks = [];
        for (let i = 0; i < this.tracks.length; i++) {
            tracks.push(await new TrackDAO(this.tracks[i]))
        }
        return tracks;
    }
    
    getName() {
        return this.name;
    }

    getOwner() {
        return this.owner;
    }

    getImage() {
        return this.image;
    }

    getDescription() {
        return this.description;
    }

    getPublic() {
        return this.public;
    }
}

module.exports = PlaylistDAO;