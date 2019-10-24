<template>
  <div class="home maindiv">
    <NavBar path="home" />
    <div id="main">
      <BigTitle id="title" align="left"/>
      <div class="app-showcase" v-for="(app, index) in apps" :key="app.title+ index" :style="{'--red': app.color.red, '--blue': app.color.blue, '--green': app.color.green}">
        <div class="flex">
          <img :src="getImgUrl(app.img)"/>
          <h1>{{app.title}}</h1>
        </div>
        <div class="description">
        <p v-for="(line, lineindex) in app.description" :key="app.title + 'description' + lineindex">{{line}}</p>
        </div>
        <button @click="route(app.path)">Launch</button>
      </div>
      <Thank/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import Thank from '@/components/Thank.vue'
import BigTitle from '@/components/BigTitle.vue'

export default {
  name: 'home',
  components: {
    NavBar,
    Thank,
    BigTitle,
  },
  methods: {
    getImgUrl(pic) {
        var images = require.context('../assets/icons', false, /\.svg$/)
        return images('./' + pic + ".svg");
    },
    route(path, index) {
        if (path == this.path)
            return;
        if (path != "")
        {
            this.$store.dispatch("changeIndex", {index: index});
            this.$router.push("/" + path);
        }
        else 
            this.$router.push("/");
    },
  },
  computed: {
    token() {
      return this.$store.state.access_token;
    },
    apps() {
      return this.$store.state.apps;
    },
    available() {
      return this.apps.filter(function(app) {
        return app.state;
      });
    },
    development() {
      return this.apps.filter(function(app) {
        return !app.state;
      });
    }
  },
  created: function() {
    setInterval(this.showPath,1000);
  }
}
</script>

<style scoped>

#title {
  margin: 60px 64px;
  margin-bottom: 70px;
}

img {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}

h1 {
  font-size: 3.8em;
  color: white;
  text-align: left;
  margin: 0;
}

.app-showcase {
  --red: 0;
  --green: 0;
  --blue: 0;
  --padding: 50;
  display: block;
  width: calc(100% - var(--padding) * 2px);
  padding: calc(var(--padding) * 1.4px) calc(var(--padding) * 1px);
  background-color: rgb(var(--red), var(--green), var(--blue));
  background-image: radial-gradient(circle at center center, rgb(var(--blue), var(--green), var(--red)), rgb(var(--red), var(--green), var(--blue)));
  background-size: 100% 300%;
  background-position: center -300%;
  animation: background-move 10s linear infinite;
}

@keyframes background-move {
  100% {
    background-position: center 0%;
  }
}

.flex {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
}

p {
  color: white;
  
  line-height: 30px;
  font-size: 1.2em;
  text-align: left;
  margin-bottom: 10px;
}

.description {
  display: block;
  width: calc(90% - 60px);
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  margin-bottom: 30px;
  background-color: rgba(22, 22, 22, 0.103);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.068);
}

button {
  border-radius: 10px;
  margin-top: 0px;
  padding: 10px 30px;
  border: 1px solid rgba(255, 255, 255, 0.205);
  color: white;
  font-size: 1.6em;
  background-color: rgba(var(--blue), var(--green), var(--red), .9);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.205);
}

#main {
  overflow-y: scroll;
}
</style>
