var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
var authorize = async function(userID, fields) {
try {
    let user = await getUserData(userID);
    if (user == null) return false;
    if (user.privacy.protected) return false;
    let transverse = user;
    for (let i = 0; i < fields.length; i++) {
        if (i < (fields.length - 1)) transverse = transverse[fields[i]];
        else {
            if (fields[i] == 'all') {
                let keys = Object.keys(transverse);
                for (let j = 0; j < keys.length; j++)
                    if (!transverse[keys[j]]) return false;
                return true;
            } else {
                return transverse[fields[i]];
            }
        }
    }
} catch(error) {
    console.log(error);
}
};

var getUserData = async function (userID) {
    return await User.findOne({_id: userID});
};

var retrieveUserTracks = async function (user) {
try {
    return await Track.find({"_id": {$in: user.tracks}});
} catch(error) {
    console.log(error);
}
};

var retrieveUserTrackFields = async function (user, projection) {
try {
    return await Track.find({"_id": {$in: user.tracks}}, projection);
} catch(error) {
    console.log(error);
}
};

var getAudioFeatureAverage = function (audioFeature, tracks) {
try {
    const REDUCER = (accumulator, currentValue) => accumulator + currentValue[audioFeature];
    let total = tracks.reduce(REDUCER);
    return (total / tracks.length);
} catch(error) {
    console.log(error);
}
}

var getAudioFeatureDistribution = function (audioFeature, tracks) {
try {
    let distribution = [];
    for (let i = 0; i < 21; i++) 
        distribution.push(0);
    for (let i = 0; i < tracks.length; i++)
        distribution[Math.round(tracks[i][audioFeature] * 20)] += 1;
    return distribution;
} catch(error) {
    console.log(error);
}
};

