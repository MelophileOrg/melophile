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
        this.requestNum = 0;
    }

    sayHello() {
        return "I'm-a chewin' on a honeysuckle vine.";
    }

    async checkServer() {
        console.log("Hello, this is JIMMY?");
        let response = await axios.get('/api/');
        console.log(response.data.message);
    }

    async inicialize(accessToken) {
        try {
            this.axios = axios.create({
                headers: {'Authorization': 'Bearer ' + accessToken}
            });
            this.token = accessToken;
            await this.spotifyAPI.setAccessToken(this.token);
            this.ready = true;
        } catch(error) {
            return;
        }
    }

    async search(query, offset, type) {
        try {
            let localRequestNum = this.requestNum + 1;
            this.requestNum += 1;

            if (!this.ready) 
                return null;
            let response;
            let key;
            switch(type) {
                case 0: 
                    response = await this.spotifyAPI.searchTracks(query, {limit: 50, offset: offset});
                    key = "tracks";
                    break;
                case 1:
                    response = await this.spotifyAPI.searchArtists(query, {limit: 50, offset: offset});
                    key = "artists";
                    break;
                case 2:
                    response = await this.spotifyAPI.searchAlbums(query, {limit: 50, offset: offset});
                    key = "albums";
                    break;
                case 3:
                    response = await this.spotifyAPI.searchPlaylists(query, {limit: 50, offset: offset});
                    key = "playlists";
                    break;
                default:
                    return null;
            }
            let items = response.body[key].items;
            let convertedItems = [];
            for (let i = 0; i < items.length; i++) {
                switch(type) {
                    case 0:
                        convertedItems.push(this.convertTrack(items[i]));
                        break;
                    case 1:
                        convertedItems.push(this.convertArtist(items[i]));
                        break;
                    case 2: 
                        convertedItems.push(this.convertAlbum(items[i]));
                        break;
                    case 3: 
                        convertedItems.push(this.convertPlaylist(items[i]));
                        break;
                }
            }
            if (this.requestNum != localRequestNum) {
                return null;
            }
            return convertedItems;
        } catch(error) {
            return;
        }
    }

    async getRecommends(options) {
        try {
            if (!this.ready) {
                return null;
            }
            let keys = Object.keys(options);
            let optionStrings = [];
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == 'seed_tracks') {
                    let seed_tracks = "seed_tracks=";
                    for (let i = 0; i < options.seed_tracks.length; i++) {
                        seed_tracks += options.seed_tracks[i];
                        if (i < options.seed_tracks.length - 1) {
                            seed_tracks += "%2C%20";
                        }
                    }
                    optionStrings.push(seed_tracks);
                } else if (keys[i] == 'seed_artists') {
                    let seed_artists = "seed_artists=";
                    for (let i = 0; i < options.seed_artists.length; i++) {
                        seed_artists += options.seed_artists[i];
                        if (i < options.seed_artists.length - 1) {
                            seed_artists += "%2C%20";
                        }
                    }
                    optionStrings.push(seed_artists);
                } else {
                    optionStrings.push(keys[i] + "=" + options[keys[i]]);
                }
            }
            let parameters = "";
            for (let i = 0; i < optionStrings.length; i++) {
                parameters += optionStrings[i];
                if (i < optionStrings.length - 1) {
                    parameters += '&';
                }
            }
            let response = await this.axios.get('https://api.spotify.com/v1/recommendations?' + parameters);
            let tracks = response.data.tracks;
            let list = [];
            for (let i = 0; i < tracks.length; i++) {
                list.push(await this.convertTrack(tracks[i]));
            }
            return list;
        } catch(error) {
            return [];
        }
    }

    async playTrack(id) {
        this.spotifyAPI.play({uris: ["spotify:track:" + id]});
    }

    async playTracks(ids) {
        let uris = [];
        for (let i = 0; i < ids.length; i++) 
            uris.push("spotify:track:" + ids[i]);
        this.spotifyAPI.play({uris: uris});
    }

    async playArtist(id) {
        this.spotifyAPI.play({context_uri: "spotify:artist:" + id});
    }

    async playAlbum(id) {
        this.spotifyAPI.play({context_uri: "spotify:album:" + id});
    }

    async playPlaylist(id) {
        this.spotifyAPI.play({context_uri: "spotify:playlist:" + id});
    }

    async getTrackAnalysis(id) {
        let response = await this.spotifyAPI.getTrack(id);
        let track = await this.convertTrack(response.body);
        response = await this.spotifyAPI.getAudioFeaturesForTrack(id); 
        track.duration_ms = response.body.duration_ms;
        track.key = response.body.key;
        track.mode = response.body.mode;
        track.time_signature = response.body.time_signature;
        track.acousticness = response.body.acousticness;
        track.danceability = response.body.danceability;
        track.energy = response.body.energy;
        track.instrumentalness = response.body.instrumentalness;
        track.liveness = response.body.liveness;
        track.loudness = response.body.loudness;
        track.speechiness = response.body.speechiness;
        track.valence = response.body.valence;
        track.tempo = response.body.tempo;
        response = await this.spotifyAPI.getAudioAnalysisForTrack(id); 
        track.audioAnalysis = await this.processAudioAnalysis(response.body);
        return track;
    }

    async processAudioAnalysis(apiReturn) {
        let audioAnalysisSegments = 80;
        let newSegments = [];
        if (apiReturn.segments.length < audioAnalysisSegments)
            audioAnalysisSegments = apiReturn.segments.length;
        let width = Math.round(apiReturn.segments.length / audioAnalysisSegments);
          
        for (var i = 0; i < audioAnalysisSegments; i++)
        {
            let itemIndex = Math.round(width * i);
            if (itemIndex > apiReturn.segments.length - 1)
            {
                itemIndex = apiReturn.segments.length - 2;
            }
            let sum = 0;
            for (var j = 0; j < apiReturn.segments[itemIndex].pitches.length; j++)
            {
                sum += apiReturn.segments[itemIndex].pitches[j];
            }
            let averagePitch = sum / apiReturn.segments[itemIndex].pitches.length; 
            let color = await this.HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
            let loudness = (Math.round(((apiReturn.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);

            newSegments.push({
                start: Math.round(apiReturn.segments[itemIndex].start),
                loudness_max: loudness, 
                red: color.r,
                green: color.g,
                blue: color.b,
            });
        }
        return newSegments;
    }

    async HSVtoRGB(payload) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(payload.hue * 6);
        f = payload.hue * 6 - i;
        p = payload.value * (1 - payload.saturation);
        q = payload.value * (1 - f * payload.saturation);
        t = payload.value * (1 - (1 - f) * payload.saturation);
        switch (i % 6) {
            case 0: r = payload.value, g = t, b = p; break;
            case 1: r = q, g = payload.value, b = p; break;
            case 2: r = p, g = payload.value, b = t; break;
            case 3: r = p, g = q, b = payload.value; break;
            case 4: r = t, g = p, b = payload.value; break;
            case 5: r = payload.value, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    // async getSavedTracks(options) {
    //     //let response = await axios.get('/api/')
    // }

    // async getSavedArtists(options) {
    //     //let response = await axios.get('/api/')
    // }

    // async getSavedPlaylists(options) {
    //     //let response = await axios.get('/api/')
    // }

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
            genres: album.genres,
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
            total_tracks: album.total_tracks,
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
            owner: playlist.owner.display_name,
            image: image,
            public: playlist.public,
            total_tracks: playlist.tracks.total,
        };
    }
}

export default Jimmy;


// async getTracks(ids, concat) {
//     try {
//         if (!this.ready)
//             return null;
//         this.clearCache(0, concat);
//         let response = await axios.put('/api/tracks', { ids: ids });
//         let tracks = response.data.tracks;
//         let keys = Object.keys(tracks);
//         let missing = [];
//         for (let i = 0; i < keys.length; i++) {
//             if (tracks[keys[i]] == null) {
//                 missing.push(keys[i]);
//             }
//         }
//         if (missing.length > 0) {
//             let newTracks = [];
//             for (let i = 0; i < Math.ceil(missing.length / 50); i++) {
//                 newTracks = newTracks.concat((await this.spotifyAPI.getTracks(missing.slice(i * 50, i * 50 + 50))).body.tracks);
//             }
//             for (let i = 0; i < newTracks.length; i++) {
//                 if (newTracks[i] != null) {
//                     tracks[newTracks[i].id] = await this.convertTrack(newTracks[i]);
//                 } else {
//                     tracks[newTracks[i].id] = null;
//                 }
//             }
//         }
//         return tracks;
//     } catch(error) {
//         return;
//     }
// }

// async getArtists(ids, concat) {
//     try {
//         if (!this.ready)
//             return null;
//         this.clearCache(0, concat);
//         let response = await axios.put('/api/artists', { ids: ids });
//         let artists = response.data.artists;
//         let keys = Object.keys(artists);
//         let missing = [];
//         for (let i = 0; i < keys.length; i++) {
//             if (artists[keys[i]] == null) {
//                 missing.push(keys[i]);
//             }
//         }
//         if (missing.length > 0) {
//             let newArtists = [];
//             for (let i = 0; i < Math.ceil(missing.length / 50); i++) {
//                 newArtists = newArtists.concat((await this.spotifyAPI.getArtists(missing.slice(i * 50, i * 50 + 50))).body.artists);
//             }
//             for (let i = 0; i < newArtists.length; i++) {
//                 if (newArtists[i] != null) {
//                     artists[newArtists[i].id] = await this.convertArtist(newArtists[i]);
//                 } else {
//                     artists[newArtists[i].id] = null;
//                 }
//             }
//         }
//         return artists;
//     } catch(error) {
//         return;
//     }
// }

// async getAlbums(ids, concat) {
//     try {
//         if (!this.ready)
//             return null;
//         this.clearCache(2, concat);
//         let albums = {};
//         let newAlbums = [];
//         for (let i = 0; i < Math.ceil(ids / 50); i++) 
//             newAlbums = newAlbums.concat((await this.spotifyAPI.getAlbums(ids.slice(i * 50, i * 50 + 50))).body.albums);
//         for (let i = 0; i < newAlbums.length; i++) {
//             if (newAlbums[i] != null) {
//                 albums[newAlbums[i].id] = await this.convertAlbum(newAlbums[i]);
//             } else {
//                 albums[newAlbums[i].id] = null;
//             }
//         }
//         return albums;
//     } catch(error) {
//         return;
//     }
    
// }

// async getPlaylists(ids, concat) {
//     try {
//         if (!this.ready)
//             return null;
//         this.clearCache(0, concat);
//         let response = await axios.put('/api/playlists', { ids: ids });
//         let playlists = response.data.playlists;
//         let keys = Object.keys(playlists);
//         let missing = [];
//         for (let i = 0; i < keys.length; i++) {
//             if (playlists[keys[i]] == null) {
//                 missing.push(keys[i]);
//             }
//         }
//         if (missing.length > 0) {
//             let newPlaylists = [];
//             for (let i = 0; i < Math.ceil(missing.length / 50); i++) {
//                 newPlaylists = newPlaylists.concat((await this.spotifyAPI.getPlaylists(missing.slice(i * 50, i * 50 + 50))).body.playlists);
//             }
//             for (let i = 0; i < newPlaylists.length; i++) {
//                 if (newPlaylists[i] != null) {
//                     playlists[newPlaylists[i].id] = await this.convertPlaylist(newPlaylists[i]);
//                 } else {
//                     playlists[newPlaylists[i].id] = null;
//                 }
//             }
//         }
//         return playlists;
//     } catch(error) {
//         return;
//     }
// }