

// Jimmy just your everyday cowboy gone sailor here for a good time.

class Jimmy {
    constructor() {
        this.ready = false;
        this.requestNum = 0;
    }

    async inicialize(accessToken) {
        try {
            this.token = accessToken;
            this.axios = axios.create({
                headers: {'Authorization': 'Bearer ' + accessToken}
            });
            this.ready = true;
        } catch(error) {
            return;
        }
    }

    ////////////////////////////
    // OVERVIEW ////////////////
    ////////////////////////////

    async getStats() {

    }

    ////////////////////////////
    // AUDIO FEATURES //////////
    ////////////////////////////

    async getAllAudioFeatureData() {
        try {
            if (this.audioFeatures) return this.audioFeatures;
            let response = await axios.put('/api/me/features/all', {token: this.token});
            this.audioFeatures = response.data;
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async getAudioFeatureAverage(audioFeature) {
        try {
            if (this.audioFeatures && audioFeature in this.audioFeatures && 'average' in this.audioFeatures[audioFeature] && typeof(this.audioFeatures[audioFeature].average) == 'number') 
                return this.audioFeatures[audioFeature].average;
            let response = await axios.put('/api/me/features/all', {token: this.token});
            this.audioFeatures = response.data;
            return response.data[audioFeature].average;
        } catch (error) {
            return null;
        }
    }

    async getAudioFeatureDistribution(audioFeature) {
        try {
            if (this.audioFeatures && audioFeature in this.audioFeatures && 'distribution' in this.audioFeatures[audioFeature] && typeof(this.audioFeatures[audioFeature].distribution) == 'number') 
                return this.audioFeatures[audioFeature].distribution;
            let response = await axios.put('/api/me/features/all', {token: this.token});
            this.audioFeatures = response.data;
            return response.data[audioFeature].distribution;
        } catch (error) {
            return null;
        }
    }

    async getAudioFeatureHistory(audioFeature) {
        try {
            if (this.audioFeatures && audioFeature in this.audioFeatures && 'history' in this.audioFeatures[audioFeature] && typeof(this.audioFeatures[audioFeature].history) == 'number') 
                return this.audioFeatures[audioFeature].history;
            let response = await axios.put('/api/me/features/all', {token: this.token});
            this.audioFeatures = response.data;
            return response.data[audioFeature].history;
        } catch (error) {
            return null;
        }
    }

    ////////////////////////////
    // HISTORY /////////////////
    ////////////////////////////

    async getAddedHistory() {
        try {
            if (this.history && 'added' in this.history) return this.history.added;
            let response = await axios.put('/api/me/history/added', {token: this.token});
            if (!this.history) this.history = {};
            this.history.added = response.data;
            return response.data;
        } catch (error) {
            return null;
        }
    }

    ////////////////////////////
    // TRACK ANALYSIS //////////
    ////////////////////////////

    async getTrackData(id) {
        let response = await this.spotifyAPI.getTrack(id);
        let track = await this.convertTrack(response.body);
        return track;
    }

    async getTrackFeatures(id) {
        let features = {};
        let response = await this.spotifyAPI.getAudioFeaturesForTrack(id); 
        features.duration_ms = response.body.duration_ms;
        features.key = response.body.key;
        features.mode = response.body.mode;
        features.time_signature = response.body.time_signature;
        features.acousticness = response.body.acousticness;
        features.danceability = response.body.danceability;
        features.energy = response.body.energy;
        features.instrumentalness = response.body.instrumentalness;
        features.liveness = response.body.liveness;
        features.loudness = response.body.loudness;
        features.speechiness = response.body.speechiness;
        features.valence = response.body.valence;
        features.tempo = response.body.tempo;
        return features;
    }

    async getTrackAnalysis(id) {
        let response = await this.spotifyAPI.getAudioAnalysisForTrack(id); 
        let audioAnalysis = await this.processAudioAnalysis(response.body);
        return audioAnalysis;
    }

    async processAudioAnalysis(apiReturn) {
        let audioAnalysisSegments = 80;
        let newSegments = [];
        if (apiReturn.segments.length < audioAnalysisSegments)
            audioAnalysisSegments = apiReturn.segments.length;
        let width = Math.round(apiReturn.segments.length / audioAnalysisSegments);
          
        for (var i = 0; i < audioAnalysisSegments; i++)
        {
            let itemIndex = Math.round(width * i);
            if (itemIndex > apiReturn.segments.length - 1)
            {
                itemIndex = apiReturn.segments.length - 2;
            }
            let sum = 0;
            for (var j = 0; j < apiReturn.segments[itemIndex].pitches.length; j++)
            {
                sum += apiReturn.segments[itemIndex].pitches[j];
            }
            let averagePitch = sum / apiReturn.segments[itemIndex].pitches.length; 
            let color = await this.HSVtoRGB({hue: (((1 - averagePitch) * 229 + -50) / 360), saturation: 0.51, value: 0.89});
            let loudness = (Math.round(((apiReturn.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);

            newSegments.push({
                start: Math.round(apiReturn.segments[itemIndex].start),
                loudness_max: loudness, 
                red: color.r,
                green: color.g,
                blue: color.b,
            });
        }
        return newSegments;
    }

    async HSVtoRGB(payload) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(payload.hue * 6);
        f = payload.hue * 6 - i;
        p = payload.value * (1 - payload.saturation);
        q = payload.value * (1 - f * payload.saturation);
        t = payload.value * (1 - (1 - f) * payload.saturation);
        switch (i % 6) {
            case 0: r = payload.value, g = t, b = p; break;
            case 1: r = q, g = payload.value, b = p; break;
            case 2: r = p, g = payload.value, b = t; break;
            case 3: r = p, g = q, b = payload.value; break;
            case 4: r = t, g = p, b = payload.value; break;
            case 5: r = payload.value, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    ////////////////////////////
    // ARTIST ANALYSIS /////////
    ////////////////////////////

    async getArtistData(id) {
        let response = await this.spotifyAPI.getArtist(id);
        return response.body;
    }

    

    ////////////////////////////
    // ALBUM ANALYSIS //////////
    ////////////////////////////

    async getAlbumData(id) {
        let response = await this.spotifyAPI.getAlbum(id);
        return response.body;
    }

    ////////////////////////////
    // GENRE ANALYSIS //////////
    ////////////////////////////

    ////////////////////////////
    // PLAYLIST ANALYSIS ///////
    ////////////////////////////

    async getPlaylistData(id) {
        let response = await this.spotifyAPI.getPlaylist(id);
        return response.body;
    }

    ////////////////////////////
    // CHARTS //////////////////
    ////////////////////////////

    async getTopPlayed(type, time_range) {
        try {
            let localRequestNum = this.requestNum + 1;
            this.requestNum += 1;

            let response;
            

            switch(type) {
                case 0: 
                    response = await this.axios.put('/api/me/chart/played/tracks/' + time_range, {token: this.token});
                    break;
                case 1:
                    response = await this.axios.put('/api/me/chart/played/artists/' + time_range, {token: this.token});
                    break;
                default:
                    return null;
            }
            console.log(response);
            let items = response.data;
            if (this.requestNum != localRequestNum) {
                return null;
            }
            console.log(items);
            return items;
        } catch(error) {
            return;
        }
    }

    async getTopSaved(type) {
        let localRequestNum = this.requestNum + 1;
        this.requestNum += 1;
        let types = ['artists', 'genres'];
        let response = await axios.put('/api/top/saved/' + types[type], {token: this.token});
        if (this.requestNum != localRequestNum) return null;
        return response.data;
    }

    async getExtreme(sort, audiofeature) {
        let localRequestNum = this.requestNum + 1;
        this.requestNum += 1;
        let features = ['valence', 'danceability', 'energy', 'tempo', 'acousticness', 'instrumentalness', 'liveness',  'speechiness'];
        let response = await axios.put('/api/extreme/' + features[audiofeature] + '/' + sort, {token: this.token});
        if (this.requestNum != localRequestNum) return null;
        return response.data
    }

    ////////////////////////////
    // LIBRARY /////////////////
    ////////////////////////////

    // async getSavedTracks(options) {
    //     //let response = await axios.get('/api/')
    // }

    // async getSavedArtists(options) {
    //     //let response = await axios.get('/api/')
    // }

    // async getSavedPlaylists(options) {
    //     //let response = await axios.get('/api/')
    // }

    ////////////////////////////
    // SEARCH //////////////////
    ////////////////////////////

    async search(query, offset, type) {
        try {
            let localRequestNum = this.requestNum + 1;
            this.requestNum += 1;

            if (!this.ready) 
                return null;
            
            let items = response.body[key].items;
            let convertedItems = [];
            for (let i = 0; i < items.length; i++) {
                if (this.requestNum != localRequestNum) {
                    return null;
                }
                switch(type) {
                    case 0:
                        convertedItems.push(await this.convertTrack(items[i]));
                        break;
                    case 1:
                        convertedItems.push(await this.convertArtist(items[i]));
                        break;
                    case 2: 
                        convertedItems.push(await this.convertAlbum(items[i]));
                        break;
                    case 3: 
                        convertedItems.push(await this.convertPlaylist(items[i]));
                        break;
                }
            }
            if (this.requestNum != localRequestNum) {
                return null;
            }
            return convertedItems;
        } catch(error) {
            return;
        }
    }

    async getRecommends(options) {
        try {
            let localRequestNum = this.requestNum + 1;
            this.requestNum += 1;
            if (!this.ready) {
                return null;
            }
            
        } catch(error) {
            return [];
        }
    }

    ////////////////////////////
    // CONVERT /////////////////
    ////////////////////////////

    convertTrack(track) {
        let image;
        if (track.album.images.length == 0) 
            image = "Undefined";
        else    
            image = track.album.images[0].url;
        return {
            _id: track.id,
            name: track.name,
            artists: track.artists.map( function(artist) {
                return {name: artist.name, _id: artist.id};
            }),
            album: {
                name: track.album.name, 
                _id: track.album.id
            },
            image: image,
        };
    }

    convertArtist(artist) {
        let image;
        if (artist.images.length == 0) 
            image = "Undefined";
        else    
            image = artist.images[0].url;
        return {
            _id: artist.id,
            name: artist.name,
            genres: artist.genres,
            image: image,
        };
    }

    convertAlbum(album) {
        let image;
        if (album.images.length == 0) 
            image = "Undefined";
        else    
            image = album.images[0].url;
        return {
            _id: album.id,
            name: album.name,
            artists: album.artists.map( function(artist) {
                return {name: artist.name, _id: artist.id};
            }),
            image: image,
            total_tracks: album.total_tracks,
        };
    }

    convertPlaylist(playlist) {
        let image;
        if (playlist.images.length == 0) 
            image = "Undefined";
        else    
            image = playlist.images[0].url;
        return {
            _id: playlist.id,
            name: playlist.name,
            owner: playlist.owner.display_name,
            image: image,
            public: playlist.public,
            total_tracks: playlist.tracks.total,
        };
    }

        ////////////////////////////
    // PLAY ////////////////////
    ////////////////////////////


}

export default Jimmy;

