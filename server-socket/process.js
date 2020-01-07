let connect = async (socket) => {
    console.log("Process Connected:", socket.id);
    socket.emit('consolelog', {message: "Process Connected"});
};

module.exports = {
    connect: connect,
}
