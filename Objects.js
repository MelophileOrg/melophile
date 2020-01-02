//FeatureGraph
let graph_data = {
    title: String, 
    feature: String,
    bars: [
        Number,
    ],
    xAxis: {
        title: String,
        minValue: String,
        maxValue: String,
    },
    yAxis: {
        title: String,
    },
    width: Number,
    height: Number,
}








let Track = {
    id: String,
    name: String,
    artists: Array, // IDs
    album: String,  // ID
    image: String,

    key: Number,
    mode: Number,
    tempo: Number,

    valence: Number,
    danceability: Number,
    energy: Number,

    acousticness: Number,
    instrumentalness: Number,
    liveness: Number,
    loudness: Number,
    speechiness: Number,

    analysis: Array,
}

let Artist = {
    id: String,
    name: String, 

    images: Array,
    

}