<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');


html {
  position: relative;
  overflow-x: hidden;
  background-image: radial-gradient(circle at 230px 0px, rgb(29, 29, 29),rgb(0, 0, 0));
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
  width: 100vw;
  overflow-x: hidden;
}

@keyframes peekaboo {
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}

#main {
  display: block;
  width: calc(100vw - 225px);
  overflow-x: hidden;
}

html::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: rgb(6,6,6)
}

html::-webkit-scrollbar
{
    width: 18px;
    background-color: rgb(6,6,6)
}

html::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgba(255, 255, 255, 0.164);
}

.loading {
  display: flex;
  width: 100%;
  height: 27px;
  justify-content: center;
  align-items: center;
}

.bar {
  --delay: 0;
  --speed: .5;
  display: block;
  width: 5px;
  
  height: 12px;
  border-radius: 1px;
  margin: 2px;
  animation: loading calc(var(--speed) * 1s) ease-in-out calc(var(--delay) * var(--speed) * 1s / -4) infinite;
  background-color: white;
}

@keyframes loading {
  50% {
    height: 25px;
  }  
}
</style>
