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
const setLogginState = (state, val) => {
    state.state.loggingIn = val;
};
const setProcessState = (state, val) => {
    state.state.processing = val;
};
///////////////////////////////////////////////////////////////////////////////
// COMMUNICATION //////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { message: String, percent: Number}
const SOCKET_PROCESSMESSAGE = (state, data) => {
    state.progress.message = data.message;
    state.progress.percent = data.percent;
};
// NULL
const SOCKET_PROGRESSDONE = (state) => {
    state.progress.done = true;
    state.state.processing = false;
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
const setRequestID = (state) => {
    state.requestID += 1;
};

const setStats = (state, stats) => {
    state.stats = stats;
    return stats;
};

const setAudioFeatures = (state, audioFeatures) => {
    state.audioFeatures = audioFeatures;
    return audioFeatures;
};

const setHistoryAdded = (state, added) => {
    if (typeof(state.history) != 'object') state.history = {};
    state.history.added = added;
    return added;
};


///////////////////////////////////////////////////////////////////////////////
// SEARCH /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export default {
    SOCKET_AUTHSTATE,
    SOCKET_AUTHLOGINLINK,
    SOCKET_AUTHGRANTED,

    setLogginState,
    setProcessState,

    SOCKET_PROCESSMESSAGE,
    SOCKET_PROGRESSDONE,

    SOCKET_USERID,

    setRequestID,
    setStats,
    setAudioFeatures,
    setHistoryAdded,
};