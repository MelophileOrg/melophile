const setAccessToken = (state, accessToken) => {
    state.accessToken = accessToken;
};

const setRefreshToken = (state, refreshToken) => {
    state.refreshToken = refreshToken;
}

export default {
    setAccessToken,
    setRefreshToken,
};