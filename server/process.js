let mongoose = require('mongoose');
let Items = require("./items.js");

let Track = Items.track;
let Artist = Items.artist;
let Playlist = Items.playlist;
let User = Items.user;

class MelomaniacProcessor {
    constructor(accessToken, socket, spotifyAPI, userID) {
        this.newTrackNum = 0;
        this.newArtistNum = 0;
        this.savedTracks = {};
        this.savedGenres = {};
        this.savedArtists = {};
        this.topTracks = [];
        this.topArtists = [];
        this.playlists = [];
        this.spotifyAPI = spotifyAPI;
        this.socket = socket;
        this.userID = userID;
    }
  
    async start() {
        try {
            await this.processSavedTracks();
            await this.processTopCharts();
            await this.processUserPlaylists();
            await this.updateUser();
            console.log("Processing Finished:", this.socket.id);
            console.log('New Tracks:', this.newTrackNum);
            console.log('New Artists:', this.newArtistNum);
        } catch(error) {
            console.log(error);
        }
    }

    async processSavedTracks() {
        try {
            this.reportTotal = false;
            await this.retrieveSavedTracks(0);
        } catch(error) {
            console.log(error);
        }
    }
  
    async retrieveSavedTracks(offset) {
        try {
            let tracks = await this.getSavedTracks(offset);
            this.socket.emit('ProcessMessage', {message: "Processing Liked Tracks", percent: offset / this.total});
            await this.saveTracks(tracks.map(track => track.track), true);
            for (let i = 0; i < tracks.length; i++)
                this.savedTracks[tracks[i].track.id] = {dateAdded: (await new Date(tracks[i].added_at)).getTime()};
            if (!(tracks.length < 50))
                await this.retrieveSavedTracks(offset + 50);
            else 
                this.socket.emit('ProcessMessage', {message: "Finished Processing Tracks", percent: 1});
        } catch(error) {
            console.log(error);
        }
    }
  
    async processTopCharts() {
      try {
          await this.retrieveTopTracks();
          await this.retrieveTopArtists();
      } catch(error) {
          console.log(error);
      }
    }
  
    async retrieveTopTracks() {
        try {
            for (let i = 0; i < 3; i++) {
                let trackIDs = await this.saveTracks(await this.getTopTracks(i, 0), false);
                this.topTracks.push(trackIDs);
            }
        } catch(error) {
            console.log(error);
        }
    }
  
    async retrieveTopArtists() {
        try {
            for (let i = 0; i < 3; i++) {
                let artists = await this.getTopArtists(i, 0);
                let formatedArtists = await (artists).map(function(artist) { 
                    let newArtistObject = {
                        artist: artist,
                    };
                    return newArtistObject;
                });
                let artistIDs = await this.saveArtists(formatedArtists, false);
                this.topArtists.push(artistIDs);
            }
        } catch(error) {
            console.log(error);
        }
    }
  
    async processUserPlaylists() {
        try {
            this.reportTotal = false;
            await this.retrieveUserPlaylists(0);
        } catch(error) {
            console.log(error);
        }  
    }
  
    async retrieveUserPlaylists(offset) {
        try {
            let playlists = await this.getUserPlaylists(offset);
            this.socket.emit('ProcessMessage', {message: "Processing Playlists", percent: offset / this.total});
            for (let i = 0; i < playlists.length; i++) {
                let tracks = [];
                let playlistTracks = {};
                this.playlists.push(playlists[i].id);
                for (let j = 0; j < Math.ceil(playlists[i].tracks.total / 50); j++) {
                    let trackData = await this.getPlaylistTracks(playlists[i].id, (j * 50));
                    tracks = await this.concatUnique(tracks, await trackData.map(track => track.track));
                    for (let k = 0; k < trackData.length; k++) {
                        if (trackData[k] == null || trackData[k].track == null) {
                            continue;
                        } else {
                            playlistTracks[trackData[k].track.id] = (await new Date(trackData[k].added_at)).getTime();
                        }
                    }
                }
                let image;
                if (playlists[i].images.length == 0) 
                    image = "Undefined";
                else    
                    image = playlists[i].images[0].url;
                if ((await this.playlistInDatabase(playlists[i].id))) {
                    await Playlist.updateOne({
                        _id: playlists[i].id,
                    }, {
                        $set: {
                            "name": playlists[i].name,
                            "description": playlists[i].description,
                            "image": image,
                            "public": playlists[i].public,
                            "tracks": playlistTracks,
                        }
                    });
                }
                else {
                    let playlist = await new Playlist({
                        _id: playlists[i].id,
                        name: playlists[i].name, 
                        owner: playlists[i].owner,
                        image: image,
                        description: playlists[i].description,
                        public: playlists[i].public,
                        tracks: playlistTracks,
                    });
                    await playlist.save();
                }
                await this.saveTracks(tracks, false);
            }
            if (!(playlists.length < 50)) 
                await this.retrieveUserPlaylists(offset + 50);
            else 
                this.socket.emit('ProcessMessage', {message: "Finished Processing Playlists", percent: 1});
        } catch(error) {
            console.log(error);
        }
    }
  
