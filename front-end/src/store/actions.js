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

// {query: String, offset: Number, type: Number}
const search = async (context, payload) => {
    context.commit('SOCKET_LISTCLEAR');
    let items;
    let key;
    if (payload.type == 0) {
        items = await context.state.jimmy.search(payload.query, ['track'], {limit: 50, offset: payload.offset});
        key = "tracks";
    } else if (payload.type == 1) {
        items = await context.state.jimmy.search(payload.query, ['artist'], {limit: 50, offset: payload.offset});
        key = "artists";
    } else if (payload.type == 2) {
        items = await context.state.jimmy.search(payload.query, ['album'], {limit: 50, offset: payload.offset});
        key = "albums";
    } else if (payload.type == 3) {
        items = await context.state.jimmy.search(payload.query, ['playlist'], {limit: 50, offset: payload.offset});
        key = "playlists";
    } else {
        return;
    }
    if (payload.offset == 0) {
        await context.commit('SOCKET_LISTSTART', {list: items.body[key].items.map(item => item.id), type: payload.type});
    }
    else {
        await context.commit('SOCKET_LISTADD', {list: items.body[key].items.map(item => item.id), type: payload.type});
    }
};

const clearList = (context) => {
    context.commit('SOCKET_LISTCLEAR');
};



export default {
    newRoute,
    login,
    process,
    search,
    clearList,

};