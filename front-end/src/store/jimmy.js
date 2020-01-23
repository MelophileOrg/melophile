let SpotifyWebApi = require('spotify-web-api-node');
import axios from 'axios';

// Jimmy just your everyday cowboy gone sailor here for a good time.

class Jimmy {
    constructor() {
        this.spotifyAPI =  new SpotifyWebApi();
        this.ready = false;
        this.type = 0;
        this.tracks = {};
        this.artists = {};
        this.albums = {};
        this.playlists = {};
    }

    sayHello() {
        console.log("I'm-a chewin' on a honeysuckle vine.");
    }

    async inicialize(accessToken) {
        try {
            await this.spotifyAPI.setAccessToken(accessToken);
            this.ready = true;
        } catch(error) {
            console.log(error);
        }
    }

    async getTracks(ids, concat) {
        try {
            if (!this.ready)
                return null;
            this.clearCache(0, concat);
            let response = await axios.put('/api/tracks', { ids: ids });
            let tracks = response.data.tracks;
            let missing = [];
            let key;
            for (key in tracks) 
                if (tracks[key] == null) 
                    missing.push(key);
            console.log(tracks);
            console.log(missing);
            if (missing.length > 0) {
                let newTracks = [];
                for (let i = 0; i < Math.ceil(missing / 50); i++) 
                    newTracks = newTracks.concat((await this.spotifyAPI.getTracks(missing.slice(i * 50, i * 50 + 50))).body.tracks);
                for (let i = 0; i < newTracks.length; i++) {
                    if (newTracks[i] != null) {
                        tracks[newTracks[i].id] = await this.convertTrack(newTracks[i]);
                    } else {
                        tracks[newTracks[i].id] = null;
                    }
                }
            }
            return tracks;
        } catch(error) {
            console.log(error);
        }
    }

    async getArtists(ids, concat) {
        try {
            if (!this.ready)
                return null;
            this.clearCache(1, concat);
            let response = await axios.put('/api/artists', { ids: ids });
            let artists = response.data.artists;
            let missing = [];
            let key;
            for (key in artists) 
                if (artists[key] == null) 
                    missing.push(key);
            if (missing.length > 0) {
                let newArtists = [];
                for (let i = 0; i < Math.ceil(missing / 50); i++) 
                    newArtists = newArtists.concat((await this.spotifyAPI.getArtists(missing.slice(i * 50, i * 50 + 50))).body.artists);
                for (let i = 0; i < newArtists.length; i++) {
                    if (newArtists[i] != null) {
                        artists[newArtists[i].id] = await this.convertArtist(newArtists[i]);
                    } else {
                        artists[newArtists[i].id] = null;
                    }
                }
            }
            console.log(artists);
            return artists;
        } catch(error) {
            console.log(error);
        }
    }

    async getAlbums(ids, concat) {
        try {
            if (!this.ready)
                return null;
            this.clearCache(2, concat);
            let albums = {};
            let newAlbums = [];
            for (let i = 0; i < Math.ceil(ids / 50); i++) 
                newAlbums = newAlbums.concat((await this.spotifyAPI.getAlbums(ids.slice(i * 50, i * 50 + 50))).body.albums);
            for (let i = 0; i < newAlbums.length; i++) {
                if (newAlbums[i] != null) {
                    albums[newAlbums[i].id] = await this.convertAlbum(newAlbums[i]);
                } else {
                    albums[newAlbums[i].id] = null;
                }
            }
            console.log(albums);
            return albums;
        } catch(error) {
            console.log(error);
        }
        
    }

    async getPlaylists(ids, concat) {
        try {
            if (!this.ready)
                return null;
            this.clearCache(3, concat);
            let response = await axios.put('/api/playlists', { ids: ids });
            let playlists = response.data.playlists;
            let missing = [];
            let key;
            for (key in playlists) 
                if (playlists[key] == null) 
                    missing.push(key);
            if (missing.length > 0) {
                let newPlaylists = [];
                for (let i = 0; i < Math.ceil(missing / 50); i++) 
                    newPlaylists = newPlaylists.concat((await this.spotifyAPI.getPlaylists(missing.slice(i * 50, i * 50 + 50))).body.playlists);
                for (let i = 0; i < newPlaylists.length; i++) {
                    if (newPlaylists[i] != null) {
                        playlists[newPlaylists[i].id] = await this.convertPlaylist(newPlaylists[i]);
                    } else {
                        playlists[newPlaylists[i].id] = null;
                    }
                }
            }
            console.log(playlists);
            return playlists;
        } catch(error) {
            console.log(error);
        }
    }

    getItem(id) {
        if (this.type == 0) {
            return this.tracks[id];
        } else if (this.type == 1) {
            return this.artists[id];
        } else if (this.type == 2) {
            return this.albums[id];
        } else if (this.type == 3) {
            return this.playlists[id];
        } else {
            return null;
        }
    }

    clearCache(newType, concat) {
        if (newType != 0 || !concat) {
            for (let member in this.tracks) delete this.tracks[member];
        } else if (newType != 1 || !concat) {
            for (let member in this.artists) delete this.artists[member];
        } else if (newType != 2 || !concat) {
            for (let member in this.albums) delete this.albums[member];
        } else if (newType != 3 || !concat) {
            for (let member in this.playlists) delete this.playlists[member];
        }
        this.type = newType;
    }

    convertTrack(track) {
        let image;
        if (track.album.images.length == 0) 
            image = "Undefined";
        else    
            image = track.album.images[0].url;
        return {
            _id: track.id,
            name: track.name,
            artists: track.artists.map( function(artist) {
                return {name: artist.name, _id: artist.id};
            }),
            album: {
                name: track.album.name, 
                _id: track.album.id
            },
            image: image,
        };
    }

    convertArtist(album) {
        let image;
        if (album.images.length == 0) 
            image = "Undefined";
        else    
            image = album.images[0].url;
        return {
            _id: album.id,
            name: album.name,
            artists: album.genres,
            image: image,
        };
    }

    convertAlbum(album) {
        let image;
        if (album.images.length == 0) 
            image = "Undefined";
        else    
            image = album.images[0].url;
        return {
            _id: album.id,
            name: album.name,
            artists: album.artists.map( function(artist) {
                return {name: artist.name, _id: artist.id};
            }),
            image: image,
            trackNum: album.tracks.total,
        };
    }

    convertPlaylist(playlist) {
        let image;
        if (playlist.images.length == 0) 
            image = "Undefined";
        else    
            image = playlist.images[0].url;
        return {
            _id: playlist.id,
            name: playlist.name,
            owner: playlist.owner,
            image: image,
            public: playlist.public,
        };
    }
}

export default Jimmy;
