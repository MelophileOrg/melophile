const newRoute = (context, payload) => {
    context.commit('setRoute', payload);
}


// { instance: this}
const login = (context, payload) => {
    payload.instance.$socket.client.emit('login');
};

const process = (context, payload) => {
    payload.instance.$socket.client.emit('process', {accessToken: context.state.authentication.accessToken});
};

const clearList = (context) => {
    context.commit('SOCKET_LISTCLEAR');
};



export default {
    newRoute,
    login,
    process,
    clearList,

};