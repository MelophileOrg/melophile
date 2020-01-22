let SpotifyWebApi = require('spotify-web-api-node');

// Jimmy just your everyday cowboy gone sailor here for a good time.

class Jimmy {
    constructor() {
        this.spotifyAPI =  new SpotifyWebApi();
    }

    sayHello() {
        console.log("I'm-a chewin' on a honeysuckle vine.");
    }

    inicialize(accessToken) {
        this.spotifyAPI.setAccessToken(accessToken);
    }


}

modules.export = {
    import: Jimmy
}