<template>
  <div id="app">
    <div id="background"/>
    <router-view/>
  </div>
</template>

<style>/* Fonts */
@import url('https://fonts.googleapis.com/css?family=Acme|EB+Garamond|Monoton|Patua+One|Roboto|Staatliches&display=swap');
/*
font-family: 'Roboto', sans-serif;
font-family: 'Acme', sans-serif;
font-family: 'Monoton', cursive;
font-family: 'Patua One', cursive;
font-family: 'Staatliches', cursive;
font-family: 'EB Garamond', serif;
*/
</style>
<style>/* Base CSS */
html {
  background: rgba(0, 0, 0, 0.986);
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

html::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(124, 102, 102, 0.3);
    background-color: rgba(6, 6, 6, 0)
}

html::-webkit-scrollbar
{
    width: 5px;
    background-color: rgba(6, 6, 6, 0.007)
}

html::-webkit-scrollbar-thumb
{
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.288);
}
</style>
<style>/* Page Building */
#main-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  min-height: 100vh;
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
  #main {
    min-height: calc(100vh - 71px);
    z-index: 0;
  }

  #main-flex {
    min-height: calc(100vh - 71px);
    z-index: 0;
  }
}
</style>
<style>/* Windows */
.window {
  --delay: 0;
  animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
  display: inline-block;
  width: 75%;
  margin: 30px 30px !important;
  padding: 30px;
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
  max-width: 1450px !important;
  justify-content: center;
  align-items: top;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-bottom: 50px;
  margin-top: 30px;
}

@media screen and (max-width: 720px) {
  .windows {
    margin-top: 15px !important;
  }

  .window-title {
    font-size: 1.3em !important;
    margin-bottom: 12px !important;
  }

  .window {
      margin: 18px 18px !important;
      padding: 22px !important;
  }
}
</style>
<style>/* Animations */
@keyframes hide {
  from {
    opacity: 0;
  }
  to {
    opacity: 0;
  }
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>
<style>/* Flex */
.flex {
  display: flex;
}

.flex-center {
  justify-content: center;
}

.flex-wrap {
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
</style>