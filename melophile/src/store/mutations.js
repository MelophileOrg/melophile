const setUser = (state, user) => {
    state.user = user;
}

const setProcessState = (state, status) => {
    state.process.state = status;
}

const SOCKET_PROCESSMESSAGE = (state, data) => {
    state.process.message = data.message;
    state.process.progress = data.percent;
}

export default {
    setUser,
    setProcessState,
    SOCKET_PROCESSMESSAGE,
};