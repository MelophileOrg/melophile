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

html {
  background: black;
}
body {
  margin: 0;
  overflow-x: hidden;
  
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
  background-image: radial-gradient(circle at 0px 0px, rgb(43, 42, 42),rgb(0, 0, 0));
  background-size: 100% 100%;
}

#main {
  display: block;
  width: calc(100vw);
  min-height: 100vh;
  position: relative;
}

@media screen and (min-width: 721px) {
  #main {
    width: calc(100vw - 260px);
    min-height: calc(100vh - 71px);
  }

  #main-flex {
    min-height: calc(100vh - 71px);
  }
}

@media screen and (max-width: 720px) {
  .windows {
    margin-top: 15px !important;
  }
  #main {
    min-height: calc(100vh - 71px);
    z-index: 0;
  }

  #main-flex {
    min-height: calc(100vh - 71px);
    z-index: 0;
  }

  .window-title {
    font-size: 1.3em !important;
    margin-bottom: 12px !important;
  }

  .window {
      margin: 18px 18px !important;
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
    transform: translateY(100px);
  }
}

.flex {
  display: flex;
}

.flex-center {
  justify-content: center;
}

.flex-wrap {
  display: block;
  width: 100%;
  flex-wrap: wrap;
}

.flex-space-around {
  justify-content: space-around;
}

.flex-space-between {
  justify-content: space-between;
}

.flex-align-center {
  align-items: center;
}

.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 22px 22px;
  padding: 20px;
  max-width: 400px;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.247);
}

.window-title {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}

.windows {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: top;
  flex-wrap: wrap;
  margin-bottom: 50px;
  margin-top: 30px;
}
</style>
