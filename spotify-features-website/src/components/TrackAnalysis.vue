<template>
    <div class="TrackAnalysis">

        <div id="analysis">
            <div id="song" class="window flex" :style="{'--delay': 0}">
                <div class="col">
                    <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
                </div>
                <div class="col fit">
                    <h1>{{trackData.name}}</h1>
                    <div id="artists">
                        <h3 v-for="artist in trackData.artists" :key="artist.name">{{artist.name}}</h3>
                    </div>
                    <h2>{{trackData.album.name}}</h2>
                </div>
            </div>
            <div id="artist" class="window" :style="{'--delay': 1}">
                <div v-if="artistDone" class="flex">
                    <div class="col">
                        <div id="track-image" :style="{backgroundImage: 'url(\'' + artist.images[0].url + '\')'}"/>
                    </div>
                    <div class="col fit">
                        <h1>{{artist.name}}</h1>
                        <h2>{{artist.followers.total}} Followers</h2>
                        <h2>{{artist.genres[0]}}</h2>
                    </div>
                </div>
            </div>

            <div id="stats" class="window" :style="{'--delay': 2}">
                <h3>Song Statistics</h3>
                <div class="row stat">
                    <h4 class="bar-title">Tempo:</h4>
                    <h4 class="value">{{trackData.audioFeatures.tempo}} BPM</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Key:</h4>
                    <h4 class="value">{{keyTell(trackData.audioFeatures.key)}}</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Mode:</h4>
                    <h4 class="value">{{mode(trackData.audioFeatures.mode)}}</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Duration:</h4>
                    <h4 class="value">{{Math.round(trackData.audioFeatures.duration_ms / 6000) / 10}} min</h4>
                </div>
            </div>

            <div id="characteristics" class="window" :style="{'--delay': 3}">
                <h3>Song Characteristics</h3>
                <div class="row stat">
                    <h4 class="bar-title">Happiness</h4>
                    <div class="stat-bar">
                        <div class="fill" :style="{'--percent': + trackData.audioFeatures.valence, '--red': + barColors[0].red, '--green': + barColors[0].green, '--blue': + barColors[0].blue}"/>
                    </div>
                    <h4 class="value">{{percent(trackData.audioFeatures.valence)}}</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Energy</h4>
                    <div class="stat-bar">
                        <div class="fill" :style="{'--percent': + trackData.audioFeatures.energy, '--red': + barColors[1].red, '--green': + barColors[1].green, '--blue': + barColors[1].blue}"/>
                    </div>
                    <h4 class="value">{{percent(trackData.audioFeatures.energy)}}</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Danceability</h4>
                    <div class="stat-bar">
                        <div class="fill" :style="{'--percent': + trackData.audioFeatures.danceability, '--red': + barColors[2].red, '--green': + barColors[2].green, '--blue': + barColors[2].blue}"/>
                    </div>
                    <h4 class="value">{{percent(trackData.audioFeatures.danceability)}}</h4>
                </div>
                <div class="row stat">
                    <h4 class="bar-title">Popularity</h4>
                    <div class="stat-bar">
                        <div class="fill" :style="{'--percent': + (trackData.popularity / 100), '--red': + barColors[4].red, '--green': + barColors[4].green, '--blue': + barColors[4].blue}"/>
                    </div>
                    <h4 class="value">{{trackData.popularity}}%</h4>
                </div>
            </div>

            <div id="banger" class="window" :style="{'--delay': 4}">
                <h3>Is This a Banger?</h3>  
                <div class="row stat">
                    <h4 class="bar-title">Banger-Level</h4>
                    <div class="stat-bar">
                        <div class="fill" :style="{'--percent': + banger, '--red': + barColors[3].red, '--green': + barColors[3].green, '--blue': + barColors[3].blue}"/>
                    </div>
                    <h4 class="value">{{Math.round(banger * 100)}}%</h4>
                </div>
                <h3 id="banger-conclusion">{{bangerConclusion}}</h3>
            </div>

            <div id="banger" class="window"  :style="{'--delay': 0}">
                <div class="loading" v-if="!audioAnalysisReady">
                    <div v-for="bar in 4" :key="'loadingbar'+bar" class="bar" :style="{'--delay': + (bar - 1)}"/>
                </div>
                <h3 class="nomargin">Audio Analysis</h3>  
                <div v-if="audioAnalysisReady" class="graph" :style="{'--numBars': + audioAnalysisSegments}">
                    <div class="graph-bar" v-for="(bar, index) in trackData.audioAnalysis.segments" :style="{'--height': + bar.loudness_max, '--red': + bar.red, '--green': + bar.green, '--blue': + bar.blue,}" :key="'audio-analysis'+index">
                        <p>{{time(bar.start)}}</p>
                    </div>
                </div>
                <p v-if="audioAnalysisReady" class="graph-key">Height: Volume - Color: Pitch</p>
            </div>

            
        
      </div>
    </div>
