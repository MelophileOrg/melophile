<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html {
  position: relative;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
  width: 100vw;
  min-height: 100vh;
}

#main {
  display: block;
  width: calc(100vw - 230px);
  min-height: 100vh;
  overflow: auto;
  /*padding: 0px 32px;*/
  background-image: radial-gradient(circle at 0px 0px, rgb(63,73,76), rgb(6,6,6));
}
</style>
