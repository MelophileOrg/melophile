
<template>
    <div class="AppTitle">
        <div :class="{lessmargin: drop}" id="title-div">
            <img id="title-image" :src="getImgUrl(image)"/>
            <h1 id="title" :class="{Monoton: font == 'Monoton', Acme: font == 'Acme', PatuaOne: font == 'PatuaOne'}">{{title}}</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppTitle',
    props: {
        title: String,
        image: String,
        font: String,
        drop: Boolean,
    },
    methods: {
        getImgUrl(pic) {
            var images = require.context('../assets/icons', false, /\.svg$/)
            return images('./' + pic + ".svg");
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#title-div {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slide-up .3s ease 0s;
}

@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
}

#title-image {
  display: block;
  width: 60px;
  height: 60px;
  background-size: 100% 100%;
  margin-right: 30px;
}



.Monoton {
    font-family: 'Monoton', cursive;
}

.Acme {
    font-family: 'Acme', sans-serif;
}

.PatuaOne{
    font-family: 'Patua One', cursive;
}



#title {
  margin-top: 0vh;
  font-weight: lighter;
  color: white;
  font-size: 60px;
  margin: 0;
}

@media screen and (min-width: 1000px) {
  #title-div {
    margin-top: 15vh;
  }
  #title-div.lessmargin {
      margin-top: calc(15vh - 102px);
  }
  #title-image {
    height: 100px !important;
    width: 100px !important;
  }
  #title {
    font-size: 100px !important;
  } 
}

@media screen and (min-width: 890px) {
  #title-image {
    height: 80px;
    width: 80px;
  }
  #title {
    font-size: 80px;
  } 
}
</style>
