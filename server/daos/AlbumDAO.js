// // Associated DAOs
// let TrackDAO = require('./TrackDAO.js');
// let ArtistDAO = require('./ArtistDAO.js');
// let GenreDAO = require('./GenreDAO.js');

// class AlbumDAO {
//     constructor(id, data) {
//         this._id = id ? id : null;
//         this.name = ((data && 'name' in data) ? data.name : null);
//         this.artists = ((data && 'artists' in data) ? data.artists.map(this.minify) : null);
//         this.genres = ((data && 'genres' in data) ? data.genres : null);
//         this.image = ((data && 'image' in data) ? data.image : (data && 'images' in data && data.images.length) ? data.images[0].url : "");
//         this.popularity = ((data && 'popularity' in data) ? data.popularity : null);
//         this.release_date = ((data && 'release_date' in data) ? data.release_date : null);
//         this.tracks = ((data && 'tracks' in data) ? data.tracks : null);
//     }

// // Public methods

//     async getData(spotifyAPI) {
//         try {
//             if (!this._id) throw new Error("No ID");
//             if (typeof(name) != 'string' || !(this.artists instanceof Array) || !(this.genres instanceof Array) || typeof(this.image) != 'string' || typeof(this.popularity) != 'number' || typeof(release_date) != 'number' || !(this.tracks instanceof Array))
//                 await this.retrieve(spotifyAPI); 
//             return {
//                 _id: this._id,
//                 name: this.name,
//                 artists: this.artists,
//                 genres: this.genres,
//                 image: this.image,
//                 popularity: this.popularity,
//                 release_date: this.release_date,
//                 tracks: this.tracks,
//             };
//         } catch(error) {
//             throw error;
//         }
//     }

//     async getAlbumGenres(spotifyAPI) {
//         try {
//             if (!(this.genres instanceof Array))
//                 await this.retrieve(spotifyAPI);
//             return this.genres.map(async (genre) => {
//                 return await new GenreDAO(genre);
//             });
//         } catch(error) {
//             throw error;
//         }
//     }

//     async getAlbumArtists(spotifyAPI) {
//         try {
//             if (!(this.artists instanceof Array))
//                 await this.retrieve(spotifyAPI);
//             return this.artists.map(async (artist) => {
//                 return await new ArtistDAO(artist._id);
//             });
//         } catch(error) {
//             throw error;
//         }
//     }

//     async getAlbumTracks(spotifyAPI) {
//         try {
//             if (!(this.tracks instanceof Array))
//                 await this.retrieve(spotifyAPI);
//             return this.tracks.map(async (track) => {
//                 return await new TrackDAO(track);
//             });
//         } catch(error) {
//             throw error;
//         }
//     }

// // Helper methods

//     async retrieve(spotifyAPI) {
//         try {
//             if (!this._id) throw new Error("No ID");
//             if (typeof(name) == 'string' && this.artists instanceof Array && this.genres instanceof Array && typeof(this.image) == 'string' && typeof(this.popularity) == 'number' && typeof(release_date) == 'number' && this.tracks instanceof Array) 
//                 return;
//             let response = await spotifyAPI.getAlbum(this._id);
//             let album = response.body;
//             this.name = album.name;
//             this.artists = await this.minify(album.artists);
//             this.genres = album.genres;
//             this.image = ('images' in album ? (album.images.length ? album.images[0].url : "") : "");
//             this.popularity = album.popularity;
//             this.release_date = album.release_date;
//             this.tracks = album.tracks.items.map(track => track.id);
//         } catch(error) {
//             throw error;
//         }
//     }

//     minify(item) {
//         let min = {
//             _id: ('id' in item) ? item.id : (('_id' in item) ? item._id : item),
//             name: ('name' in item) ? item.name : typeof(item) == 'string' ? item : "",
//         }
//         return min;
//     }

// // Get methods

//     getID() {
//         return this._id;
//     }

// }

// module.exports = AlbumDAO;