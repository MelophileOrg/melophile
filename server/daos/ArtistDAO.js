const mongoose = require('mongoose');

let ArtistSchema = require('../schemas/ArtistSchema');

let GenreDAO = require('./GenreDAO.js');

class ArtistDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.name = ((data && 'name' in data) ? data.name : null);
        this.image = ((data && 'image' in data) ? data.image : (data && 'images' in data && images.length) ? data.images[0].url : "");
        this.genres = ((data && 'genres' in data) ? data.genres : null);
        this.popularity = ((data && 'popularity' in data) ? data.popularity : null);
    }

    async inDatabase() {
        try {
            return (await ArtistSchema.findOne({ _id: this._id })) != null;
        } catch(error) {
            console.log(error);
        }
    }

    async retrieve(spotifyAPI) {
        try {
            if (!this._id) {
                return;
            } else if (this.name && this.image.length && this.genres && this.popularity) {
                return;
            } else if (await this.inDatabase()) {
                let artist = await ArtistSchema.findOne({ _id: this._id });
                this._id = artist._id;
                this.name = artist.name;
                this.image = artist.image;
                this.genres = artist.genres;
                this.popularity = artist.popularity;
            } else if (spotifyAPI != null) {
                let response = await spotifyAPI.getArtist(this._id);
                await this.convertArtist(response.body);
            } 
        } catch(error) {
            console.log(error);
        }
    }

    async save(spotifyAPI) {
        try {
            if (!this._id) {
                return;
            } else if (!this.name || !this.image.length || !this.genres || !this.popularity) {
                await this.retrieve(spotifyAPI);
            }
            let artist = new ArtistSchema({
                _id: this._id,
                name: this.name,
                image: this.image,
                genres: this.genres,
                popularity: this.popularity,
            });
            await artist.save();
        } catch(error) {
            console.log(error);
        }
    }
    
    convertArtist(artist) {
        this._id = artist.id;
        this.name = artist.name;
        this.image = (artist.images.length ? artist.images[0].url : "");
        this.genres = artist.genres;
        this.popularity = artist.popularity;
    }

    get _id() {
        return this._id;
    }

    set _id(id) {
        this._id = id;
        this.name = null;
        this.image = null;
        this.genres = null;
        this.popularity = null;
    }

    get name() {
        return this.name;
    }

    get genres() {
        return this.genres;
    }

    genreDAOs() {
        let genres = [];
        for (let i = 0; i < this.genres.length; i++) {
            genres.push(new GenreDAO(this.genres[i]));
        }
        return genres;
    }

    get image() {
        return this.image;
    }

    get popularity() {
        return this.popularity;
    }
}

module.exports = ArtistDAO;