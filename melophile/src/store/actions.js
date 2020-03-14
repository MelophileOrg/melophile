import axios from 'axios';

let getUser = async (context) => {
    try {
        let response = await axios.get('/api/auth');
        if (response.status == 200) context.commit('setUser', response.data);
    } catch(error) {
        return;
    }
};

let login = async () => {
    try {
        let response = await axios.get('/api/auth/login');
        window.location = response.data;
    } catch (error) {
        console.log(error);
        return;
    }
};

let callback = async (context, payload) => {
    try {
        let response = await axios.put('/api/auth/callback', payload);
        context.commit('setUser', response.data);
    } catch(error) {
        console.log(error);
        return;
    }
};

let logout = async (context) => {
    try {
        await axios.delete('/api/auth/');
        context.commit('setUser', null);
    } catch(error) {
        console.log(error);
        return;
    }
};

// let process = async (context) => {

// };

// let getStats = async (context) => {

// };

// let getAudioFeatures = async (context) => {

// };

// let getHistory = async (context) => {

// };

// let playTrack = async (context) => {

// };

// let playTracks = async (context) => {

// };

// let playArtist = async (context) => {

// };

// let playAlbum = async (context) => {

// };

// let playPlaylist = async (context) => {

// };

export default {
    getUser,
    login, 
    callback, 
    logout,
    // process,
    // getStats,
    // getAudioFeatures,
    // getHistory,
    // playTrack,
    // playTracks,
    // playArtist,
    // playAlbum,
    // playPlaylist,
};