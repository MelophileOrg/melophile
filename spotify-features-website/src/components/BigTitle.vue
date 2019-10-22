<template>
    <div class="BigTitle">
        <div :class="{topMargin: top, left: align == 'left', right: align == 'right'}" id="big-title">
            <img src="../assets/icons/logo.svg"/>
            <h1>My Music Taste</h1>
        </div>
    </div>
</template>

<script>
export default {
  name: 'BigTitle',
  props: {
    align: String,
    top: Boolean,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#big-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
}

.topMargin {
  margin-top: 15vh !important;
}

.left {
  justify-content: left !important;
}

.right {
  justify-content: right !important;
}

img {
  display: block;
  width: 70px;
  height: 70px;
  margin-right: 20px;
}


#big-title h1 {
  color: white;
  font-size: 70px;
  margin: 0px;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.123);
  position: relative;
}
p {
  position: absolute;
  font-size: .15em;
  right: 0px;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.123);
  font-weight: lighter;
}
</style>
