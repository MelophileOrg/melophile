const setAccessToken = (state, accessToken) => {
    state.accessToken = accessToken;
};

const server_consolelog = (state, data) => {
    console.log('%c' + data.message, 'background: #4a86e8; color: white;');
};

const server_auth_consolelog = (state, data) => {
    console.log('%c' + data.message, 'background: #4a86e8; color: white;');
};

export default {
    setAccessToken,
    server_consolelog,
    server_auth_consolelog,
};