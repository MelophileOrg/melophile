import axios from 'axios'


const login = async () => {
    this.$socket.auth.emit('login');
    //window.location = response.data;
};

const inicialize = async(context, payload) => {
    context.commit('setAccessToken', payload.access_token);
};

const process = async (context) => {
    let response = await axios.post('/api/process', {accessToken: context.state.accessToken});
    console.log(response.data);
};

export default {
    login,
    inicialize,
    process,
};