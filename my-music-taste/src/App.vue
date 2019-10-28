<template>
  <div id="app">
    <router-view/>
    <div id="background"/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Acme|EB+Garamond|Monoton|Patua+One|Roboto|Staatliches&display=swap');
/*
font-family: 'Roboto', sans-serif;
font-family: 'Acme', sans-serif;
font-family: 'Monoton', cursive;
font-family: 'Patua One', cursive;
font-family: 'Staatliches', cursive;
font-family: 'EB Garamond', serif;
*/
body {
  margin: 0;
}

#app {
  font-family: Avenir,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

#main-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  min-height: 100vh;
}

#background {
  display: block;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -10;
  background-image: radial-gradient(circle at 0px 0px, rgb(49, 49, 49),rgb(0, 0, 0));
  background-size: 100% 100%;
}

#main {
  display: block;
  width: calc(100vw);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  z-index: 0;
}

@media screen and (min-width: 720px) {
  #main {
    width: calc(100vw - 260px);
  }
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
  --height: 27;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--height) * 1px);
}

.loading .bar {
  --delay: 0;
  --speed: .5;
  display: block;
  width: 5px;
  height: 12px;
  margin: 2px;
  border-radius: 1px;
  background-color: white;
  animation: loading calc(var(--speed) * 1s) ease-in-out calc(var(--delay) * var(--speed) * 1s / -4) infinite;
}

@keyframes loading {
  50% {
    height: 25px;
  }  
}

@keyframes hide {
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}

.slide-up {
  --slidedelay: 0;
  animation: slide-up .5s ease-out calc(var(--slidedelay) * .1s), hide calc(var(--slidedelay) * .1s);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
}
</style>
