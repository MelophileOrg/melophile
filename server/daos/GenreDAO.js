// Other Affiliated DAOs
let ArtistDAO = require('./ArtistDAO.js');

class GenreDAO {
    constructor(name, data) {
        this._id = name ? name : null;
        this.name = name ? name : null;
        this.artists = ((data && 'artists' in data) ? data.artists : null);
        this.track_num = ((data && 'track_num' in data) ? data.track_num : null);
    }

// Public Methods
    async getData(user) {
        try {
            if (!this._id) throw new Error("No ID");
            if (!(this.artists instanceof Array) || !(typeof(this.track_num) == 'number'))
                await this.retrieve(user);
            return {
                _id: this._id,
                name: this.name,
                artists: this.artists,
                track_num: this.track_num,
            }
        } catch(error) {
            throw error;
        }
    }

    async getGenreArtists(user) {
        try {
            return await user.getArtistsFromGenre(this._id);
        } catch(error) {
            throw error;
        }
    }

    async getGenreTracks(user) {
        try {
            let tracks = [];
            let artists = await this.getGenreArtists(user);
            for (let i = 0; i < artists.length; i++) {
                tracks = await tracks.concat(await user.getTracksFromArtist(await artists[i].getID()));
            }
            return tracks;
        } catch(error) {
            throw error;
        }
    }

    async getHistory(spotifyAPI, user) {
        try {
            let tracks = await this.getGenreTracks(user);
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

// Helper Methods {

    async retrieve(user) {
        try {
            if (!user) return;
            let genre = await user.getGenre(this._id);
            this.artists = genre.artists;
            this.track_num = genre.track_num;
        } catch(error) {
            return;
        }
        
    }

// Get Methods

    getID() {
        return this.name;
    }

    getName() {
        return this.name;
    }

    getArtists() {
        return this.artists;
    }

    async artistDAOs() {
        return (await this.artists.map(async (artist) => {
            return await new ArtistDAO(artist);
        }));
    }

    getTrackNum() {
        return this.track_num;
    }
}

module.exports = GenreDAO;