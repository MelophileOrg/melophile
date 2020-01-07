module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("Big fat juicy penis:", socket.id);
    });
}