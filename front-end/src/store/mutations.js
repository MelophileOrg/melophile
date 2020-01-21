///////////////////////////////////////////////////////////////////////////////
// AUTHENTICATION /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { state: String }
const SOCKET_AUTHSTATE = (state, data) => {
    state.authentication.state = data.state;
};
// { link: String }
const SOCKET_AUTHLOGINLINK = (state, data) => {
    window.location = data.link;
};
// { access_token: String, refresh_token: String }
const SOCKET_AUTHGRANTED = (state, data) => {
    state.authentication.accessToken = data.access_token;
    state.authentication.refreshToken = data.refresh_token;
};
///////////////////////////////////////////////////////////////////////////////
// COMMUNICATION //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { message: String }
const SOCKET_CONSOLELOG = (state, data) => {
    console.log(data.message);
};
// { message: String, percent: Number}
const SOCKET_PROCESSMESSAGE = (state, data) => {
    state.progress.message = data.message;
    state.progress.percent = data.percent;
};
// NULL
const SOCKET_PROGRESSDONE = (state) => {
    state.progress.done = true;
};
///////////////////////////////////////////////////////////////////////////////
// BASE DATA //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { userID: String }
const SOCKET_USERID = (state, data) => {
    state.data.userID = data.userID;
};
///////////////////////////////////////////////////////////////////////////////
// ANALYSIS ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { feature: String, average: Number }
const SOCKET_AUDIOFEATUREAVERAGE = (state, data) => {
    state.data.audioFeatures[data.feature].average = data.average;
};
// { averages: Array }
const SOCKET_AUDIOFEATUREAVERAGES = (state, data) => {
    for (let i = 0; i < data.averages.length; i++) 
        state.data.audioFeatures[data.averages[i].feature].average = data.averages[i].average;
};
// { feature: String, distribution: Number }
const SOCKET_AUDIOFEATUREDISTRIBUTION = (state, data) => {
    state.data.audioFeatures[data.feature].distribution = data.distribution;
};
// { distributions: Array }
const SOCKET_AUDIOFEATUREDISTRIBUTIONS = (state, data) => {
    for (let i = 0; i < data.distributions.length; i++) 
        state.data.audioFeatures[data.distributions[i].feature].distribution = data.distributions[i].distribution;
};
// { feature: String, history: Number }
const SOCKET_AUDIOFEATUREHISTORY = (state, data) => {
    state.data.audioFeatures[data.feature].history = data.history;
};
// { historys: Array }
const SOCKET_AUDIOFEATUREHISTORYS = (state, data) => {
    for (let i = 0; i < data.historys.length; i++) 
        state.data.audioFeatures[data.historys[i].feature].history = data.historys[i].history;
};
// { feature: String, min: Array }
const SOCKET_AUDIOFEATUREMIN = (state, data) => {
    state.data.audioFeatures[data.feature].min = data.min;
};
// { feature: String, max: Array }
const SOCKET_AUDIOFEATUREMAX = (state, data) => {
    state.data.audioFeatures[data.feature].max = data.max;
};
// Object
const SOCKET_ANALYSIS = (state, data) => {
    state.data.analysis = data;
};
// { type: String, time: Number, offset: Number, items: Array} IDS ONLY
// const SOCKET_TOPPLAYED = (state, data) => {
//     // if (state.data.list.type != data.type)
//     //     state.data.list.items = {};
//     // if (state.data.charts.topPlayed[data.type][data.time].length <= data.offset) {
//     //     for (let i = 0; i < data.items.length; i++) {

//     //     }
//     // }
//     //     state.data.charts.topPlayed[data.type][data.time] = state.data.charts.topPlayed[data.type][data.time].concat(data.items.map(item => item._id));
    
//     // for (let i = 0; i < data.items.length; i++)
//     //     state.data.list.items[data.items[i]._id] = data.items[i];
// };





export default {
    SOCKET_CONSOLELOG,
    SOCKET_AUTHSTATE,
    SOCKET_AUTHLOGINLINK,
    SOCKET_AUTHGRANTED,

    SOCKET_PROCESSMESSAGE,
    SOCKET_PROGRESSDONE,

    SOCKET_USERID,

    SOCKET_AUDIOFEATUREAVERAGE,
    SOCKET_AUDIOFEATUREAVERAGES,
    SOCKET_AUDIOFEATUREDISTRIBUTION,
    SOCKET_AUDIOFEATUREDISTRIBUTIONS,
    SOCKET_AUDIOFEATUREHISTORY,
    SOCKET_AUDIOFEATUREHISTORYS,
    SOCKET_AUDIOFEATUREMIN,
    SOCKET_AUDIOFEATUREMAX,
    SOCKET_ANALYSIS,



};