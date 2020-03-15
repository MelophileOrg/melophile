let discogsWrapper = require('../services/analysis/DiscogsWrapper.js');

async function test() {
    try {
        console.log(await discogsWrapper.getArtistData("Creedence Clearwater Revival"));
    } catch (error) {
        console.log(error);
    }
}

test();