</template>

<script>
export default {
    name: 'TrackAnalysis',
    props: {
        trackData: Object,
    },
    data() {
        return {
            length: 300,
            background: 25,
            barColors: [
                {red: 242, green: 142, blue: 43},
                {red: 89, green: 161, blue: 79},
                {red: 78, green: 121, blue: 167},
                {red: 225, green: 87, blue: 89},
                {red: 74, green: 189, blue: 180},
                {red: 237, green: 201, blue: 72},
                {red: 255, green: 157, blue: 167},
                {red: 176, green: 122, blue: 161},
                {red: 156, green: 117, blue: 95},
                {red: 180, green: 189, blue: 74},
            ],
            artist: null,
            artistDone: false,
            audioAnalysisReady: false,
            audioAnalysisSegments: 80,
        }
    },
    methods: {
        time(seconds) {
            let zero = "";
            if (seconds % 60 < 10)
            {
                zero = "0";
            }
            if (seconds < 60)
            {
                return "0:" + zero + seconds;
            }
            return Math.floor(seconds / 60) + ":" + zero + (seconds % 60);
        },
        mode(val) {
            if (val)
                return "Major";
            return "Minor";
        
        },
        keyTell(val) {
            let keys = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
            if (val == -1)
                return "Not Found";
            return keys[val % 12];
        },
        percent(value) {
            return Math.round(value * 100) + "%";
        },
        async getArtistDetails() {
            this.artist = await this.$store.dispatch('getArtist', this.trackData.artists[0].id);
            this.artistDone = true;
        },
        cleanAudioAnalysis() {
            let newSegments = [];
            if (this.trackData.audioAnalysis.segments.length < this.audioAnalysisSegments)
                this.audioAnalysisSegments = this.trackData.audioAnalysis.segments.length;
            let width = Math.round(this.trackData.audioAnalysis.segments.length / this.audioAnalysisSegments);
            
            for (var i = 0; i < this.audioAnalysisSegments; i++)
            {
                let itemIndex = Math.round(width * i);
                if (itemIndex > this.trackData.audioAnalysis.segments.length - 1)
                {
                    itemIndex = this.trackData.audioAnalysis.segments.length - 2;
                }
                let sum = 0;
                for (var j = 0; j < this.trackData.audioAnalysis.segments[itemIndex].pitches.length; j++)
                {
                    sum += this.trackData.audioAnalysis.segments[itemIndex].pitches[j];
                }
                let averagePitch = sum / this.trackData.audioAnalysis.segments[itemIndex].pitches.length;
                let color = this.HSVtoRGB(((1 - averagePitch) *229 + -50) / 360,.51,.89);
                let loudness = (Math.round(((this.trackData.audioAnalysis.segments[itemIndex].loudness_max / 60) + 1) * 100) / 100);

                newSegments.push({
                    start: Math.round(this.trackData.audioAnalysis.segments[itemIndex].start),
                    loudness_max: loudness, 
                    red: color.r,
                    green: color.g,
                    blue: color.b,
                });
            }
            this.trackData.audioAnalysis.segments = null;
            this.trackData.audioAnalysis.segments = newSegments;
            this.audioAnalysisReady = true;
        },
        HSVtoRGB(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
    },
    computed: {
        banger() {
            return (this.trackData.audioFeatures.tempo + (this.trackData.audioFeatures.energy*100) + (this.trackData.audioFeatures.danceability*100)) / 375;
        },
        bangerConclusion() {
            let results = ["Banger? More like Bummer", "Nah Bruh", "Not Banger.", "Cool, but not Banger", "Like Sorta Banger?", "Got A Semi-Banger", "Almost Banger", "What a Banger!", "Absolute Banger Bro", "Banger of all Bangers"];
            return results[Math.floor(this.banger * 10)];
        }
    },
    async created() {
        this.getArtistDetails();
        this.trackData.audioAnalysis = await this.$store.dispatch('getAudioAnalysisForTrack', this.trackData.id);
        this.cleanAudioAnalysis();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  margin-top: 30px;
}

.graph-key {
    position: absolute;
    width: calc(100% - 40px);
    bottom: 10px;
    text-align: center;
    font-size: .8em;
    color:rgba(255, 255, 255, 0.267);
}
#banger-conclusion {
    margin: 0 auto;
    text-align: center;
    color: rgb(225, 87, 89);
    font-size: 3em;
}
#track-image {
    display: block;
    width: 100px;
    height: 100px;
    background-size: 100% 100%;
    margin-right: 20px;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

.nomargin {
    margin: 0 !important;
}

.graph {
    --numBars: 0;
    display: flex;
    flex-wrap: nowrap;
    width: 400px;
    height: 187px;
    justify-content: space-between;
    align-items: center;
}

.graph-bar {
    --height: 0;
    --red: 240;
    --green: 193;
    --blue: 111;
    display: block;
    width: calc((100% / var(--numBars)) - 1px);
    height: calc(125px * var(--height));
    background-color: rgba(var(--red), var(--green), var(--blue), .9);
    border-radius: 3px;
    position: relative;
}

.graph-bar p {
    display: none;
    position: absolute;
    font-size: 1em;
    color: white;
    text-align: center;
    top: calc(((125px * var(--height)) / 2) + -80px);
    transform: translateX(-15px);
}

.graph-bar:hover p {
    display: block;
}
.fit {
    width: calc(100% - 120px);
}


#analysis {
    position: relative;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: calc(100% - 64px);
    margin: 32px;
    animation: slide-up .5s ease;
}

