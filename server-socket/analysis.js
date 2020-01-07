let connect = async (socket) => {
    console.log("Analysis Connected:", socket.id);
    socket.emit('consolelog', {message: "Analysis Connected"});
};

module.exports = {
    connect: connect,
}




// var process = io
//   .of('/')
// io.on('connection', function(socket) {
//     console.log("Client Connected:", socket.id);
//     //socket.emit('consolelog', {message: "Connection Made"});

//     socket.on('auth', function(data) {
//         socket.join(data.room);
//         io.sockets.emit('SERVER_MESSAGE', {message: "JOIN SUCCESSFUL"});
//     });

//     socket.on('disconnect', function() {
//         io.emit('User Disconnected')
//     })
// });