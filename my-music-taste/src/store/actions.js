////////////////////////////////////////////////////////////////
// INICIALIZATION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const inicializeGetToken = (context) => {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = '42903eeb2bf943c4bd4903370f7a93f5';
    let redirectUri = 'http://mymusic.andrewdanielyoung.com/redirect/';
    if (context.state.dev)
        redirectUri = 'http://localhost:8080/redirect/';
    const scopes = [
        'user-read-recently-played',
        'user-top-read',
        'user-library-read',
        'user-read-email',
    ];
    if (!context.state.access_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }
};
// None
const inicializeParseToken = (context) => {
    let token = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    context.dispatch('inicializeSetToken', token.access_token);
};
// Token
const inicializeSetToken = async (context, token) => {
    await context.state.spotifyApi.setAccessToken(token);
    await context.commit('setInicialized', true);
    context.dispatch('getUser');
};
////////////////////////////////////////////////////////////////
// LOAD PROGRESS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// None
const loadLibrary = async (context) => {
    context.commit('resetProgress');
    await context.dispatch('retrieveSavedTracks', {limit: 50, offset: 0});
    await context.dispatch('retrieveTopPlayed');
    await context.dispatch('calcTracksPerGenre');
    await context.dispatch('calcExtremes');
};
// {limit: Number, offset: Number}
const retrieveSavedTracks = async (context, payload) => {
    let response = await context.dispatch('getSavedTracks', {limit: payload.limit, offset: payload.offset});
    if (payload.offset == 0)
        context.commit('setTotal', response.total);
    await context.dispatch('processTracks', response.items);
    if (response.items.length == payload.limit)
        await context.dispatch('retrieveSavedTracks', {limit: 50, offset: payload.offset + payload.limit});
    else {
        let keys = Object.keys(context.state.audioFeatures);
        for (let i = 0; i < keys.length; i++) {
            await context.commit('averageAudioFeatureValue', keys[i]);
        }
        await context.commit('averageMode');
        await context.commit('averageValenceOverTime');
        context.commit('setTracksLoaded');
    }
};
// Track Array
const processTracks = async (context, payload) => {
    let ids = await context.dispatch('inicialScanReduceIds', payload);
    let trackAudioFeatures = await context.dispatch('getAudioFeaturesForTracks', ids);
    let now = new Date();
    let nowTime = now.getTime();
    const MONTH = 2626560000;
    for (let i = 0; i < trackAudioFeatures.length; i++) {
        trackAudioFeatures[i].banger = await context.dispatch('bangerCalc', {tempo: trackAudioFeatures[i].tempo, energy: trackAudioFeatures[i].energy, danceability: trackAudioFeatures[i].danceability});
        let addedDate = new Date(context.state.tracks[trackAudioFeatures[i].id].date);
        let addedDateTime = addedDate.getTime();
        await context.commit('addValenceOverTime', {month: Math.floor((nowTime - addedDateTime) / MONTH), value:  trackAudioFeatures[i].valence});
    }
    await context.dispatch('distributeTrackAudioFeatures', trackAudioFeatures);
};
// Track Array
const inicialScanReduceIds = async (context, payload) => {
    let ids = [];
    let artistsToFind = {};
    let now = new Date();
    let nowTime = now.getTime();
    const MONTH = 2626560000;
    for (let i = 0; i < payload.length; i++) {
        let trackObject = payload[i].track;
        for (let j = 0; j < trackObject.artists.length; j++) {
            if (!(trackObject.artists[j].id in context.state.artists)) {
                if (!(trackObject.artists[j].id in artistsToFind))
                    artistsToFind[trackObject.artists[j].id] = {id: trackObject.artists[j].id, tracks: [trackObject.id]};
                else {
                    if (!(artistsToFind[trackObject.artists[j].id].tracks.includes(trackObject.id)))
                        artistsToFind[trackObject.artists[j].id].tracks.push(trackObject.id);
                }
            }
            else
                context.commit('addTrackToArtist', {id: trackObject.artists[j].id, track: trackObject.id});
            trackObject.artists[j] = trackObject.artists[j].id;
        }
        trackObject.date = payload[i].added_at;
        let addedDate = new Date(trackObject.date);
        let addedDateTime = addedDate.getTime();
        context.commit('addDateAddedTrack', Math.floor((nowTime - addedDateTime) / MONTH));
        delete trackObject.album.album_type;
        delete trackObject.album.artists;
        delete trackObject.album.available_markets;
        delete trackObject.album.available_markets;
        trackObject.album.href = trackObject.album.external_urls.spotify;
        delete trackObject.album.type;
        delete trackObject.album.uri;
        delete trackObject.available_markets;
        delete trackObject.disc_number;
        delete trackObject.external_ids;
        trackObject.href = trackObject.external_urls.spotify;
        delete trackObject.external_urls;
        delete trackObject.type;
        delete trackObject.uri;
        if (trackObject.album.images.length > 1)
            trackObject.image = trackObject.album.images[0].url;
        ids.push(trackObject.id);
        context.commit('pushTrack', {id: trackObject.id, value: trackObject});
        context.commit('addProcessed');
    }
    await context.dispatch('findAndStoreArtists', artistsToFind);
    return ids;
};
// Array {id: String, tracks: [String]}
const findAndStoreArtists = async (context, payload) => {
    let ids = Object.values(payload).map(artist => artist.id);
    let trackSets = Object.values(payload).map(artist => artist.tracks);
    let artists = [];
    while (ids.length > 0) {
        let sectionIds = ids.splice(0, 50);
        let newArtists = await context.dispatch('getArtists', sectionIds);
        artists = artists.concat(newArtists);
    }
    for (let i = 0; i < artists.length; i++) {
        let artistObject = artists[i];
        artistObject.href = artistObject.external_urls.spotify;
        delete artistObject.external_urls;
        artistObject.followers = artistObject.followers.total;
        for (let j = 0; j < artistObject.genres.length; j++) {
            if (!(artistObject.genres[j] in context.state.genres))  
                await context.commit('pushGenre', {id: artistObject.genres[j], value: {name: artistObject.genres[j], artists: [artistObject.id], tracknum: 0}});
            else 
                await context.commit('addArtistToGenre', {id: artistObject.genres[j], artist: artistObject.id});
        }
        delete artistObject.type;
        delete artistObject.uri;
        if (artistObject.images.length > 0)
            artistObject.image = artistObject.images[0].url;
        delete artistObject.images;
        artistObject.tracks = trackSets[i];
        await context.commit('pushArtist', {id: artistObject.id, value: artistObject});
    }
};
// Audio Features Array
const distributeTrackAudioFeatures = async (context, payload) => {
    let keys = Object.keys(context.state.audioFeatures);
    let values = {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        instrumentalness: 0,
        liveness: 0,
        loudness: 0,
        speechiness: 0,
        valence: 0,
        tempo: 0,
        banger: 0,
    };
    for (let i = 0; i < payload.length; i++) {
        for (let j = 0; j < keys.length; j++) {
            values[keys[j]] += payload[i][keys[j]];
            context.commit('plotAudioFeatureValue', {key: keys[j], value: payload[i][keys[j]]});
        }
        context.commit('addMode', payload[i].mode);
        await context.commit('addTrackProperties', {id: payload[i].id, properties: {
            danceability: payload[i].danceability,
            energy: payload[i].energy,
            key: payload[i].key,
            loudness: payload[i].loudness,
            mode: payload[i].mode,
            speechiness: payload[i].speechiness,
            acousticness: payload[i].acousticness,
            instrumentalness: payload[i].instrumentalness,
            liveness: payload[i].liveness,
            valence: payload[i].valence,
            tempo: payload[i].tempo,
            duration_ms: payload[i].duration_ms,
            time_signature: payload[i].time_signature,
            banger: payload[i].banger,
        }});
    }
    for (let i = 0; i < keys.length; i++) {
        await context.commit('addAudioFeatureValue', {key: keys[i], value: values[keys[i]]});
    }   
};
const calcTracksPerGenre = async (context) => {
    let artistIds = Object.keys(context.state.artists);
    for (let i = 0; i < artistIds.length; i++) {
        for (let j = 0; j < context.state.artists[artistIds[i]].genres.length; j++) {
            await context.commit('addGenreTrackNum', {id: context.state.artists[artistIds[i]].genres[j], value: context.state.artists[artistIds[i]].tracks.length});
        }
    }
    let genreTuples = Object.entries(context.state.genres);
    let topGenres = genreTuples.sort((a,b) => b[1].tracknum - a[1].tracknum).slice(0,50);
    let topGenreIds = topGenres.map(genre => genre[0]);
    context.commit('setTopSavedGenres', topGenreIds);
    let artistTuples = Object.entries(context.state.artists);
    let topArtists = artistTuples.sort((a,b) => b[1].tracks.length - a[1].tracks.length).slice(0,50);
    let topArtistIds = topArtists.map(artist => artist[0]);
    context.commit('setTopSavedArtists', topArtistIds);
    context.commit('setArtistsLoaded');
    context.commit('setGenresLoaded');
};
const calcExtremes = async (context) => {
    let keys = Object.keys(context.state.audioFeatures);
    let trackTuples = Object.entries(context.state.tracks);
    let charts = ["minchart", "maxchart"];
    let topTracks;
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < charts.length; j++) {
            if (charts[j] == "minchart") {
                topTracks = trackTuples.sort((a,b) => a[1][keys[i]] - b[1][keys[i]]).slice(0,25);
            }
            else {
                topTracks = trackTuples.sort((a,b) => b[1][keys[i]] - a[1][keys[i]]).slice(0,25);
            }
            let topTracksIds = topTracks.map(track => track[0]);
            context.commit('setAudioFeatureChart', {key: keys[i], chart: [charts[j]], value: topTracksIds});
        }
    }
    context.commit('setExtremesLoaded');
};
const retrieveTopPlayed = async (context) => {
    await context.dispatch('retrieveTopPlayedArtists');
    await context.dispatch('retrieveTopPlayedTracks');
};
const retrieveTopPlayedArtists = async (context) => {
    let ranges = ['short_term', 'medium_term', 'long_term'];
    for (let i = 0; i < ranges.length; i++) {
        let artists = await context.dispatch('getTopArtists', {limit: 50, time_range: ranges[i], offset: 0});
        let ids = [];
        for (let j = 0; j < artists.length; j++) {
            ids.push(artists[j].id);
            if (!(artists[j].id in context.state.artists)) {
                let artistObject = artists[j];
                artistObject.href = artistObject.external_urls.spotify;
                delete artistObject.external_urls;
                artistObject.followers = artistObject.followers.total;
                delete artistObject.type;
                delete artistObject.uri;
                context.commit('pushArtist', {id: artists[j].id, value: artistObject});
            }
        }
        context.commit('setTopPlayedArtists', {index: i, value: ids});
    }
};
const retrieveTopPlayedTracks = async (context) => {
    let ranges = ['short_term', 'medium_term', 'long_term'];
    for (let i = 0; i < ranges.length; i++) {
        let tracks = await context.dispatch('getTopTracks', {limit: 50, time_range: ranges[i], offset: 0});
        let ids = [];
        for (let j = 0; j < tracks.length; j++) {
            ids.push(tracks[j].id);
            if (!(tracks[j].id in context.state.tracks)) {
                let trackObject = tracks[j];
                delete trackObject.album.album_type;
                delete trackObject.album.artists;
                delete trackObject.album.available_markets;
                delete trackObject.album.available_markets;
                trackObject.album.href = trackObject.album.external_urls.spotify;
                delete trackObject.album.type;
                delete trackObject.album.uri;
                delete trackObject.available_markets;
                delete trackObject.disc_number;
                delete trackObject.external_ids;
                trackObject.href = trackObject.external_urls.spotify;
                delete trackObject.external_urls;
                delete trackObject.type;
                delete trackObject.uri;
                context.commit('pushTrack', {id: tracks[j].id, value: trackObject});
            }
        }
        context.commit('setTopPlayedTracks', {index: i, value: ids});
    }
};
////////////////////////////////////////////////////////////////
// AUDIO FEATURES //////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {tempo: Number, energy: Number, danceability: Number}
const bangerCalc = async (context, payload) => {
    return ((payload.tempo - 96 + (payload.energy * 100) + (payload.danceability*50)) / 210);
}
////////////////////////////////////////////////////////////////
// SAVE LIBRARY ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {name: String, privacy: Boolean, include: Object}
// INCLUDE ITEM               KEY                        PUBLIC REQ
// Numerical Data: True.      numerical_data             True
// Most Saved Artists:        most_saved_artists         
// Audio Features: True.      audio_features             True
// Top Saved Genres:          most_saved_genres
// Numerical Features:        numerical_features
// Probability Features:      probability_features
// Date Added Timeline:       added_timeline
// Happiness Distribution:    happiness_distribution
// Energy Distribution:       energy_distribution
// Danceability Distribution: danceability_distribution
// Banger Distribution:       banger_distribution
// Top 30 Songs:              most_played_tracks          True
// Top 30 Artists:            most_played_artists         True
// Extremes Top 10:           extremes
const saveLibrary = async (context, payload) => {
    if (!payload.private && !payload.include.numerical_data && !payload.include.audio_features && !payload.include.most_played_tracks && !payload.include.most_played_artists)
        return null;
    let data = {};
    data.include = payload.include;
    data.name = payload.name;
    data.private = payload.private;
    data.tracks = await context.dispatch('convertTracks', payload.include);
    data.artists = await context.dispatch('convertArtists', payload.include);
    data.genres = await context.dispatch('convertGenres', payload.include);
    if (payload.include.numerical_data)
        data.numerical_data = {total: context.state.progress.total, artists: (Object.keys(context.state.artists)).length, genres: (Object.keys(context.state.genres)).length};
    if (payload.include.most_saved_artists || payload.include.most_saved_genres) {
        data.topSaved = {};
        if (payload.include.most_saved_artists)
            data.topSaved.artists = context.state.topSaved.artists;
        if (payload.include.most_saved_genres)
            data.topSaved.genres = context.state.topSaved.genres;
    }
    if (payload.include.most_played_tracks || payload.include.most_played_artists) {
        data.topPlayed = {};
        if (payload.include.most_played_tracks) 
            data.topPlayed.tracks = context.state.topPlayed.tracks;
        if (payload.include.most_played_artists) 
            data.topPlayed.artists = context.state.topPlayed.artists;
    }
    if (payload.include.audio_features || payload.include.numerical_features || payload.include.extremes || payload.include.probability_features) {
        data.audioFeatures = {
            acousticness: {},
            danceability: {},
            energy: {},
            instrumentalness: {},
            liveness: {},
            loudness: {},
            speechiness: {},
            tempo: {},
            valence: {},
            banger: {},
        };
        if (payload.include.audio_features) {
            data.audioFeatures.valence.value = context.state.audioFeatures.valence.value;
            data.audioFeatures.energy.value = context.state.audioFeatures.energy.value;
            data.audioFeatures.danceability.value = context.state.audioFeatures.danceability.value;
        }
        if (payload.include.probability_features) {
            data.audioFeatures.acousticness.value = context.state.audioFeatures.acousticness.value;
            data.audioFeatures.instrumentalness.value = context.state.audioFeatures.instrumentalness.value;
            data.audioFeatures.liveness.value = context.state.audioFeatures.liveness.value;
            data.audioFeatures.speechiness.value = context.state.audioFeatures.speechiness.value;
        }
        if (payload.include.extremes) {
            let keys = Object.keys(data.audioFeatures);
            let charts = ["minchart", "maxchart"]
            for (let i = 0; i < keys.length; i++) {
                for (let j = 0; j < charts.length; j++) {
                    data.audioFeatures[keys[i]][charts[j]] = context.state.audioFeatures[keys[i]][charts[j]];
                }
            }
        }
        if (payload.include.happiness_distribution) {
            data.audioFeatures.valence.plot = context.state.audioFeatures.valence.plot;
        }
        if (payload.include.energy_distribution) {
            data.audioFeatures.energy.plot = context.state.audioFeatures.energy.plot;
        }
        if (payload.include.danceability_distribution) {
            data.audioFeatures.danceability.plot = context.state.audioFeatures.danceability.plot;
        }
        if (payload.include.banger_distribution) {
            data.audioFeatures.banger.plot = context.state.audioFeatures.banger.plot;
        }
    }
    if (payload.include.added_timeline) 
        data.dateAdded = context.state.dateAdded;
    return data;
};
// Include Object
const convertTracks = async (context, payload) => {
    let reqTracks = {};
    let addTracks = [];
    if (payload.most_played_tracks)
        addTracks = addTracks.concat(await context.dispatch('gatherMostPlayedTracks'));
    if (payload.extremes) 
        addTracks = addTracks.concat(await context.dispatch('gatherExtremes'));
    let nonRepeatedTracks = {};
    for (let i = 0; i < addTracks.length; i++) {
        if (!(addTracks[i] in nonRepeatedTracks))
            nonRepeatedTracks[addTracks[i]] = 0;
        else {
            nonRepeatedTracks[addTracks[i]] += 1;
        }
    }
    let ids = Object.keys(nonRepeatedTracks);
    for (let i = 0; i < ids.length; i++) {
        reqTracks[ids[i]] = await context.dispatch("compressTrack", context.state.tracks[ids[i]]);
    }
    return reqTracks;
};
// Nothing
const gatherMostPlayedTracks = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topPlayed.tracks.length; i++) {
        for (let j = 0; j < context.state.topPlayed.tracks[i].length && j < 20; j++) {
            ids.push(context.state.topPlayed.tracks[i][j]);
        }
    }
    return ids;
}
// Nothing
const gatherExtremes = async (context) => {
    let keys = Object.keys(context.state.audioFeatures);
    let charts = ["minchart", "maxchart"];
    let ids = [];
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < charts.length; j++) {
            for (let k = 0; k < context.state.audioFeatures[keys[i]][charts[j]].length && k < 10; k++) {
                ids.push(context.state.audioFeatures[keys[i]][charts[j]][k]);
            }
        }
    }
    return ids;
}
// Track object
const compressTrack = async (context, payload) => {
    return {name: payload.name, image: payload.album.images[0].url, artists: payload.artists};
};
// None
const convertArtists = async (context, payload) => {
    let reqArtists = {};
    let addArtists = [];
    if (payload.most_played_artists)
        addArtists = addArtists.concat(await context.dispatch('gatherMostPlayedArtists'));
    if (payload.most_saved_artists) 
        addArtists = addArtists.concat(await context.dispatch('gatherMostSavedArtists'));
    let nonRepeatedArtists = {};
    for (let i = 0; i < addArtists.length; i++) {
        if (!(addArtists[i] in nonRepeatedArtists))
            nonRepeatedArtists[addArtists[i]] = 0;
        else {
            nonRepeatedArtists[addArtists[i]] += 1;
        }
    }
    let ids = Object.keys(nonRepeatedArtists);
    for (let i = 0; i < ids.length; i++) {
        reqArtists[ids[i]] = await context.dispatch("compressArtist", context.state.artists[ids[i]]);
    }
    return reqArtists;
};
// Nothing
const gatherMostPlayedArtists = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topPlayed.artists.length; i++) {
        for (let j = 0; j < context.state.topPlayed.artists[i].length && j < 20; j++) {
            ids.push(context.state.topPlayed.artists[i][j]);
        }
    }
    return ids;
};
// Nothing
const gatherMostSavedArtists = async (context) => {
    let ids = [];
    for (let i = 0; i < context.state.topSaved.artists.length; i++) {
        ids.push(context.state.topSaved.artists[i]);
    }
    return ids;
};
// Track object
const compressArtist = async (context, payload) => {
    return {name: payload.name, image: payload.images[0].url, genres: payload.genres};
};
// Include Object
const convertGenres = async (context, payload) => {
    let reqGenres = {};
    if (payload.most_saved_genres) {
        for (let i = 0; i < context.state.topSaved.genres.length; i++) {
            reqGenres[context.state.topSaved.genres[i]] = context.state.genres[context.state.topSaved.genres[i]];
        }
    }
    return reqGenres;
};

