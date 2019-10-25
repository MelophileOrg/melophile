<template>
  <div class="boring maindiv">
    <NavBar path="boring" />
    <div id="main">
        <h1 v-if="testing" id="development">Currently Unavailable</h1>
        <AppTitle v-if="!start && !testing" title="Boring-Radar" image="boring" font="Acme"/>
        <button v-if="!testing && done">Start</button>
        <button v-if="!testing && !done" @click="route('libraryanalysis')">Run Library Analysis First</button>



      
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import AppTitle from '@/components/AppTitle.vue'

export default {
  name: 'boring',
  components: {
    NavBar,
    AppTitle
  },
  data() {
      return {
          start: false,
      }
  },
  methods: {
    route(path) {
      this.$router.push("/" + path);
    }
  },
  computed: {
    inicialized() {
      return this.$store.state.inicialized;
    },
    libraryData() {
      return this.$store.state.libraryData;
    },
    testing() {
      return !this.$store.state.testing;
    },
    done() {
      return this.$store.state.libraryData.complete.done;
    },
  },
  created: function() {
    if (!this.inicialized)
      this.$router.push("/login");
  }
}
</script>

<style scoped>
#title {
    margin-left: 64px;
}
#development{
  color: white; 
  font-size: 4em;
  margin: 0 auto;
  margin-top: 15vh;
  text-align: center;
}

button {
  padding: 10px 50px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.137);
  border-radius: 5px;
  color: rgb(255, 255, 255);
  border: 0px;
  font-weight: bolder;
  font-size: 1.2em;
  animation: slide-up .3s ease .3s, peekaboo .3s linear;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

h1 {
  font-size: 36px;
  line-height: 93px;
  letter-spacing: -.005em;
  cursor: default;
  color: rgba(223, 223, 223, 0.342);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.123);
  padding-left: 32px;

  text-align: left;
  margin: 0 auto;
  margin-top: 20px;
  width: calc(100% - (64px * 2));
}

#main {
  overflow-y: scroll;
}
</style>
