const mongoose = require('mongoose');

let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const User = Items.user;

class MelomaniacProcessor {
    constructor(accessToken) {
        this.setupSpotifyAPI(accessToken);
    }

    async start() {
        await this.createUser();
        await this.processSavedTracks();
    }

    setupSpotifyAPI(accessToken) {
        this.spotifyAPI = new SpotifyWebApi();
        this.spotifyAPI.setAccessToken(accessToken);
    }

    async createUser() {
        try {
            let userData = await this.getMe();
            let foundUser = await User.find({_id: userData.id});
            if (foundUser.length == 0) {
                let user = new User({
                    _id: userData.id,
                    username: userData.display_name,
                    images: userData.images,
                    tracks: [],
                });
                user.save();
            }
            this.userID = userData.id;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async processSavedTracks() {
        this.savedTracks = {};
        this.savedArtists = {};
        await this.retrieveSavedTracks(0);
        await this.retrieveSavedArtists();
        await this.updateUser();
    }

    async retrieveSavedTracks(offset) {
        let tracks = await this.getSavedTracks(offset);
        let audioFeatures = await this.getAudioFeaturesForTracks(tracks.map(track => track.track.id));
        for (let i = 0; i < tracks.length; i++) {
            if (this.savedTracks[tracks[i].track.id] != null)
                continue;
            try {
                let date = new Date(tracks[i].added_at);
                this.savedTracks[tracks[i].track.id] = date.getTime();
                if ((await Track.find({_id: tracks[i].track.id})).length == 0) {
                    let image;
                    if (tracks[i].track.album.images.length == 0) 
                        image = "Undefined";
                    else    
                        image = tracks[i].track.album.images[0].url;
                    let track = new Track({
                        _id: tracks[i].track.id,
                        name: tracks[i].track.name,
                        artists: tracks[i].track.artists.map(artist => artist.id),
                        image: image,
                        key: audioFeatures[i].key,
                        mode: audioFeatures[i].mode,
                        tempo: audioFeatures[i].tempo,
                        valence: audioFeatures[i].valence,
                        danceability: audioFeatures[i].danceability,
                        energy: audioFeatures[i].energy,
                        acousticness: audioFeatures[i].acousticness,
                        instrumentalness: audioFeatures[i].instrumentalness,
                        liveness: audioFeatures[i].liveness,
                        loudness: audioFeatures[i].loudness,
                        speechiness: audioFeatures[i].speechiness,
                    });
                    await track.save();
                }
            } catch (error) {
                console.log(error);
                console.log(tracks[i].track);
            }
            for (let j = 0; j < tracks[i].track.artists.length; j++) {
                if (this.savedArtists[tracks[i].track.artists[j].id] != null) {
                    this.savedArtists[tracks[i].track.artists[j].id].push(tracks[i].track.id);
                }
                else {
                    this.savedArtists[tracks[i].track.artists[j].id] = [tracks[i].track.id];
                }
            }
        }
        if (!(tracks.length < 50)) {
            await this.retrieveSavedTracks(offset + 50);
        }
    }

    async retrieveSavedArtists() {
        console.log("RUNNING ARTIST");
        let artists = Object.keys(this.savedArtists);
        let newArtists = {};
        for (let i = 0; i < artists.length; i++) {
            let existingArtist = await Artist.find({_id: artists[i]});
            if (existingArtist.length == 0) {
                newArtists[artists[i]] = this.savedArtists[artists[i]];
            }
            else {
                try {
                    await Artist.updateOne({
                        _id: artists[i],
                    },
                    {
                        $set: {
                            "tracks": this.insertTracks(existingArtist[0].tracks, this.savedArtists[artists[i]]),
                        }
                    });
                } catch(error) {
                    console.log(error);
                }
            }
        }
        let artistsData = [];
        let artistIDs = Object.keys(newArtists);
        while (artistIDs.length > 0) {
            let artistIDsSegment = artistIDs.splice(0, 50);
            let newArtistData = await this.getArtists(artistIDsSegment);
            artistsData = artistsData.concat(newArtistData);
        }
        for (let i = 0; i < artistsData.length; i++) {
            try {
                let image;
                if (artistsData[i].images.length == 0) 
                    image = "Undefined";
                else    
                    image = artistsData[i].images[0].url;
                let artist = new Artist({
                    _id: artistsData[i].id,
                    name: artistsData[i].name,
                    image: image,
                    genres: artistsData[i].genres,
                    tracks: newArtists[artistsData[i].id],
                });
                await artist.save();
            } catch(error) {
                console.log(error);
                console.log(artistsData[i]);
            }
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
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    insertTracks(arr1, arr2) {
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

    async getMe() {
        try {
            let response = await this.spotifyAPI.getMe();
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async getUser(userID) {
        try {
            let response = await this.spotifyAPI.getUser(userID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async followUser(userID) {
        try {
            let response = await this.spotifyAPI.followUsers([userID]);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async unfollowUser() {
        try {
            let response = await this.spotifyAPI.unfollowUsers([userID]);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async checkFollowingUser() {
        try {
            let response = await this.spotifyAPI.isFollowingUsers([userID]);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    // TRACKS
    async getTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getTrack(trackID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async getTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getTracks(trackIDs);
            return response.body.tracks;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async getSavedTracks(offset) {
        try {
            let response = await this.spotifyAPI.getMySavedTracks({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getAudioFeaturesForTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTrack(trackID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getAudioAnalysisForTrack(trackID) {
        try {
            let response = await this.spotifyAPI.getAudioAnalysisForTrack(trackID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }    
    }
    async getAudioFeaturesForTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.getAudioFeaturesForTracks(trackIDs);
            console.log(response.audio_features);
            return response.body.audio_features;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async addToSavedTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.addToMySavedTracks(trackIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async removeSavedTrack(trackIDs) {
        try {
            let response = await this.spotifyAPI.removeFromMySavedTracks(trackIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }
    }
    async checkSavedTracks(trackIDs) {
        try {
            let response = await this.spotifyAPI.containsMySavedTracks(trackIDs);
            return response.body;
        } catch (error) {
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
            console.log(error);
            return 1;
        } 
    }
    async getArtists(artistIDs) {
        try {
            let response = await this.spotifyAPI.getArtists(artistIDs);
            return response.body.artists;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getArtistAlbums(artistID, offset) {
        try {
            let response = await this.spotifyAPI.getArtistAlbums(artistID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getArtistTopTracks(artistID) {
        try {
            let response = await this.spotifyAPI.getArtistTopTracks(artistID);
            console.log(response.tracks);
            return response.body.tracks;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getArtistsRelatedArtists(artistID) {
        try {
            let response = await this.spotifyAPI.getArtistRelatedArtists(artistID);
            console.log(response.artists);
            return response.body.artists;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async followArtist(artistIDs) {
        try {
            let response = await this.spotifyAPI.followArtists(artistIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async unfollowArtist(artistIDs) {
        try {
            let response = await this.spotifyAPI.unfollowArtists(artistIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async checkFollowingArtist(artistIDs) {
        try {
            let response = await this.spotifyAPI.isFollowingArtists(artistIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getFollowingArtists(artistID) {
        try {
            let response = await this.spotifyAPI.getFollowedArtists({limit: 50, after: artistID});
            return response.body.artists;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    // ALBUMS
    async getAlbum(albumID) {
        try {
            let response = await this.spotifyAPI.getAlbum(albumID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getAlbums(albumIDs) {
        try {
            let response = await this.spotifyAPI.getAlbums(albumIDs);
            return response.body.albums;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getAlbumTracks(albumID, offset) {
        try {
            let response = await this.spotifyAPI.getAlbumTracks(albumID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getSavedAlbums(offset) {
        try {
            let response = await this.spotifyAPI.getMySavedAlbums({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async addToSavedAlbums(albumIDs) {
        try {
            let response = await this.spotifyAPI.addToMySavedAlbums(albumIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async removedSavedAlbum() {
        try {
            let response = await this.spotifyAPI.removeFromMySavedAlbums(albumIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async checkSavedAlbums() {
        try {
            let response = await this.spotifyAPI.containsMySavedAlbums(albumIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getNewReleases(offset) {
        try {
            let response = await this.spotifyAPI.getNewReleases({limit: 50, offset: offset});
            return response.body.albums;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    // CHARTS
    async getTopArtists(offset) {
        try {
            let response = await this.spotifyAPI.getMyTopArtists({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getTopTracks(offset) {
        try {
            let response = await this.spotifyAPI.getMyTopTracks({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getRecentlyPlayed(offset) {
        try {
            let response = await this.spotifyAPI.getMyRecentlyPlayedTracks({limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
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
            console.log(error);
            return 1;
        }  
    }
    async getUserPlaylists(userID) {
        try {
            let response = await this.spotifyAPI.getUserPlaylists(userID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async getPlaylistTracks(playlistID, offset) {
        try {
            let response = await this.spotifyAPI.getPlaylistTracks(playlistID, {limit: 50, offset: offset});
            return response.body.items;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async createPlaylist(userID, name, publicBool, description) {
        try {
            let response = await this.spotifyAPI.createPlaylist(userID, {name: name, public: publicBool, description: description});
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        }  
    }
    async addTrackToPlaylist(playlistID, trackIDs) {
        try {
            let response = await this.spotifyAPI.addTracksToPlaylist(playlistID, trackIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async replaceTracksFromPlaylist(playlistID, trackIDs) {
        try {
            let response = await this.spotifyAPI.replaceTracksInPlaylist(playlistID, trackIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async removeTracksFromPlaylist(playlistID, trackIDs) {
        try {
            let response = await this.spotifyAPI.removeTracksFromPlaylist(playlistID, trackIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async uploadCustomPlaylistCoverImage(playlistID, imageData) {
        try {
            let response = await this.spotifyAPI.uploadCustomPlaylistCoverImage(playlistID, imageData);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async followPlaylist(playlistID) {
        try {
            let response = await this.spotifyAPI.followPlaylist(playlistID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async unfollowPlaylist(playlistID) {
        try {
            let response = await this.spotifyAPI.unfollowPlaylist(playlistID);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async checkFollowingPlaylist(playlistID, userIDs) {
        try {
            let response = await this.spotifyAPI.areFollowingPlaylist(playlistID, userIDs);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    // MISC 
    async search(query, offset) {
        try {
            let response = await this.spotifyAPI.search(query, ['album', 'artist', 'playlist', 'track'], {limit: 50, offset: offset});
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getRecommendations(seed_artists, seed_genres, seed_tracks) {
        try {
            let options = {
                limit: 50,
                seed_artists: seed_artists,
                seed_genres: seed_genres,
                seed_tracks: seed_tracks, // Max 5 Total
                // max_*
                // min_*
                // target_*
            };
            let response = await this.spotifyAPI.getRecommendations(options);
            return response.body.tracks;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getAvailableGenreSeeds() {
        try {
            let response = await this.spotifyAPI.getAvailableGenreSeeds(options);
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async getMyCurrentPlayingTrack() {
        try {
            let response = await this.spotifyAPI.getMyCurrentPlayingTrack();
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async play(uris) {
        try {
            let response = await this.spotifyAPI.play({uris: uris});
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async skipToNext() {
        try {
            let response = await this.spotifyAPI.skipToNext({uris: uris});
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
    async pause() {
        try {
            let response = await this.spotifyAPI.pause();
            return response.body;
        } catch (error) {
            console.log(error);
            return 1;
        } 
    }
}

module.exports = {
    processor: MelomaniacProcessor
}