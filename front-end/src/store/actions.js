// { instance: this}
const login = (context, payload) => {
    payload.instance.$socket.client.emit('login');
};

const process = (context, payload) => {
    payload.instance.$socket.client.emit('process', {accessToken: context.state.authentication.accessToken});
};

export default {
    login,
    process,

};