var getTrackAudioAnalysis = async function (trackID, spotifyAPI) {
try {
    let segmentNum = 80;
    let audioAnalysis = await spotifyAPI.getAudioAnalysisForTrack(trackID);
    if (audioAnalysis.segments.length < segmentNum) segmentNum = audioAnalysis.segments.length;
    let width = Math.round(audioAnalysis.segments.length / segmentNum);
    let newSegments = [];
    for (var i = 0; i < segmentNum; i++) {
        let itemIndex = Math.round(width * i);
        if (itemIndex > audioAnalysis.segments.length - 1)
            itemIndex = audioAnalysis.segments.length - 2;
        let sum = 0;
        for (var j = 0; j < audioAnalysis.segments[itemIndex].pitches.length; j++)
            sum += audioAnalysis.segments[itemIndex].pitches[j];
        let averagePitch = sum / audioAnalysis.segments[itemIndex].pitches.length; 
        let color = await HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
        let loudness = (Math.round(((audioAnalysis.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);
        newSegments.push({
            start: Math.round(audioAnalysis.segments[itemIndex].start),
            loudness_max: loudness, 
            red: color.r,
            green: color.g,
            blue: color.b,
        });
    }
    return newSegments;
} catch(error) {
    console.log(error);
}
};

var HSVtoRGB = function (payload) {
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
};

class MelomaniacProcessor {
constructor(accessToken, socket) {
    this.tokenSet = false;
    this.newTrackNum = 0;
    this.newArtistNum = 0;
    this.savedTracks = {};
    this.savedGenres = {};
    this.savedArtists = {};
    this.setupSpotifyAPI(accessToken);
    this.socket = socket;
}

async start() {
    try {
        if (!this.tokenSet) 
            return;
        await this.createUser();
        await this.processUserPlaylists();
        await this.processSavedTracks();
        await this.processTopCharts();
        this.totalSent = false;
        await this.updateUser();
        console.log("Processing Finished:", this.socket.id);
        console.log('New Tracks:', this.newTrackNum);
        console.log('New Artists:', this.newArtistNum);
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
}

setupSpotifyAPI(accessToken) {
    this.totalSent = false;
    this.spotifyAPI = new SpotifyWebApi();
    this.spotifyAPI.setAccessToken(accessToken);
    this.tokenSet = true;
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
                tracks: {},
                artists: {},
                genres: {},
                topPlayed: {
                    tracks: [],
                    artists: [],
                },
                playlists: [],
                privacy: {
                    public: false,
                    protected: true,
                    values: false, // saved songs, artists, genres,
                    average: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        mode: false,
                        loudness: false,
                        key: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    distribution: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        mode: false,
                        loudness: false,
                        key: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    topPlayed: {
                        tracks: false,
                        artists: false,
                    },
                    topSaved: {
                        artists: false,
                        genres: false,
                    },
                    extremes: {
                        valence: false,
                        danceability: false,
                        energy: false,
                        tempo: false,
                        loudness: false,
                        speechiness: false,
                        instrumentalness: false,
                        acousticness: false,
                        liveness: false,
                    },
                    timeline: {
                        added: false,
                        months: false,
                        years: false,
                        features: {
                            valence: false,
                            danceability: false,
                            energy: false,
                            tempo: false,
                            loudness: false,
                            speechiness: false,
                            instrumentalness: false,
                            acousticness: false,
                            liveness: false,
                        },
                        artists: false,
                        genres: false,
                    },
                },
            });
            user.save();
        }
        this.userID = userData.id;
    } catch (error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
        res.sendStatus(500);
    }
}

async processSavedTracks() {
    try {
        await this.retrieveSavedTracks(0);
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
}

async retrieveSavedTracks(offset) {
    try {
        this.socket.emit('ProcessedTracks', {processed: offset});
        let tracks = await this.getSavedTracks(offset);
        await this.saveTracks(tracks.map(track => track.track), true);
        for (let i = 0; i < tracks.length; i++)
            this.savedTracks[tracks[i].track.id] = (await new Date(tracks[i].added_at)).getTime();
        if (!(tracks.length < 50))
            await this.retrieveSavedTracks(offset + 50);
        else {
            this.socket.emit('DoneTracks');
        }
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
}

async processTopCharts() {
    try {
        this.topTracks = [];
        this.topArtists = [];
        await this.retrieveTopTracks();
        await this.retrieveTopArtists();
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
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
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
}

async retrieveTopArtists() {
    try {
        for (let i = 0; i < 3; i++) {
            let artistIDs = await this.saveArtists(await this.getTopArtists(i, 0), false);
            this.topArtists.push(artistIDs);
        }
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
}

async processUserPlaylists() {
    try {
        this.playlists = [];
        await this.retrieveUserPlaylists(0);
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
        console.log(error);
    }
        
}

async retrieveUserPlaylists(offset) {
    try {
        this.socket.emit('ProcessedTracks', {processed: offset});
        let playlists = await this.getUserPlaylists(offset);
        this.playlists = this.playlists.concat(playlists.map(playlist => playlist.id));
        for (let i = 0; i < playlists.length; i++) {
            let tracks = [];
            let playlistTracks = {};
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
    } catch(error) {
        this.socket.emit('ConsoleLog', {message: error}); 
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
                "topPlayed.tracks": this.topTracks, 
                "topPlayed.artists": this.topArtists,
                "playlists": this.playlists,
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
                    artists: unsaved[ids[i]].track.artists.map(artist => artist.id),
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
            if (artists[i] == null || artists[i].artist == null)
                continue;
            if (!(artists[i].artist.id in this.savedArtists)) {
                if (liked)
                    this.saveArtists[artists[i].artist.id] = artists[i].tracks;
                if (!(await this.artistInDatabase(artists[i].artist.id))) {
                    this.newArtistNum += 1;
                    unsaved.push(artists[i].artist);
                }
            } else if (liked) {
                this.saveArtists[artists[i].artist.id] = this.saveArtists[artists[i].artist.id].concat(artist[i].tracks);
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

async getMe() {
    try {
        let response = await this.spotifyAPI.getMe();
        return response.body;
    } catch (error) {
        this.socket.emit('ConsoleLog', {message: error}); 
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
        if (!this.totalSent) 
            this.socket.emit('TotalTracks', {total: response.body.total});
        this.totalSent = true;
        
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
        if (!this.totalSent) 
            this.socket.emit('TotalTracks', {total: response.body.total});
        this.totalSent = true;
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
}
  
module.exports = {
    generateRandomString,
    authorize,
    getUserData,
    retrieveUserTracks,
    retrieveUserTrackFields,
    getAudioFeatureAverage,
    getAudioFeatureDistribution,
    getTrackAudioAnalysis,
    HSVtoRGB,
    MelomaniacProcessor,
}