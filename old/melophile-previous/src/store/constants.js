const AUDIO_FEATURES = {
    acousticness: {
        color: {red: 237, green: 201, blue: 72},
        title: "Acousticness",
        minTag: "Synthasized",
        maxTag: "Acoustic",
        description: "Confidence measure of whether the track is accoustic.",
    },
    danceability: {
        color: {red: 210, green: 17, blue: 254},
        title: "Danceability",
        minTag: "Couch Potato",
        maxTag: "Let's Dance!",
        description: "Confidence measure of how suitable a track is for dancing. Based on tempo, rhythm stability, beat strength and overall regularity.",
    },
    energy: {
        color: {red: 7, green: 129, blue: 255},
        title: "Energy",
        minTag: "Peaceful",
        maxTag: "Hyper",
        description: "Measure of intensity and activity. Based on dynamic range, perceived loudness, timbre, onset rate and genreal entropy.",
    },
    instrumentalness: {
        color: {red: 255, green: 157, blue: 167},
        title: "Instrumentalness",
        minTag: "Singing",
        maxTag: "Instruments",
        description: "Prediction of whether a track contains no vocals.",
    },
    liveness: {
        color: {red: 176, green: 122, blue: 161},
        title: "Liveness",
        minTag: "Recorded",
        maxTag: "Live",
        description: "Detects the presence of an audience in recording.",
    },
    loudness: {
        color: {red: 242, green: 142, blue: 43},
        title: "Loudness",
        minTag: "Quiet",
        maxTag: "Loud",
        description: "Overall loudness of a track in decibels (dB). Values are averages across the entire track.",
    },
    speechiness: {
        color: {red: 156, green: 117, blue: 95},
        title: "Speechiness",
        minTag: "Singing",
        maxTag: "Talking",
        description: "Detects the presence of spoken words in a track. Higher values suggest more speech-like recordings (e.g. talk show, audio book, poetry).",
    },
    valence: {
        color: {red: 82, green: 227, blue: 194},
        title: "Happiness",
        minTag: "Depressing",
        maxTag: "Cheerful",
        description: "The general musical positiveness conveyed by the track. High values are happier, cheerful or euphoric, while low values are sad, depressed, angry.",
    },
    tempo: {
        color: {red: 225, green: 87, blue: 89},
        title: "Tempo",
        minTag: "Slow",
        maxTag: "Fast",
        description: "The estimated tempo of a track in beats per minute (BPM).",
    },
    banger: {
        color: {red: 225, green: 87, blue: 89},
        title: "Bangerable",
        minTag: "*Snore*",
        maxTag: "Bangers",
        description: "Estimate for a tracks suitability in a party environment, based on its energy, danceability and tempo.",
    },
    major: {
        color: {red: 74, green: 189, blue: 180},
    },
    minor: {
        color: {red: 180, green: 189, blue: 74},
    },
    mode: {
        title: "Mode",
        minTag: "Minor Key",
        maxTag: "Major Key",
        description: "Modality (major or minor) of a track. High value is major, low is minor.",
    }
}

module.exports = {
    audioFeatures: AUDIO_FEATURES
}