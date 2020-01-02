<template>
  <div class="progressbar">
      <h1>Processing Your Library</h1>
      <div id="progress-bar">
          <div id="progress-fill" :style="{'--percent': + (progress.processed / progress.total)}"/>
      </div>
      <h2>{{messages[index]}}</h2>
  </div>
</template>

<script>

export default {
    name: 'progressbar',
    data() {
        return {
            index: 0,
            interval: null,
            messages: [
                "Pluggin in headphones.",
                "♪┏(・o･)┛♪┗ ( ･o･) ┓♪",
                "Sick beats dude.",
                "Jamming out to your tunes.",
                "Pluggin in headphones.",
                "Beep Bop. Analyzing Data.",
                "Crunchy Numbers.",
                "01110010 01100001 01100100",
                "Dividing by zero.",
            ],
        }
    },
    methods: {
        changeMessage() {
            if (this.progress.tracksLoaded) {
                clearInterval(this.interval);
                return;
            }
            let random = Math.floor(Math.random() * this.messages.length);
            while (random == this.index) {
                random = Math.floor(Math.random() * this.messages.length);
            }
            this.index = random;
        },
    },
    computed: {
        progress() {
            return this.$store.state.progress;
        },
    },
    created() {
        this.interval = setInterval(this.changeMessage, 3000);
    }
}
</script>

<style scoped>
.progressbar {
    color: white;
    animation: slide-up .5s ease;
}

#progress-bar {
  display: block;
  width: 40%;
  height: 8px;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(250, 250, 250, 0.173);
  margin: 0 auto;
  margin-top: 20px;
  max-width: 500px;
}

#progress-fill {
  --percent: 0;
  display: block;
  background: rgb(244, 244, 244);
  width: calc(var(--percent) * 100%);
  height: 100%;
}

h1 {
    font-size: 3em;
    margin-bottom: 5px;
}

h2 {
    margin: 5px;
  margin-top: 10px;
  color: white;
  animation: throb 2s ease 0s infinite;
  font-size: 1.5em;
}

@keyframes throb {
  0% {
    color: white;
    text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
  50% {
    color: rgb(167, 167, 167);
    text-shadow: 0px 0px 0px rgba(255, 255, 255, 0.482);
  }
  100% {
     text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.666);
  }
}
</style>