<template>
    <div class="TrackAnalysis">
      <div id="analysis">
        <div class="row">
            <div class="col">
                <div id="track-image" :style="{backgroundImage: 'url(\'' + trackData.album.images[0].url + '\')'}"/>
            </div>
            <div class="col">
                <h1>{{trackData.name}}</h1>
                <div id="artists">
                    <h3 v-for="artist in trackData.artists" :key="artist.name">{{artist.name}}</h3>
                </div>
            </div>
        </div>
        <div class="row" id="song-details">
            <div class="col">
                
                <h2>{{trackData.album.name}}</h2>
            </div>
            <div class="col">
                
                
                
            </div>
        </div>
        <p>{{trackData}}</p>
        <div id="p5Canvas"></div>
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
        }
    },
    methods: {

    },
    computed: {

    },
    async mounted() {
        var trackData = this.trackData;
        
        function script (p5) {
            var length = 300; 
            var background = 25;

            p5.setup = _ => {
                var canvas = p5.createCanvas(length, length);
                canvas.parent("p5Canvas");
                p5.background(background);
                console.log(trackData);
            }

            p5.draw = _ => {
                p5.background(background);
            }
        }

        const P5 = require('p5');
        new P5(script);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#track-image {
    display: block;
    width: 93px;
    height: 93px;
    background-size: 100% 100%;
    margin-right: 20px;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

#analysis {
    position: relative;
    display: block;
    width: calc(100% - 64px);
    margin: 32px;
    animation: slide-up .5s ease;
}

h1 {
    font-size: 3em;
    color: white;
    text-align: left;
    margin: 0px 0px;
    line-height: 45px;
    margin-bottom: 10px;
    margin-top: 5px;
}

h2 {
    font-size: 2em;
    color: rgba(255, 255, 255, 0.568);
    text-align: left;
    margin: 5px 0px;
}

h3 {
    font-size: 1.5em;
    color: rgba(255, 255, 255, 0.568);
    text-align: left;
    margin: 0px 0px;
}

p {
    margin: 0;
    color: white;
    text-align: left;
}

#song-details {

}

.bar {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.247);
}

.bar .fill {
    --percent: 0;
    display: block;
    width: calc(var(--percent) * 100%);
    height: 100%;
}

.row {
    display: flex;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
}
</style>