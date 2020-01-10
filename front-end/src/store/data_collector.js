class DataCollector {
    constructor() {
        this.inicializeData();
    }

    inicializeData() {
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
            min: [],
            max: [],
        },

        this.searchResults = [];
        this.recommends = [];
    }

    

}

module.exports = {
    class: DataCollector
}