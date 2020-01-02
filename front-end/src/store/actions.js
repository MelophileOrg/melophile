import axios from 'axios'

const login = async () => {
    let response = await axios.get('/api/auth/login');
    console.log(response.data);
    window.location = response.data;
};

const inicialize = async(context, payload) => {
    context.commit('setAccessToken', payload.access_token);
    context.commit('setRefreshToken', payload.refresh_token);
};

export default {
    login,
    inicialize,
};