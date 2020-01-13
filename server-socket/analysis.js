const mongoose = require('mongoose');

let SpotifyWebApi = require('spotify-web-api-node');

const Items = require("./items.js");
const Track = Items.track;
const Artist = Items.artist;
const Playlist = Items.playlist;
const User = Items.user;

async function authorize(userID, fields) {
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

async function getUserData(userID) {
    return await User.findOne({_id: userID});
};

async function retrieveUserTracks(user) {
    try {
        return await Track.find({"_id": {$in: user.tracks}});
    } catch(error) {
        console.log(error);
    }
};

async function retrieveUserTrackFields(user, projection) {
    try {
        return await Track.find({"_id": {$in: user.tracks}}, projection);
    } catch(error) {
        console.log(error);
    }
};

function getAudioFeatureAverage(audioFeature, tracks) {
    try {
        const REDUCER = (accumulator, currentValue) => accumulator + currentValue[audioFeature];
        let total = tracks.reduce(REDUCER);
        return (total / tracks.length);
    } catch(error) {
        console.log(error);
    }
}

function getAudioFeatureDistribution(audioFeature, tracks) {
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

async function getTrackAudioAnalysis(trackID, spotifyAPI) {
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

function HSVtoRGB(payload) {
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

async function getTrackArtists(artistIDs, spotifyAPI) {
    
}

let analysis = function(socket) {
    let spotifyAPI = new SpotifyWebApi();
    let userID = null;

    // {accessToken: String}
    socket.on('inicialize_analysis', async function(data) {
        try {
            await spotifyAPI.setAccessToken(data.accessToken);
            let user = await spotifyAPI.getMe();
            userID = user.id;
            this.socket.emit('AnalysisReady');
        } catch(error) {
            console.log(error);
        }
    });

    socket.on('values', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'values'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });
    
    // {id: String}
    socket.on('album', async function(data) { 
        try {

        } catch(error) {
            console.log(error);
        }
    });

    // {id: String}
    socket.on('artist', async function(data) { 
        try {

        } catch(error) {
            console.log(error);
        }
    });

    // {id: String}
    socket.on('genre', async function(data) { 
        try {

        } catch(error) {
            console.log(error);
        }
    });

    // {id: String}
    socket.on('playlist', async function(data) { 
        try {

        } catch(error) {
            console.log(error);
        }
    });

    // {trackID: String}
    /*
        Track = {
        name: String,
        album: {
            name: String,
            image: String,
            relatedTracks: Array
        },
        artist: {
            name: String,
            followers: Number,
            likedTracks: Number
        },
        audioAnalysis: Array,
        audioFeatures: {
            valence: Number,
            energy: Number,
            danceability: Number,
            popularity: Number,
            +.3
            banger: Number,
            key: Number,
            mode: Number,
            tempo: Number,
            duration: Number,
        },
        percentile: {
            valence: Number,
            energy: Number,
            danceability: Number,
        },
        genre: Array,
        }
*/
    socket.on('track', async function(data) { 
        try {
            let track = await Track.find({_id: data.trackID});
            track.analysis = await getTrackAudioAnalysis(data.trackID, spotifyAPI);
            track.artists = await getTrackArtists(track.artists, spotifyAPI);
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, audioFeature: String}
    socket.on('feature_average_single', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'average', data.audioFeature])) {
                let projection = {};
                projection[data.audioFeature] = 1;
                let tracks = await retrieveUserTrackFields(await getUserData(userID), projection);
                let average = await getAudioFeatureAverage(data.audioFeature, tracks);
                socket.emit('FeatureAverage_' + data.audioFeature, {average: average});
            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('feature_average_all', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'average', 'all'])) {
                let tracks = await retrieveUserTracks(await getUserData(userID));
                let audioFeatures = ["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "loudness", "speechiness", "key", "mode", "tempo"];
                let averages = {};
                for (let i = 0; i < audioFeatures.length; i++) {
                    averages[audioFeatures[i]] = await getAudioFeatureAverage(audioFeatures[i], tracks);
                }
                socket.emit('FeatureAverage_All' + data.audioFeature, {average: averages});
            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, audioFeature: String}
    socket.on('feature_distribution_single', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'distribution', data.audioFeature])) {
                let projection = {};
                projection[data.audioFeature] = 1;
                let tracks = await retrieveUserTrackFields(await getUserData(userID), projection);
                let distribution = await getAudioFeatureDistribution(data.audioFeature, tracks);
                socket.emit('FeatureDistribution_' + data.audioFeature, {distribution: distribution});
            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('feature_distribution_all', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'distribution', 'all'])) {
                let tracks = await retrieveUserTracks(await getUserData(userID));
                let audioFeatures = ["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "loudness", "speechiness", "key", "mode", "tempo"];
                let distributions = {};
                for (let i = 0; i < audioFeatures.length; i++) {
                    distributions[audioFeatures[i]] = await getAudioFeatureDistribution(audioFeatures[i], tracks);
                }
                socket.emit('FeatureDistribution_All' + data.audioFeature, {distributions: distributions});
            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('timeline_added', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'added'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, audioFeature: String}
    socket.on('timeline_feature_single', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'features', data.audioFeature])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('timeline_feature_all', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'features', 'all'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, month: Number, year: Number}
    socket.on('timeline_month', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'months'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, year: Number}
    socket.on('timeline_year', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'years'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('timeline_artists', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'artists'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String}
    socket.on('timeline_genres', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'timeline', 'genres'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, offset: Number}
    socket.on('chart_played_tracks', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'topPlayed', 'tracks'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, offset: Number}
    socket.on('chart_played_artists', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'topPlayed', 'artists'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, offset: Number}
    socket.on('chart_saved_artists', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'topSaved', 'artists'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, offset: Number}
    socket.on('chart_saved_genres', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'topSaved', 'genres'])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, audioFeature: Number, offset: Number}
    socket.on('chart_extremes_max', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'extremes', data.audioFeature])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {userID: String, audioFeature: Number, offset: Number}
    socket.on('chart_extremes_min', async function(data) { 
        try {
            if (data.userID == userID || authorize(userID, ['privacy', 'extremes', data.audioFeature])) {

            }
        } catch(error) {
            console.log(error);
        }
    });

    // {query: String, offset: Number}
    socket.on('search', async function(data) { 

    });

    // {query: Object, offset: Number}
    socket.on('recommend', async function(data) { 

    });
}
  
module.exports = analysis;