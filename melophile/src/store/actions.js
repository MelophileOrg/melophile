import axios from 'axios';

/**
 * Get User
 * Automatic Login
 * 
 * @param {object} context Vuex Context
 */
let getUser = async (context) => {
    try {
        let response = await axios.get('/api/auth');
        if (response.status == 200) context.commit('setUser', response.data);
    } catch(error) {
        return;
    }
};

/**
 * Login
 * Requests login URL.
 */
let login = async () => {
    try {
        let response = await axios.get('/api/auth/login');
        window.location = response.data;
    } catch (error) {
        console.log(error);
        return;
    }
};

/**
 * Login Callback
 * Processes given code from callback.
 *  
 * @param {object} context Vuex Context
 * @param {object} payload Retrieved data from callback.
 */
let callback = async (context, payload) => {
    try {
        let response = await axios.put('/api/auth/callback', payload);
        context.commit('setUser', response.data);
    } catch(error) {
        console.log(error);
        return;
    }
};

/**
 * Logout
 * Deletes tokens and clears user.
 *  
 * @param {object} context Vuex Context
 */
let logout = async (context) => {
    try {
        await axios.delete('/api/auth/');
        context.commit('setUser', null);
    } catch(error) {
        console.log(error);
        return;
    }
};

let process = async (context, payload) => {
    try {
        payload.instance.$socket.client.emit('process', {authToken: (await axios.get('/api/auth/token')).data});
        console.log(context);
    } catch (error) {
        console.log(error);
        return;
    }
};

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
    process,
    // getStats,
    // getAudioFeatures,
    // getHistory,
    // playTrack,
    // playTracks,
    // playArtist,
    // playAlbum,
    // playPlaylist,
};