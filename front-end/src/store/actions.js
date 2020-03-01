import axios from 'axios';

////////////////////////////////////
// LOGIN ///////////////////////////
////////////////////////////////////

const login = (context, payload) => {
    try {
        if (context.state.state.loggingIn) return;
        context.commit('setLogginState', true);
        payload.instance.$socket.client.emit('login');
        context.commit('setLogginState', false);
    } catch(error) {
        return;
    }
};

const process = (context, payload) => {
    try {
        if (context.state.state.processing) return;
        context.commit('setProcessState', true);
        payload.instance.$socket.client.emit('process', {accessToken: context.state.authentication.accessToken});
    } catch(error) {
        return;
    }
};

// {query: String, offset: number, type: number}
const search = async(context, payload) => {
    try {
        if (!context.state.authentication.accessToken) throw new Error("Not Logged In");
        let localRequestNum = await context.commit('setRequestID');
        console.log("Making Request");
        let response = await axios.put('/api/general/search', {token: context.state.authentication.accessToken, options: payload});
        console.log("Checking ID");
        console.log(localRequestNum);
        if (localRequestNum != context.state.requestID) return null;
        console.log(response.data);
        return response.data;
    } catch(error) {
        return;
    }
}

const getRecommends = async (context, payload) => {
    try {
        if (!context.state.authentication.accessToken) throw new Error("Not Logged In");
        payload.token = context.state.authentication.accessToken;
        let localRequestNum = await context.commit('setRequestID');
        let response = await axios.put('/api/general/recommend', payload);
        if (localRequestNum != context.state.requestID) return null;
        return response.data;
    } catch(error) {
        return;
    }
};

const getStats = async (context) => {
    try {
        if (context.state.stats != null) return context.state.stats;
        let response = await axios.put('/api/me/stats', {token: context.state.authentication.accessToken});
        return await context.commit('setStats', response.data);
    } catch (error) {
        return null;
    }
};

const getAllAudioFeatureData = async (context) => {
    try {
        if (context.state.audioFeatures != null) return context.state.audioFeatures;
        let response = await axios.put('/api/me/features/all', {token: context.state.authentication.accessToken});
        return await context.commit('setAudioFeatures', response.data);
    } catch (error) {
        return null;
    }
};

const getAudioFeatureAverage = async (context, feature) => {
    try {
        if (context.state.audioFeatures != null && feature in context.state.audioFeatures && typeof(context.state.audioFeatures[feature].average) == 'number') return context.state.audioFeatures[feature].average;
        let response = await axios.put('/api/me/features/all', {token: context.state.authentication.accessToken});
        return (await context.commit('setAudioFeatures', response.data))[feature].average;
    } catch (error) {
        return null;
    }
};

const getAudioFeatureDistribution = async (context, feature) => {
    try {
        if (context.state.audioFeatures != null && feature in context.state.audioFeatures && typeof(context.state.audioFeatures[feature].distribution) == 'number') return context.state.audioFeatures[feature].distribution;
        let response = await axios.put('/api/me/features/all', {token: context.state.authentication.accessToken});
        return (await context.commit('setAudioFeatures', response.data))[feature].distribution;
    } catch (error) {
        return null;
    }
};

const getAudioFeatureHistory = async (context, feature) => {
    try {
        if (context.state.audioFeatures != null && feature in context.state.audioFeatures && typeof(context.state.audioFeatures[feature].history) == 'number') return context.state.audioFeatures[feature].history;
        let response = await axios.put('/api/me/features/all', {token: context.state.authentication.accessToken});
        return (await context.commit('setAudioFeatures', response.data))[feature].history;
    } catch (error) {
        return null;
    }
};

const getAddedHistory = async (context) => {
    try {
        if (context.state.history && 'added' in context.state.history && context.state.history.added instanceof Array) return context.state.history.added;
        let response = await axios.put('/api/me/history/added', {token: context.state.authentication.accessToken});
        return (await context.commit('setHistoryAdded', response.data));
    } catch(error) {
        return null;
    }
};

////////////////////////////////////
// Play Items //////////////////////
////////////////////////////////////

const playTrack = async (context, id) => {
    try {
        await axios.put('/api/general/play/track', {token: context.state.authentication.accessToken, id: id});
    } catch(error) {
        return;
    }
};

const playTracks = async (context, ids) => {
    try {
        await axios.put('/api/general/play/tracks', {token: context.state.authentication.accessToken, ids: ids});
    } catch(error) {
        return;
    }
};

const playArtist = async (context, id) => {
    try {
        await axios.put('/api/general/play/artist', {token: context.state.authentication.accessToken, id: id});
    } catch(error) {
        return;
    }
};

const playAlbum = async (context, id) => {
    try {
        await axios.put('/api/general/play/album', {token: context.state.authentication.accessToken, id: id});
    } catch(error) {
        return;
    }
};

const playPlaylist = async (context, id) => {
    try {
        await axios.put('/api/general/play/playlist', {token: context.state.authentication.accessToken, id: id});
    } catch(error) {
        return;
    }
};

export default {
    login,
    process, 

    search,
    getRecommends,

    getStats,
    getAllAudioFeatureData,
    getAudioFeatureAverage,
    getAudioFeatureDistribution,
    getAudioFeatureHistory,
    getAddedHistory,

    playTrack,
    playTracks,
    playArtist,
    playAlbum,
    playPlaylist
};