////////////////////////////////////////////////////////////////
// ANALYSIS ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/*
    album: {album_type: "album", artists: Array(1), available_markets: Array(78), external_urls: {…}, href: "https://api.spotify.com/v1/albums/5MmMomspau1V5YpXjHYJRy", …}
    artists: [{…}]
    available_markets: (78) ["AD", "AE", "AR", "AT", "AU", "BE", "BG", "BH", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "DZ", "EC", "EE", "EG", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IL", "IN", "IS", "IT", "JO", "KW", "LB", "LI", "LT", "LU", "LV", "MA", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "OM", "PA", "PE", "PH", "PL", "PS", "PT", "PY", "QA", "RO", "SA", "SE", "SG", "SK", "SV", "TH", "TN", "TR", "TW", "US", "UY", "VN", "ZA"]
    disc_number: 1
    duration_ms: 296899
    explicit: false
    external_ids: {isrc: "GBCFB1200106"}
    external_urls: {spotify: "https://open.spotify.com/track/74Csq5DMaOBShLUhI6NU5A"}
    href: "https://api.spotify.com/v1/tracks/74Csq5DMaOBShLUhI6NU5A"
    id: "74Csq5DMaOBShLUhI6NU5A"
    is_local: false
    name: "Curse Me Good"
    popularity: 50
    preview_url: "https://p.scdn.co/mp3-preview/ea8af91eefd28faf2ab5c73b6dc5a596bf0d5b9b?cid=42903eeb2bf943c4bd4903370f7a93f5"
    track_number: 2
    type: "track"
    uri: "spotify:track:74


    acousticness: 0.0105
    album: {external_urls: {…}, href: "https://open.spotify.com/album/5MmMomspau1V5YpXjHYJRy", id: "5MmMomspau1V5YpXjHYJRy", images: Array(3), name: "The Glorious Dead", …}
    artists: ["0bZCak2tcRMY1dzEIuwF42"]
    banger: 0.6849999999999999
    danceability: 0.809
    date: "2018-09-23T23:34:33Z"
    duration_ms: 296900
    energy: 0.814
    explicit: false
    href: "https://open.spotify.com/track/74Csq5DMaOBShLUhI6NU5A"
    id: "74Csq5DMaOBShLUhI6NU5A"
    instrumentalness: 0.0000248
    is_local: false
    key: 6
    liveness: 0.099
    loudness: -6.829
    mode: 0
    name: "Curse Me Good"
    popularity: 50
    preview_url: "https://p.scdn.co/mp3-preview/ea8af91eefd28faf2ab5c73b6dc5a596bf0d5b9b?cid=42903eeb2bf943c4bd4903370f7a93f5"
    speechiness: 0.0338
    tempo: 118
    time_signature: 4
    track_number: 2
    valence: 0.804
*/
const songAnalysis = async (context, id) => {
    let trackData;
    trackData = await context.dispatch('getTrack', id);
    trackData = await context.dispatch('songAnalysisFeatures', {trackData: trackData, id: id});
    trackData.audioAnalysis = await context.dispatch('cleanAudioAnalysis', {id: id});
    return trackData;
};
// {id: String}
const songAnalysisFeatures = async (context, payload) => {
    let song = payload.trackData;
    let audioFeatures = await context.dispatch('getAudioFeaturesForTrack', payload.id);
    song.acousticness = audioFeatures.acousticness;
    song.danceability = audioFeatures.danceability;
    song.energy = audioFeatures.energy;
    song.instrumentalness = audioFeatures.instrumentalness;
    song.key = audioFeatures.key;
    song.liveness = audioFeatures.liveness;
    song.loudness = audioFeatures.loudness;
    song.mode = audioFeatures.mode;
    song.speechiness = audioFeatures.speechiness;
    song.tempo = audioFeatures.tempo;
    song.valence = audioFeatures.valence;
    return song;
};
const cleanAudioAnalysis = async (context, payload) => {
    let audioAnalysisSegments = 80;
    let audioAnalysis = await context.dispatch('getAudioAnalysisForTrack', payload.id);
    let newSegments = [];
    if (audioAnalysis.segments.length < audioAnalysisSegments)
        audioAnalysisSegments = audioAnalysis.segments.length;
    let width = Math.round(audioAnalysis.segments.length / audioAnalysisSegments);
    
    for (var i = 0; i < audioAnalysisSegments; i++)
    {
        let itemIndex = Math.round(width * i);
        if (itemIndex > audioAnalysis.segments.length - 1)
        {
            itemIndex = audioAnalysis.segments.length - 2;
        }
        let sum = 0;
        for (var j = 0; j < audioAnalysis.segments[itemIndex].pitches.length; j++)
        {
            sum += audioAnalysis.segments[itemIndex].pitches[j];
        }
        let averagePitch = sum / audioAnalysis.segments[itemIndex].pitches.length; 
        let color = await context.dispatch('HSVtoRGB', {hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
        let loudness = (Math.round(((audioAnalysis.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);

        newSegments.push({
            start: Math.round(audioAnalysis.segments[itemIndex].start),
            loudness_max: loudness, 
            red: color.r,
            green: color.g,
            blue: color.b,
        });
    }
    audioAnalysis.segments = null;
    return newSegments
};
const getPercentiles = async (context, payload) => {
    let ids = Object.keys(context.state.tracks);
    let keys = Object.keys(payload);
    let response = {valence: 0, danceability: 0, energy: 0, banger: 0};
    for (let i = 0; i < keys.length; i++) {
        let lower = 0;
        for (let j = 0; j < ids.length; j++) {
            if (context.state.tracks[ids[j]][keys[i]] <= payload[keys[i]]) {
                lower += 1;
            }
        }
        response[keys[i]] = lower / context.state.progress.total;
    }
    return response;
};
//{h, s, v}
const HSVtoRGB = async (context, payload) => {
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
const artistAnalysis = async (context, payload) => {
    let artist = await context.dispatch("getArtist", payload);
    let artistObject = await context.dispatch("processArtist", artist);
    return artistObject;
};
const processArtist = async (context, payload) => {
    payload.href = payload.external_urls.spotify;
    delete payload.external_urls;
    payload.followers = payload.followers.total;
    payload.image = payload.images[0].url;
    delete payload.images;
    return payload;
};
const artistTracks = async (context, payload) => {
    if (!(payload.id in context.state.artists))
        return [];
    let ids = context.state.artists[payload.id].tracks;
    let tracks = [];
    for (let i = 0; i < ids.length; i++) {
        tracks.push(context.state.tracks[ids[i]]);
    }
    return tracks;
};
const artistTimeline = async (context, payload) => {
    if (!(payload.id in context.state.artists))
        return {timeline: [], oldest: [], newest: []};
    let artistObject = payload;
    let timeline = [];
    let tracks = [];
    let now = new Date();
    let nowTime = now.getTime();
    const MONTH = 2626560000;
    let artistSaved = context.state.artists[artistObject.id];
    for (let i = 0; i < artistSaved.tracks.length; i++) {
        let date = new Date(context.state.tracks[artistSaved.tracks[i]].date);
        let dateTime = date.getTime();
        let diff = nowTime - dateTime;
        let diffMonth = Math.floor(diff / MONTH);
        tracks.push({id: artistSaved.tracks[i], time: dateTime, month: diffMonth});
        if (diffMonth >= timeline.length) {
            while (diffMonth >= timeline.length) {
                timeline.push(0);
            }
        }
        timeline[diffMonth] += 1;
    }
    tracks.sort((a, b) => (a.time > b.time) ? 1 : -1);
    let oldest = tracks.slice(0, 3);
    let newest = tracks.slice(tracks.length - 3, tracks.length);
    while (timeline.length < context.state.dateAdded.length) {
        timeline.push(0);
    }
    return {timeline: timeline, oldest: oldest, newest: newest};
};
const artistTopTracks = async (context, id) => {
    let tracks = await context.dispatch('getArtistTopTracks', id);
    let ids = [];
    for (let i = 0; i < tracks.length; i++) {
        delete tracks[i].album.album_type;
        delete tracks[i].album.artists;
        delete tracks[i].album.available_markets;
        delete tracks[i].album.available_markets;
        tracks[i].album.href = tracks[i].album.external_urls.spotify;
        delete tracks[i].album.type;
        delete tracks[i].album.uri;
        delete tracks[i].available_markets;
        delete tracks[i].disc_number;
        delete tracks[i].external_ids;
        tracks[i].href = tracks[i].external_urls.spotify;
        delete tracks[i].external_urls;
        delete tracks[i].type;
        delete tracks[i].uri;
        if (tracks[i].album.images.length > 1)
            tracks[i].image = tracks[i].album.images[0].url;
        ids.push(tracks[i].id);
    }
    let audioFeatures = await context.dispatch('getAudioFeaturesForTracks', ids);

    for (let i = 0; i < tracks.length; i++) {
        tracks[i].valence = audioFeatures[i].valence;
        tracks[i].energy = audioFeatures[i].energy;
        tracks[i].danceability = audioFeatures[i].danceability;
    }

    return tracks;
};
////////////////////////////////////////////////////////////////
// SOCIAL //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// API CALLS ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopArtists = async (context, payload) => {
    try { 
        let response = await context.state.spotifyApi.getMyTopArtists({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        return;
    } 
};
// {limit: Number 1-50, time_range: "long_term" Several years, "medium_term" 6 Months, "short_term" 4 Weeks, offset: Index of first entry to return}
const getTopTracks = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMyTopTracks({limit: payload.limit, time_range: payload.time_range});
        return response.items;
    } catch (error) {
        return;
    }  
};
// {limit: Number 1-50, after: Unix timestamp Milliseconds, before: Unix timestamp Milliseconds
const getRecentlyPlayed = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMyRecentlyPlayedTracks({limit: payload.limit});
        return response;
    } catch (error) {
        return;
    }
};
const getTrack = async (context, track_id) => {
  try {
      let response = await context.state.spotifyApi.getTrack(track_id);
      return response;
  } catch (error) {
      return;
  }
};
const getTracks = async (context, track_ids) => {
  try {
      let response = await context.state.spotifyApi.getTracks(track_ids);
      return response;
  } catch (error) {
      return;
  }
};
// {artistId: String}
const getArtist = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getArtist(id);
        return response;
    } catch (error) {
        return;
    }
}; 
// []
const getArtists = async (context, ids) => {
  try {
      let response = await context.state.spotifyApi.getArtists(ids);
      return response.artists;
  } catch (error) {
      return;
  }
};
// Array IDs
const getAudioFeaturesForTracks = async (context, track_ids) => {
    try {
        let response = await context.state.spotifyApi.getAudioFeaturesForTracks(track_ids);
        return response.audio_features;
    } catch (error) {
        return;
    }
};
const getAudioFeaturesForTrack = async (context, track_id) => {
  try {
      let response = await context.state.spotifyApi.getAudioFeaturesForTracks([track_id]);
      return response.audio_features[0];
  } catch (error) {
      return;
  }
};
const getAudioAnalysisForTrack = async (context, track_id) => {
    try {
        let response = await context.state.spotifyApi.getAudioAnalysisForTrack(track_id);
        return response;
    } catch (error) {
        return;
    }
};
// {seed_tracks: [track_id], target_dancebility: NUM, limit: 6, max_* min_*}
const getRecomendations = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getRecommendations(payload);
        return response;
    } catch (error) {
        return;
    }
};
// {limit: 1-50, offset: first index}
const getSavedTracks = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.getMySavedTracks({limit: payload.limit, offset: payload.offset});
        return response;
    } catch (error) {
        return;
    }
};
// None
const getUser = async (context) => {
    try {
      if (context.state.inicialized)
      {
        let response = await context.state.spotifyApi.getMe();
        await context.commit('setUserData', response);
      }
    } catch (error) {
        return;
    }
};
// Array IDs
const searchSpotify = async (context, payload) => {
    try {
        let response = await context.state.spotifyApi.search(payload.query, ['track'], {limit: 25});
        return response;
    } catch (error) {
        return;
    }
};

