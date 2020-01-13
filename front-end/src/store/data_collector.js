class DataCollector {
    constructor() {
        this.inicialized = false;
    }

    inicializeData(userID, instance) {
        this.userID = userID;
        this.instance = instance;
        this.audioFeatureAverages = {
            valence: null,
            danceability: null,
            energy: null,
            acousticness: null,
            instrumentalness: null,
            liveness: null,
            loudness: null,
            speechiness: null,
            key: null,
            mode: null,
            tempo: null,
        };
        this.audioFeatureDistributions = {
            valence: null,
            danceability: null,
            energy: null,
            acousticness: null,
            instrumentalness: null,
            liveness: null,
            loudness: null,
            speechiness: null,
            key: null,
            mode: null,
            tempo: null,
        };

        this.tracks = {};
        this.artists = {};
        this.genres = {};
        this.playlists = {};
        this.albums = {};

        this.history = {
            added: null,
            genres: null,
            artists: null,
            valence: null,
            danceability: null,
            energy: null,
            acousticness: null,
            instrumentalness: null,
            liveness: null,
            loudness: null,
            speechiness: null,
            key: null,
            mode: null,
            tempo: null,
        };

        this.yearAnalysis = null;
        this.monthAnalysis = null;

        this.trackAnalysis = null;
        this.albumAnalysis = null;
        this.artistAnalysis = null;
        this.genreAnalysis = null;
        this.playlistAnalysis = null;

        this.topPlayed = {
            tracks: [[],[],[]],
            artists: [[],[],[]],
        },
        this.topSaved = {
            genres: [[],[],[]],
            artists: [[],[],[]],
        },
        this.extremes = {
            audioFeature: null,
            min: [],
            max: [],
        },

        this.searchResults = [];
        this.recommends = [];

        this.inicialized = true;
    }

    valenceAverage() {
        try {
            if (this.audioFeatureAverages.valence == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "valence"});
            return this.audioFeatureAverages.valence;
        } catch(error) {
            console.log(error);
        }
    }

    danceabilityAverage() {
        try {
            if (this.audioFeatureAverages.danceability == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "danceability"});
            return this.audioFeatureAverages.danceability;
        } catch(error) {
            console.log(error);
        }
    }

    energyAverage() {
        try {
            if (this.audioFeatureAverages.energy == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "energy"});
            return this.audioFeatureAverages.energy;
        } catch(error) {
            console.log(error);
        }
    }

    acousticnessAverage() {
        try {
            if (this.audioFeatureAverages.acousticness == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "acousticness"});
            return this.audioFeatureAverages.acousticness;
        } catch(error) {
            console.log(error);
        }
    }

    instrumentalnessAverage() {
        try {
            if (this.audioFeatureAverages.instrumentalness == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "instrumentalness"});
            return this.audioFeatureAverages.instrumentalness;
        } catch(error) {
            console.log(error);
        }
    }

    livenessAverage() {
        try {
            if (this.audioFeatureAverages.liveness == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "liveness"});
            return this.audioFeatureAverages.liveness;
        } catch(error) {
            console.log(error);
        }
    }

    loudnessAverage() {
        try {
            if (this.audioFeatureAverages.loudness == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "loudness"});
            return this.audioFeatureAverages.loudness;
        } catch(error) {
            console.log(error);
        }
    }

    speechinessAverage() {
        try {
            if (this.audioFeatureAverages.speechiness == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "speechiness"});
            return this.audioFeatureAverages.speechiness;
        } catch(error) {
            console.log(error);
        }
    }

    keyAverage() {
        try {
            if (this.audioFeatureAverages.key == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "key"});
            return this.audioFeatureAverages.key;
        } catch(error) {
            console.log(error);
        }
    }

    modeAverage() {
        try {
            if (this.audioFeatureAverages.mode == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "mode"});
            return this.audioFeatureAverages.mode;
        } catch(error) {
            console.log(error);
        }
    }

    tempoAverage() {
        try {
            if (this.audioFeatureAverages.tempo == null) 
                this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: "tempo"});
            return this.audioFeatureAverages.tempo;
        } catch(error) {
            console.log(error);
        }
    }

    featureAverages() {
        try {
            let keys = Object.keys(this.audioFeatureAverages);
            let unsaved = [];
            for (let i = 0; i < keys.length; i++) {
                if (this.audioFeatureAverages[keys[i]] == null) {
                    unsaved.push(keys[i]);
                }
            }
            if (unsaved.length > 0 && unsaved.length > keys.length / 2) {
                this.instance.$socket.emit('feature_average_all', {userID: this.userID});
            } else {
                for (let i = 0; i < unsaved.length; i++) {
                    this.instance.$socket.emit('feature_average_single', {userID: this.userID, audioFeature: unsaved[i]});
                }
            }
            return this.audioFeatureAverages;
        } catch(error) {
            console.log(error);
        }
    }

    valenceDistribution() {
        try {
            if (this.audioFeatureDistributions.valence == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "valence"});
            return this.audioFeatureDistributions.valence;
        } catch(error) {
            console.log(error);
        }
    }

    danceabilityDistribution() {
        try {
            if (this.audioFeatureDistributions.danceability == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "danceability"});
            return this.audioFeatureDistributions.danceability;
        } catch(error) {
            console.log(error);
        }
    }

    energyDistribution() {
        try {
            if (this.audioFeatureDistributions.energy == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "energy"});
            return this.audioFeatureDistributions.energy;
        } catch(error) {
            console.log(error);
        }
    }

    acousticnessDistribution() {
        try {
            if (this.audioFeatureDistributions.acousticness == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "acousticness"});
            return this.audioFeatureDistributions.acousticness;
        } catch(error) {
            console.log(error);
        }
    }

    instrumentalnessDistribution() {
        try {
            if (this.audioFeatureDistributions.instrumentalness == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "instrumentalness"});
            return this.audioFeatureDistributions.instrumentalness;
        } catch(error) {
            console.log(error);
        }
    }

    livenessDistribution() {
        try {
            if (this.audioFeatureDistributions.liveness == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "liveness"});
            return this.audioFeatureDistributions.liveness;
        } catch(error) {
            console.log(error);
        }
    }

    loudnessDistribution() {
        try {
            if (this.audioFeatureDistributions.loudness == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "loudness"});
            return this.audioFeatureDistributions.loudness;
        } catch(error) {
            console.log(error);
        }
    }

    speechinessDistribution() {
        try {
            if (this.audioFeatureDistributions.speechiness == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "speechiness"});
            return this.audioFeatureDistributions.speechiness;
        } catch(error) {
            console.log(error);
        }
    }

    keyDistribution() {
        try {
            if (this.audioFeatureDistributions.key == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "key"});
            return this.audioFeatureDistributions.key;
        } catch(error) {
            console.log(error);
        }
    }

    modeDistribution() {
        try {
            if (this.audioFeatureDistributions.mode == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "mode"});
            return this.audioFeatureDistributions.mode;
        } catch(error) {
            console.log(error);
        }
    }

    tempoDistribution() {
        try {
            if (this.audioFeatureDistributions.tempo == null) 
                this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: "tempo"});
            return this.audioFeatureDistributions.tempo;
        } catch(error) {
            console.log(error);
        }
    }

    featureAverages() {
        try {
            let keys = Object.keys(this.audioFeatureDistributions);
            let unsaved = [];
            for (let i = 0; i < keys.length; i++) {
                if (this.audioFeatureDistributions[keys[i]] == null) {
                    unsaved.push(keys[i]);
                }
            }
            if (unsaved.length > 0 && unsaved.length > keys.length / 2) {
                this.instance.$socket.emit('feature_distribution_all', {userID: this.userID});
            } else {
                for (let i = 0; i < unsaved.length; i++) {
                    this.instance.$socket.emit('feature_distribution_single', {userID: this.userID, audioFeature: unsaved[i]});
                }
            }
            return this.audioFeatureDistributions;
        } catch(error) {
            console.log(error);
        }
    }

    timelineAdded() {
        try {
            if (this.history.added == null) 
                this.instance.$socket.emit('timeline_added', {userID: this.userID});
            return this.history.added;
        } catch(error) {
            console.log(error);
        }
    }

    timelineGenres() {
        try {
            if (this.history.genres == null) 
                this.instance.$socket.emit('timeline_genres', {userID: this.userID});
            return this.history.genres;
        } catch(error) {
            console.log(error);
        }
    }

    timelineArtists() {
        try {
            if (this.history.artists == null) 
                this.instance.$socket.emit('timeline_artists', {userID: this.userID});
            return this.history.artists;
        } catch(error) {
            console.log(error);
        }
    }

    timelineValence() {
        try {
            if (this.history.valence == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "valence"});
            return this.history.valence;
        } catch(error) {
            console.log(error);
        }
    }

    timelineDanceability() {
        try {
            if (this.history.danceability == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "danceability"});
            return this.history.danceability;
        } catch(error) {
            console.log(error);
        }
    }

    timelineEnergy() {
        try {
            if (this.history.energy == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "energy"});
            return this.history.energy;
        } catch(error) {
            console.log(error);
        }
    }

    timelineAcousticness() {
        try {
            if (this.history.acousticness == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "acousticness"});
            return this.history.acousticness;
        } catch(error) {
            console.log(error);
        }
    }

    timelineInstrumentalness() {
        try {
            if (this.history.instrumentalness == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "instrumentalness"});
            return this.history.instrumentalness;
        } catch(error) {
            console.log(error);
        }
    }

    timelineLiveness() {
        try {
            if (this.history.liveness == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "liveness"});
            return this.history.liveness;
        } catch(error) {
            console.log(error);
        }
    }

    timelineLoudness() {
        try {
            if (this.history.loudness == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "loudness"});
            return this.history.loudness;
        } catch(error) {
            console.log(error);
        }
    }

    timelineSpeechiness() {
        try {
            if (this.history.speechiness == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "speechiness"});
            return this.history.speechiness;
        } catch(error) {
            console.log(error);
        }
    }

    timelineKey() {
        try {
            if (this.history.key == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "key"});
            return this.history.key;
        } catch(error) {
            console.log(error);
        }
    }

    timelineMode() {
        try {
            if (this.history.mode == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "mode"});
            return this.history.mode;
        } catch(error) {
            console.log(error);
        }
    }

    timelineTempo() {
        try {
            if (this.history.tempo == null) 
                this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: "tempo"});
            return this.history.tempo;
        } catch(error) {
            console.log(error);
        }
    }

    timelineFeatures() {
        try {
            let keys = ["valence", "danceability", "energy", "acousticness", "instrumentalness", "liveness", "loudness", "speechiness", "key", "mode", "tempo"];
            let unsaved = [];
            for (let i = 0; i < keys.length; i++) {
                if (this.history[keys[i]] == null) {
                    unsaved.push(keys[i]);
                }
            }
            if (unsaved.length > 0 && unsaved.length > keys.length / 2) {
                this.instance.$socket.emit('timeline_feature_all', {userID: this.userID});
            } else {
                for (let i = 0; i < unsaved.length; i++) {
                    this.instance.$socket.emit('timeline_feature_single', {userID: this.userID, audioFeature: unsaved[i]});
                }
            }
            return this.history;
        } catch(error) {
            console.log(error);
        }
    }

    year(year) {
        try {
            if (this.yearAnalysis == null || this.yearAnalysis.year != year) 
                this.instance.$socket.emit('timeline_year', {userID: this.userID, year: year});
            return this.yearAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    month(month, year) {
        try {
            if (this.monthAnalysis == null || this.monthAnalysis.year != year || this.monthAnalysis.month != month) 
                this.instance.$socket.emit('timeline_month', {userID: this.userID, month: month, year: year});
            return this.monthAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    track(trackID) {
        try {
            if (this.trackAnalysis == null || this.trackAnalysis._id != trackID) 
                this.instance.$socket.emit('track', {trackID: trackID});
            return this.trackAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    album(albumID) {
        try {
            if (this.albumAnalysis == null || this.albumAnalysis._id != albumID) 
                this.instance.$socket.emit('album', {albumID: albumID});
            return this.albumAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    artist(artistID) {
        try {
            if (this.artistAnalysis == null || this.artistAnalysis._id != artistID) 
                this.instance.$socket.emit('artist', {artistID: artistID});
            return this.artistAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    genre(genreID) {
        try {
            if (this.genreAnalysis == null || this.genreAnalysis._id != genreID) 
                this.instance.$socket.emit('genre', {genreID: genreID});
            return this.genreAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    playlist(playlistID) {
        try {
            if (this.playlistAnalysis == null || this.playlistAnalysis._id != playlistID) 
                this.instance.$socket.emit('playlist', {userID: this.userID, playlistID: playlistID});
            return this.playlistAnalysis;
        } catch(error) {
            console.log(error);
        }
    }

    topPlayedTracks(time) {
        try {
            if (this.topPlayed.tracks[time].length == 0)
                this.instance.$socket.emit('chart_played_tracks', {userID: this.userID, offset: 0});
            return this.topPlayed.tracks[time];
        } catch(error) {
            console.log(error);
        }
    }

    topPlayedArtists(time) {
        try {
            if (this.topPlayed.artists[time].length == 0)
                this.instance.$socket.emit('chart_played_artists', {userID: this.userID, offset: 0});
            return this.topPlayed.artists[time];
        } catch(error) {
            console.log(error);
        }
    }

    topSavedArtists(time) {
        try {
            if (this.topSaved.artists[time].length == 0)
                this.instance.$socket.emit('chart_saved_artists', {userID: this.userID, offset: 0});
            return this.topSaved.artists[time];
        } catch(error) {
            console.log(error);
        }
    }

    topSavedGenres(time) {
        try {
            if (this.topSaved.genres[time].length == 0)
                this.instance.$socket.emit('chart_saved_genres', {userID: this.userID, offset: 0});
            return this.topSaved.genres[time];
        } catch(error) {
            console.log(error);
        }
    }

    extremes(audioFeature, isMax) {
        try {
            if (this.extremes.audioFeature == null || this.extremes.audioFeature != audioFeature) {
                
            }
            if (this.topSaved.genres[time].length == 0)
                this.instance.$socket.emit('chart_saved_genres', {userID: this.userID, offset: 0});
            return this.topSaved.genres[time];
        } catch(error) {
            console.log(error);
        }
    }



}

module.exports = {
    class: DataCollector
}