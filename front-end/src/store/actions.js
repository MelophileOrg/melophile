// { instance: this}
const login = (context, payload) => {
    payload.instance.$socket.client.emit('login');
};

const process = (context, payload) => {
    payload.instance.$socket.client.emit('process', {accessToken: context.state.authentication.accessToken});
};

const createListRequest = (context, payload) => {
    context.commit('createNewRequest', payload._id);
}

const deleteListRequest = (context, payload) => {
    context.commit('deleteRequest', payload._id);
}






export default {
    login,
    process,

    createListRequest,
    deleteListRequest

};