    async updateUser() {
        try {
            await User.updateOne({
                _id: this.userID
            },
            {
                $set: {
                    "tracks": this.savedTracks,
                    "artists": this.savedArtists,
                    "genres": this.savedGenres,
                    "playlists": this.playlists,
                    "topPlayed.tracks": this.topTracks, 
                    "topPlayed.artists": this.topArtists,
                }
            });
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }
  
    async saveTracks(tracks, liked) {
        try {
            let unsaved = {};
            let newArtists = {};
            for (let i = 0; i < tracks.length; i++) {
                if (!(tracks[i].id in this.savedTracks) && !(tracks[i].id in unsaved) && !(await this.trackInDatabase(tracks[i].id))) {
                    if (tracks[i] == null)
                        continue;
                    this.newTrackNum += 1;
                    unsaved[tracks[i].id] = {track: tracks[i]};
                }     
            }
            let ids = Object.keys(unsaved);
            if (ids.length > 0) {
                let invalid = (!('artists' in unsaved[ids[0]]) || !('name' in unsaved[ids[0]]) || !('album' in unsaved[ids[0]]))
                let parsedIDS = Object.keys(unsaved);
                while (parsedIDS.length > 0) {
                    let max = 50;
                    if (parsedIDS.length < 50) 
                        max = parsedIDS.length;
                    let cutIds = parsedIDS.splice(0, max);
                    if (invalid) {
                        let trackData = await this.getTracks(cutIds);
                        for (let i = 0; i < trackData.length; i++) {
                            if (trackData[i] == null) {
                                continue;
                            } else {
                                unsaved[trackData[i].id].track = trackData[i];
                            }
                        }
                    }
                    let audioFeatures = await this.getAudioFeaturesForTracks(cutIds);
                    for (let i = 0; i < audioFeatures.length; i++) {
                        if (audioFeatures[i] != null && audioFeatures[i].id in unsaved) {
                            unsaved[audioFeatures[i].id].audioFeatures = audioFeatures[i];
                        } else {
                            continue;
                        }
                    }
                }
                for (let i = 0; i < ids.length; i++) {
                    if (unsaved[ids[i]] == null || !('audioFeatures' in unsaved[ids[i]])) {
                        continue;
                    }
                    for (let j = 0; j < unsaved[ids[i]].track.artists.length; j++) {
                        if (!(unsaved[ids[i]].track.artists[j].id in newArtists))
                            newArtists[unsaved[ids[i]].track.artists[j].id] = {artist: unsaved[ids[i]].track.artists[j], tracks: [unsaved[ids[i]].track.id]};
                        else 
                            newArtists[unsaved[ids[i]].track.artists[j].id].tracks.push(unsaved[ids[i]].track.id);
                    }
                    let image;
                    if (unsaved[ids[i]].track.album.images.length == 0) 
                        image = "Undefined";
                    else    
                        image = unsaved[ids[i]].track.album.images[0].url;
                    let track = new Track({
                        _id: ids[i],
                        name: unsaved[ids[i]].track.name,
                        artists: unsaved[ids[i]].track.artists.map( function(artist) {
                            return {name: artist.name, _id: artist.id};
                        }),
                        album: {
                            name: unsaved[ids[i]].track.album.name, 
                            _id: unsaved[ids[i]].track.album.id
                        },
                        image: image,
                        key: unsaved[ids[i]].audioFeatures.key,
                        mode: unsaved[ids[i]].audioFeatures.mode,
                        tempo: unsaved[ids[i]].audioFeatures.tempo,
                        valence: unsaved[ids[i]].audioFeatures.valence,
                        danceability: unsaved[ids[i]].audioFeatures.danceability,
                        energy: unsaved[ids[i]].audioFeatures.energy,
                        acousticness: unsaved[ids[i]].audioFeatures.acousticness,
                        instrumentalness: unsaved[ids[i]].audioFeatures.instrumentalness,
                        liveness: unsaved[ids[i]].audioFeatures.liveness,
                        loudness: unsaved[ids[i]].audioFeatures.loudness,
                        speechiness: unsaved[ids[i]].audioFeatures.speechiness,
                    });
                    await track.save();
                }
                await this.saveArtists(Object.values(newArtists), liked);
            }
            return tracks.map(track => track.id);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }
  
    async saveArtists(artists, liked) {
        try {
            let unsaved = [];
            for (let i = 0; i < artists.length; i++) {
                if (artists[i] != null && artists[i].artist != null) {
                    if (!(artists[i].artist.id in this.savedArtists)) {
                        if (liked)
                            this.savedArtists[artists[i].artist.id] = artists[i].tracks;
                        if (!(await this.artistInDatabase(artists[i].artist.id))) {
                            this.newArtistNum += 1;
                            unsaved.push(artists[i].artist);
                        }
                    } else if (liked) {
                        this.savedArtists[artists[i].artist.id] = this.savedArtists[artists[i].artist.id].concat(artists[i].tracks);
                    }
                }
            }
            if (unsaved.length > 0) {
                let artistData;
                if (!('name' in unsaved[0]) || !('genres' in unsaved[0])) {
                    artistData = [];
                    while (unsaved.length > 0) {
                        let max = 50;
                        if (unsaved.length < 50) 
                            max = unsaved.length;
                        let cutArtists = unsaved.splice(0, max);
                        let ids = cutArtists.map(artist => artist.id);
                        artistData = this.concatUnique(artistData, await this.getArtists(ids));
                    }
                }
                else {
                    artistData = unsaved;
                }
                for (let i = 0; i < artistData.length; i++) {
                    if (liked) {
                        for (let j = 0; j < artistData[i].genres.length; j++) {
                            if (artistData[i].genres[j] in this.savedGenres)
                                this.savedGenres[artistData[i].genres[j]].push(artistData[i].id);
                            else 
                                this.savedGenres[artistData[i].genres[j]] = [artistData[i].id];
                        }
                    }
                    let image;
                    if (artistData[i].images.length == 0) 
                        image = "Undefined";
                    else    
                        image = artistData[i].images[0].url;
                    let artist = new Artist({
                        _id: artistData[i].id,
                        name: artistData[i].name,
                        image: image,
                        genres: artistData[i].genres,
                    });
                    await artist.save();
                }
            }
            return artists.map(artist => artist.artist.id);
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
        }
    }
  
    async trackInDatabase(trackID) {
        try {
            return (await Track.find({_id: trackID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }
  
    async artistInDatabase(artistID) {
        try {
            return (await Artist.find({_id: artistID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }
  
    async playlistInDatabase(playlistID) {
        try {
            return (await Playlist.find({_id: playlistID})).length != 0;
        } catch(error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return false;
        }
    }
  
    concatUnique(arr1, arr2) {
        let newArr = arr1;
        for (let i = 0; i < arr2.length; i++) {
            if (!(newArr.includes(arr2[i])))
                newArr.push(arr2[i]);
        }
        return newArr;
    }
  
    getSavedTracksArray() {
        return Object.keys(this.savedTracks);
    }
  
    getSavedArtistsArray() {
        return Object.keys(this.savedArtists);
    }
  
    // TRACKS
    async getTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getTrack(trackID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }
  
    async getTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getTracks(trackIDs);
            return response.body.tracks;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }
  
    async getSavedTracks(offset) {
        try {
            let response = await this.spotifyAPI.getMySavedTracks({limit: 50, offset: offset});
            if (!this.reportTotal) {
                this.total = response.body.total;
                this.reportTotal = true;
            }
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
  
    async getAudioFeaturesForTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTrack(trackID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
  
    async getAudioFeaturesForTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
            return response.body.audio_features;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }
    }
  
    // ARTIST
    async getArtist(artistID) {
        try {
            let response = await this.spotifyAPI.getArtist(artistID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }
  
    async getArtists(artistIDs) {
        try {
            let response = await this.spotifyAPI.getArtists(artistIDs);
            return response.body.artists;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }
  
    // CHARTS
    async getTopArtists(time_range, offset) {
        try {
            let time_ranges = ["short_term", "medium_term", "long_term"];
            let adjusted_time_range = time_ranges[time_range];
            let response = await this.spotifyAPI.getMyTopArtists({time_range: adjusted_time_range, limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        } 
    }
  
    async getTopTracks(time_range, offset) {
        try {
            let time_ranges = ["short_term", "medium_term", "long_term"];
            let adjusted_time_range = time_ranges[time_range];
            let response = await this.spotifyAPI.getMyTopTracks({time_range: adjusted_time_range, limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
  
    // PLAYLIST
    async getPlaylist(playlistID) {
        try {
            let response = await this.spotifyAPI.getPlaylist(playlistID);
            return response.body;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
  
    async getUserPlaylists(offset) {
        try {
            let response = await this.spotifyAPI.getUserPlaylists({limit: 50, offset: offset});
            if (!this.reportTotal) {
                this.total = response.body.total;
                this.reportTotal = true;
            }
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
  
    async getPlaylistTracks(playlistID, offset) {
        try {
            let response = await this.spotifyAPI.getPlaylistTracks(playlistID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            this.socket.emit('ConsoleLog', {message: error}); 
            console.log(error);
            return 1;
        }  
    }
};

module.exports = {
    MelomaniacProcessor,
};