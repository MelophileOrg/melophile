let melomaniac_processor = require('./melomaniac-processor.js');
let MelomaniacProcessor = melomaniac_processor.processor;

let process = function(socket) {
    socket.on('process', async function(data) {
        let processor = await new MelomaniacProcessor(data.accessToken, socket);
        await processor.start();
        socket.emit('ConsoleLog', {message: "Done"});
    })
}
  
module.exports = process;