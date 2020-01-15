const SOCKET_CONSOLELOG = (state, data) => {
    console.log(data.message);
};

const SOCKET_AUTHSTATE = (state, data) => {
    state.authentication.state = data.state;
};

const SOCKET_AUTHLOGINLINK = (state, data) => {
    window.location = data.link;
};

const SOCKET_AUTHGRANTED = (state, data) => {
    state.authentication.accessToken = data.access_token;
    state.authentication.refreshToken = data.refresh_token;
};

const SOCKET_PROCESSMESSAGE = (state, data) => {
    console.log(data.message);
    state.progress.message = data.message;
};

const SOCKET_TOTALTRACKS = (state, data) => {
    state.progress.tracks.total = data.total;
};

const SOCKET_PROCESSEDTRACKS = (state, data) => {
    state.progress.tracks.processed = data.processed;
};

const SOCKET_DONETRACKS = (state) => {
    state.progress.tracks.done = true;
};

const SOCKET_PROCESSEDCHARTS = (state, data) => {
    state.progress.charts.processed = data.processed;
};

const SOCKET_DONECHARTS = (state) => {
    state.progress.charts.done = true;
};

const SOCKET_TOTALPLAYLISTS = (state, data) => {
    state.progress.playlists.total = data.total;
};

const SOCKET_PROCESSEDPLAYLISTS = (state, data) => {
    state.progress.playlists.processed = data.processed;
};

const SOCKET_DONEPLAYLISTS = (state) => {
    state.progress.playlists.done = true;
};





export default {
    SOCKET_CONSOLELOG,
    SOCKET_AUTHSTATE,
    SOCKET_AUTHLOGINLINK,
    SOCKET_AUTHGRANTED,

    SOCKET_PROCESSMESSAGE,

    SOCKET_TOTALTRACKS,
    SOCKET_PROCESSEDTRACKS,
    SOCKET_DONETRACKS,

    SOCKET_PROCESSEDCHARTS,
    SOCKET_DONECHARTS,

    SOCKET_TOTALPLAYLISTS,
    SOCKET_PROCESSEDPLAYLISTS,
    SOCKET_DONEPLAYLISTS,
};