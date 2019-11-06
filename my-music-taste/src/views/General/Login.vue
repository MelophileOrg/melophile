<template>
  <div id="main-flex" class="login">
    <div id="large">
      <button @click="gohome()" id="deny">No Thanks</button>
      <div id="title-div">
        <img src="../../assets/icons/kiwi2.svg"/>
        <h1>My Music Mood</h1>
      </div>
      <h1 id="description">View an indepth analysis of your music taste!</h1>
      <div id="carousel">
        <Timeline v-if="data[index].type == 'timeline'" :override="true" title="When You Added Songs:" instructions="" :max="-1" :delay="0" :bars="data[index].data" y_axis="Number of Songs" :color="{red: 74, green: 189, blue: 180}"/>
        
      </div>
      
      <button id="authorize" @click="login">Authorize with Spotify</button>
    </div>
  </div>
</template>

<script>
import Timeline from '@/components/Analysis/Timeline.vue'
// import TimelinePercent from '@/components/Analysis/TimelinePercent.vue'
// import Spotlight from '@/components/Library/Spotlight.vue'

export default {
  name: 'login',
  components: {
    Timeline,
    // TimelinePercent,
    // Spotlight
  },
  data() {
    return {
      index: 0,
      timer: 5,
      interval: null,
      data: [
        {
          type: "timeline",
          data: [{value: 110, tag: 110},{value: 2, tag: 2},{value: 5, tag: 5},{value: 15, tag: 15},{value: 4, tag: 4},{value: 0, tag: 0},{value: 7, tag: 7},{value: 4, tag: 4},{value: 4, tag: 4},{value: 1, tag: 1},{value: 4, tag: 4},{value: 0, tag: 0},{value: 0, tag: 0},{value: 0, tag: 0},{value: 0, tag: 0},{value: 0, tag: 0},{value: 30, tag: 30},{value: 0, tag: 0},{value: 0, tag: 0},{value: 1, tag: 1},{value: 0, tag: 0},{value: 8, tag: 8},{value: 0, tag: 0},{value: 45, tag: 45},{value: 302, tag: 302},{value: 122, tag: 122},{value: 0, tag: 0},{value: 1, tag: 1},{value: 0, tag: 0},{value: 6, tag: 6},{value: 37, tag: 37},{value: 0, tag: 0},{value: 0, tag: 0},{value: 1, tag: 1},{value: 18, tag: 18},{value: 0, tag: 0},{value: 1046, tag: 1046},{value: 217, tag: 217},{value: 54, tag: 54},{value: 390, tag: 390},{value: 92, tag: 92},{value: 79, tag: 79},{value: 69, tag: 69},{value: 124, tag: 124},{value: 13, tag: 13},{value: 492, tag: 492},{value: 240, tag: 240},{value: 114, tag: 114},{value: 145, tag: 145},{value: 199, tag: 199},{value: 23, tag: 23},{value: 28, tag: 28},{value: 61, tag: 61},{value: 18, tag: 18},{value: 38, tag: 38},{value: 52, tag: 52},{value: 194, tag: 194}],
        }
      ],
    }
  },
  methods: {
    jumpTo(index) {
      this.index = index;
      this.timer = 9;
    },
    changePage() {
      if (this.$router.currentRoute.name != "login") {
        clearInterval(this.interval);
      }
      if (this.timer <= 0) {
        let newIndex = this.index + 1;
        if (newIndex >= this.data.length) {
          newIndex = 0;
        }
        this.index = newIndex;
      }
      else {
        this.timer -= 1;
      }
    },
    login() {
      this.$store.dispatch('inicializeGetToken');
    },
    gohome() {
      this.$router.push("/");
    }
  },
  created() {
    this.interval = setInterval(this.changePage, 1000);
  }
}
</script>

<style scoped>
#carousel {
  --speed: 10s;
  --items: 1;
  margin: 15px 0;
  margin-bottom: 0px;
  position: relative;
  display: block;
  height: 380px;
}

#title-div {
  margin-top: 8vh;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}


@media screen and (max-width: 720px) {
  #description {
    font-size: 15px !important;
  }
}

#description {
  color: rgba(255, 255, 255, 0.514);
  font-size: 15px;
  font-weight: lighter;
  margin: 0;
}

#title-div h1 {
  display: inline-block;
  margin: 0;
  margin-left: 10px;
}

#large {
  --red: 240;
  --green: 240;
  --blue: 240;
  --speed: 15;
  width: 100vw;
  height: 100vh;
  position: relative;
  display: block;
  background-image: linear-gradient( rgba(0, 0, 0, 0.329),rgb(0, 0, 0));
  background-color: rgb(240,240,240);
  background-size: 500% 100%;
  background-position: center center;
  animation: background-cool calc(var(--speed) * 1s) ease infinite;
  transition: background-color calc(var(--speed) * 1.25s) ease;
}

@keyframes background-cool {
  0% {
    background-color: rgb(240,240,240);
  }
  12% {
    background-color: rgb(247,240,177);
  }
  25% {
    background-color: rgb(247,177,177);
  }
  37% {
    background-color: rgb(247,177,244);
  }
  50% {
    background-color: rgb(178,177,247);
  }
  62% {
    background-color: rgb(177,245,247);
  }
  75% {
    background-color: rgb(177,247,186);
  }
  87% {
    background-color: rgb(247,240,177);
  }
  100% {
    background-color: rgb(240,240,240);
  }
}


#deny {
  background: rgba(5, 5, 5, 0);
  color: rgba(255, 255, 255, 0.61);
  font-size: 1em;
  border: 0;
  position: absolute;
  right: 2%;
  top: 2%;
  transition: all .4s ease;
}

#deny:hover {
  color: white;
}

h1 {
  color: white;
}

#authorize {
  background: rgb(31, 165, 31);
  color: white;
  display: block;
  border: 0;
  padding: 15px 25px;
  font-size: 1em;
  font-weight: bolder;
  border-radius: 20px;
  margin: 0 auto;
  transition: all .3s ease;
}

#authorize:hover {
  background: rgb(64, 212, 64);
}

</style>