let TrackDAO = require('../daos/TrackDAO.js');

async function test() {
    try {
        let track = new TrackDAO("kljsdf");
        console.log(track);
        track.name = "Hello!";
        console.log(track);
    } catch (error) {
        console.log(error);
    }
}

test();