h1 {
    font-size: 1.4em;
    color: white;
    text-align: left;
    margin: 0px 0px;
    line-height: 30px;
    display: block;
    max-width: calc(100% - 5px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

h2 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.568);
    text-align: left;
    margin: 0;
    text-transform: capitalize;
}

#artists {
    display: flex;
    width: calc(100% - 45px);
    overflow: hidden;
}

#artists h3 {
    font-size: 1em;
    color: rgba(255, 255, 255, 0.927);
    text-align: left;
    margin: 0px 0px;
    margin-right: 5px;
    
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.window h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  color: white;
  margin-bottom: 15px;
}

h4 {
  color: white;
  display: flex;
  align-items: center;
  margin: 0;
  text-align: left;
}

p {
    margin: 0;
    color: white;
    text-align: left;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s);
  display: inline-block;
  position: relative;
  width: 75%;
  margin: 20px 20px;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}



.flex {
    display: flex;
}

.bar-title {
  width: 115px;
}

.stat-bar {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    width: 200px;
    max-height: 10px;
    background-color: rgba(255, 255, 255, 0.247);
}

.stat-bar .fill {
    --percent: 0;
    --red: 255;
    --green: 255;
    --blue: 255;
    display: block;
    width: calc(var(--percent) * 100%);
    height: 10px;
    background: rgb(var(--red), var(--green), var(--blue));
    animation: slow-fill 1s ease;
}


.stat {
  margin-bottom: 15px;
  justify-content: space-between;
}

@keyframes slow-fill {
  from {
    width: calc(var(--percent) * 0%);
  }
}

.row {
  display: flex;
  align-items: center;
}
</style>