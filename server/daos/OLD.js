// Dependencies
const mongoose = require('mongoose');

// Models
let Artist = require('../models/Artist.js');

// Associated DAOs
let TrackDAO = require('./TrackDAO.js');
let AlbumDAO = require('./AlbumDAO.js');
let GenreDAO = require('./GenreDAO.js');

// Artist DAO
class ArtistDAO {
    constructor(id, data) {
        this._id = (id ? id : null);
        this.name = ((data && 'name' in data) ? data.name : null);
        this.image = ((data && 'image' in data) ? data.image : (data && 'images' in data && data.images.length) ? data.images[0].url : "");
        this.genres = ((data && 'genres' in data) ? data.genres : null);
        this.popularity = ((data && 'popularity' in data) ? data.popularity : null);
    }

// Public Methods

    // Returns boolean of whether artist is saved in database.
    async inDatabase() {
        try {
            return (await ArtistSchema.findOne({ _id: this._id })) != null;
        } catch(error) {
            throw error;
        }
    }
    // Returns Data Object (Retrieves Data if Needed)
    async getData(spotifyAPI) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!this.name || !this.image || !(this.genres instanceof Array) || typeof(this.popularity) != 'number')
                await this.retrieve(spotifyAPI);
            return {
                _id: this._id,
                name: this.name,
                image: this.image,
                genres: this.genres,
                popularity: this.popularity,
            };
        } catch(error) {
            throw error;
        }
    }
    // Saves artist to Database (Retrieves Data if Needed)
    async save(spotifyAPI) {
        try {
            if (!this._id) 
                return;
            if (!this.name || !this.image.length || !this.genres || !this.popularity) 
                await this.retrieve(spotifyAPI);
            if (await this.inDatabase()) return;
            let artist = new ArtistSchema({
                _id: this._id,
                name: this.name,
                image: this.image,
                genres: this.genres,
                popularity: this.popularity,
            });
            await artist.save();
        } catch(error) {
            throw error;
        }
    }
    // Returns TrackDAO of Artist Top Tracks
    async getTopTracks(spotifyAPI) {
        try {
            let response = await spotifyAPI.getArtistTopTracks(this._id);
            let tracks = response.tracks;
            return await tracks.map(async (track) => {
                return await new TrackDAO(track.id, {
                    name: track.name,
                    album: track.album,
                    artists: track.artists,
                    popularity: track.popularity
                });
            });
        } catch(error) {
            throw error;
        }
    }
    // Returns AlbumDAO of Artist Albums
    async getAlbums(spotifyAPI) {
        try {
            let albums = [];
            let offset = 0;
            let response;
            do {
                response = await spotifyAPI.getArtistAlbums(this._id, {limit: 50, offset: offset});
                albums = albums.concat(await response.body.items.map(async (album) => {
                    return await new AlbumDAO(album.id, {

                    });
                }));
                offset += 50;
            } while ((offset + 50) < response.body.total);
            return albums;
        } catch(error) {
            throw error;
        }
    }
    // Returns Atist Object of Related Artist
    async getRelatedArtists(spotifyAPI) {
        try {
            let response = await spotifyAPI.getArtistRelatedArtists(this._id);
            let artists = await response.body.artists.map(async (artist) => {
                return await new ArtistDAO(artist.id, {
                    name: artist.name ? artist.name : null,
                    name: artist.images ? artist.images : null,
                    name: artist.genres ? artist.genres : null,
                    name: artist.popularity ? artist.popularity : null,
                });
            });
            return artists;
        } catch(error) {
            throw error;
        }
    }

    async getArtistLikedTracks(user) {
        try {
            return await user.getTracksFromArtist(this._id);
        } catch(error) {
            throw error;
        }
    }

    async getHistory(spotifyAPI, user) {
        try {
            let tracks = await this.getArtistLikedTracks(user);
            let timeline = await user.historyFromTracks(tracks);
            tracks = await user.sortTracksByDate(spotifyAPI, tracks);
            return {
                tracks: tracks,
                timeline: timeline,
            };
        } catch(error) {
            console.log(error);
        }
    }

// Helper Methods 

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
            throw error;
        }
    }
    
    convertArtist(artist) {
        this._id = artist.id;
        this.name = artist.name;
        this.image = (artist.images.length ? artist.images[0].url : "");
        this.genres = artist.genres;
        this.popularity = artist.popularity;
    }

// Get Methods

    getID() {
        return this._id;
    }

    getName() {
        return this.name;
    }

    getGenres() {
        return this.genres;
    }

    async genreDAOs(spotifyAPI) {
        if (!this._id) throw new Error("No ID");
        if (!(this.genres instanceof Array))
            await this.retrieve(spotifyAPI);
        let genres = [];
        for (let i = 0; i < this.genres.length; i++) {
            genres.push(new GenreDAO(this.genres[i]));
        }
        return genres;
    }

    getImage() {
        return this.image;
    }

    getPopularity() {
        return this.popularity;
    }
}

module.exports = ArtistDAO;