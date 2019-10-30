<template>
  <div class="spotlight" :style="{'--delay': + 1}">
    <Loading v-if="!override"/>
    <div v-if="override" id="spotlight-data">
        <h3 class="nomargin">{{title}}</h3>
        <div class="row favorite-div">
            <img v-if="image != ''" :src="image"/>
            <div>
            <h4 class="favorite">{{list[0].name}}</h4>
            <h5>{{list[0].value}} Songs</h5>
            </div>
        </div>
        <div>
            <div class="row center">
            <div class="artist" v-for="i in (list.length - 1)" :key="list[i].id" >
                <h4>{{list[i].name}}</h4>
                <h5>{{list[i].value}} Songs</h5>
            </div>
        </div>
    </div>

    </div>
  </div>
</template>

<script>
import Loading from '@/components/General/Loading.vue'

export default {
  name: 'spotlight',
  components: {
    Loading
  },
  props: {
    override: Boolean,
    title: String,
    list: Array,
    image: String,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spotlight {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 20px 20px;
    padding: 20px;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
}
.row {
  display: flex;
  align-items: center;
}

.nomargin {
  margin-bottom: 0 !important;
}

.favorite {
  font-size: 1.8em;
  text-transform: capitalize;
}

.favorite-div
{
  margin-top: 10px;
  margin-bottom: 10px;
  height: 75px;
  padding: 10px 10px;
  background: rgba(255, 255, 255, 0.062);
  overflow: hidden;
}

.favorite-div h5 {
  font-size: 1em;
  margin-top: 5px;
  
}

.center {
  justify-content: space-around;
  flex-wrap: wrap;
}

.artist {
  margin-top: 10px;
  display: block;
  width: 110px;
  padding: 0px 10px;
}

.artist h4 {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  text-transform: capitalize;
}

img {
  display: block;
  height: 70px;
  margin-right: 20px;
}

@media only screen and (max-width: 375px) {
  img {
    display: none;
  }
}

h5 {
    color: hsla(0,0%,100%,.514);
    margin: 0;
    text-align: left;
    font-size: .8em;
}

h4 {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    color: #fff;
    margin: 0;
    text-align: left;
}

h3 {
  text-align: left;
  animation: none;
  font-size: 1.6em;
  margin: 0;
  margin-bottom: 20px;
  color: white;
}
</style>