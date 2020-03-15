// Dependencies
const axios = require('axios');

// Key Retriever for Secret
const keys = require("../general/KeyRetriever.js");

/**
 * Discogs API Wrapper
 * Wrapper for various endpoints of the discogs api.
 */
class DiscogsWrapper {
    /**
     * Contructor
     * Creates a new instance of Discogs Wrapper.
    */
    constructor() {
        let auth = keys.getDiscogs();
        this.discogsAPI = axios.create({
            baseURL: 'https://api.discogs.com',
            headers: {
                "Authorization": "Discogs key=" + auth.key + ", secret=" + auth.secret,
            }
        });
    }

    /**
     * Get Artist Data
     * Retrieves data on a given artist by name.
     * 
     * @param {string} name Name of Artist.
     * @returns {object} Object containing discogs data.
    */
    async getArtistData(name) {
        try {
            let editedName = name.replace(" ", "+");
            let response = await this.discogsAPI.get('/database/search?q=' + editedName + '&type=artist');
            let probableArtist = response.data.results[0].id;
            let artistData = await this.discogsAPI.get('/artists/' + probableArtist);
            if ('uri' in artistData.data) delete artistData.data.uri;
            if ('resource_url' in artistData.data) delete artistData.data.resource_url;
            if ('id' in artistData.data) delete artistData.data.id;
            if ('releases_url' in artistData.data) delete artistData.data.releases_url;
            if ('profile' in artistData.data) artistData.data.profile = await this.cleanProfile(artistData.data.profile);
            return artistData.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Clean Profile
     * Discog profile data written in markdown - turns to string.
     * 
     * @param {markdown_string} profile Profile of data.
     * @returns {array} Clean strings in array.
    */
    async cleanProfile(profile) {
        let newProfile = [""];
        let line = 0;
        let bracket = false;
        let skip = 0;
        for (let i = 0; i < profile.length; i++) {
            if (skip > 0) {
                skip -= 1;
            }
            else if (bracket) {
                if (profile[i] == ']') {
                    bracket = false;
                }
            }
            else if (profile[i] == '\n') {
                if (newProfile[line] != "") {
                    newProfile.push("");
                    line += 1;
                }
            }
            else if (profile[i] == '\r') {
                continue;
            }
            else if (profile[i] == '[') {
                if (profile[i + 1] == 'a') {
                    skip = 2;
                } else {
                    bracket = true;
                }
            }
            else if (profile[i] == ']') {
                continue;
            }
            else {
                if (profile[i] == ' ' && profile[i + 1] == ' ' ) {
                    skip = 1;
                }
                newProfile[line] += profile[i];
            }
        }
        if (newProfile[newProfile.length - 1] == "") newProfile.splice(newProfile.length - 1, 1);
        return newProfile;
    }
}

// Export
module.exports = new DiscogsWrapper();