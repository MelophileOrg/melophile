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
    state.jimmy.inicialize(data.access_token);
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
    console.log(data.message);
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
// { feature: Val }
const SOCKET_AUDIOFEATUREAVERAGES = (state, data) => {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) 
        state.data.audioFeatures[keys[i]].average = data[keys[i]];
};
// { feature: String, distribution: Number }
const SOCKET_AUDIOFEATUREDISTRIBUTION = (state, data) => {
    state.data.audioFeatures[data.feature].distribution = data.distribution;
};
// { distributions: Array }
const SOCKET_AUDIOFEATUREDISTRIBUTIONS = (state, data) => {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) 
        state.data.audioFeatures[keys[i]].distribution = data[keys[i]];
    console.log(state.data.audioFeatures);
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

///////////////////////////////////////////////////////////////////////////////
// SEARCH /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// { list: [id], type: Number }
const SOCKET_LISTSTART = (state, data) => {
    state.list.type = data.type;
    state.list.list = data.list;
};

const SOCKET_LISTADD = (state, data) => {
    state.list.list = state.list.list.concat(data.list);
};

const addListObject = (state, data) => {
    if (state.list.type == 0) {
        state.list.tracks[data.id] = null;
    } else if (state.list.type == 1) {
        state.list.artists[data.id] = null;
    } else if (state.list.type == 2) {
        state.list.albums[data.id] = null;
    } else if (state.list.type == 3) {
        state.list.playlists[data.id] = null;
    }
}

const SOCKET_LISTCLEAR = (state) => {
    state.list.list = [];
};
// { items: [], type: Number }
const SOCKET_REQUESTEDLIST = (state, data) => {
    if (data.type != state.list.type) {
        return;
    }
    for (let i = 0; i < data.items.length; i++) {
        if (state.list.type == 0) {
            state.list.tracks[data.items[i]._id] = data.items[i];
        } else if (state.list.type == 1) {
            state.list.artists[data.items[i]._id] = data.items[i];
        } else if (state.list.type == 2) {
            state.list.albums[data.items[i]._id] = data.items[i];
        } else if (state.list.type == 3) {
            state.list.playlists[data.items[i]._id] = data.items[i];
        }
    }

}


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

    SOCKET_LISTSTART,
    SOCKET_LISTADD,
    addListObject,
    SOCKET_LISTCLEAR,
    SOCKET_REQUESTEDLIST



};