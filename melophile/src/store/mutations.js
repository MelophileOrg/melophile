const setUser = (state, user) => {
    state.user = user;
}

const SOCKET_PROCESSMESSAGE = (state, data) => {
    state.process.message = data.message;
    state.process.progress = data.percent;
}

export default {
    setUser,
    SOCKET_PROCESSMESSAGE,
};