const getArtistTopTracks = async (context, id) => {
    try {
        let response = await context.state.spotifyApi.getArtistTopTracks(id, "US", {});
        return response.tracks;
    } catch (error) {
        return;
    }
};

  
export default {
    inicializeGetToken,
    inicializeParseToken,
    inicializeSetToken,

    loadLibrary,
    retrieveSavedTracks,
    processTracks,
    inicialScanReduceIds,
    findAndStoreArtists,
    distributeTrackAudioFeatures,
    calcTracksPerGenre,
    calcExtremes,
    retrieveTopPlayed,
    retrieveTopPlayedArtists,
    retrieveTopPlayedTracks,

    saveLibrary,
    convertTracks,
    gatherMostPlayedTracks,
    gatherExtremes,
    compressTrack,
    convertArtists,
    gatherMostPlayedArtists,
    gatherMostSavedArtists,
    compressArtist,
    convertGenres,

    songAnalysis,
    songAnalysisFeatures,
    cleanAudioAnalysis,
    getPercentiles,
    HSVtoRGB,

    artistAnalysis,
    processArtist,
    artistTracks,
    artistTimeline,
    artistTopTracks,

    bangerCalc,

    getTopArtists,
    getTopTracks,
    getRecentlyPlayed,
    getTrack,
    getTracks,
    getArtist,
    getArtists,
    getAudioFeaturesForTracks,
    getAudioFeaturesForTrack,
    getAudioAnalysisForTrack,
    getRecomendations,
    getSavedTracks,
    getUser,
    getArtistTopTracks,
    searchSpotify
};