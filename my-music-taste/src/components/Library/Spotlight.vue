<template>
  <div class="spotlight" :style="{'--delay': + delay}">
    <Loading v-if="!override"/>
    <div v-if="override && list.length > 0" id="spotlight-data">
        <h3  class="window-title nomargin">{{title}}</h3>
        <div class="row favorite-div">
            <img v-if="image != ''" :src="image"/>
            <img v-if="image == ''" src="../../assets/icons/genres.svg"/>
            <div>
            <h4 v-if="numOff" @click="routeTo(list[0])" class="favorite">{{list[0]}}</h4>
            <h4 v-if="!numOff" @click="routeTo(list[0])" class="favorite">{{list[0].name}}</h4>
            <h5 v-if="!numOff">{{list[0].value}} Songs</h5>
            </div>
        </div>
        <div>
            <div class="flex max">
            <div class="artist" v-for="i in (list.length - 1)" :key="list[i].id" >
              <h4 v-if="numOff" @click="routeTo(list[i])">{{list[i]}}</h4>
                <h4 v-if="!numOff" @click="routeTo(list[i])">{{list[i].name}}</h4>
                <h5 v-if="!numOff">{{list[i].value}} Songs</h5>
            </div>
        </div>
        <p v-if="!numOff && !profile" @click="toCharts">View More</p>
    </div>

    </div>
    <div class="choosebutton" v-if="save" @click="toggleSave" :class="{add: !state, remove: state}"></div>
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
    delay: Number,
    image: String,
    numOff: Boolean,
    save: Boolean,
    state: Boolean,
    profile: Boolean,
  },
  methods: {
    toCharts(){
      this.$router.push('/charts');
    },
    routeTo(value) {
      if (this.numOff) {
        this.$router.push('/genres/' + value);
      }
      else if (this.image == "") {
        this.$router.push('/genres/' + value.name);
      }
      else {
        this.$router.push('/artists/' + value.id);
      }
    },
    toggleSave() {
      this.$emit('toggleSave');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spotlight {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 30px 30px !important;
    padding: 30px;
    position: relative;
    max-width: 400px;
    border-radius: 5px;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
    position: relative;
}

@media screen and (max-width: 720px) {
  .spotlight {
    padding: 22px !important;
  }
}

.max {
  width: 100%;
  overflow: hidden;
}
.row {
  display: flex;
  align-items: center;
}

.nomargin {
  margin-bottom: 15px !important;
}

.favorite {
  font-size: 1.8em;
  text-transform: capitalize;
  margin-left: 3px;
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
  margin-left: 3px;
  
}

.center {
  justify-content: space-around;
  flex-wrap: wrap;
}

.artist {
  margin: 0 auto;
  margin-top: 10px;
  display: block;
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
  margin-right: 10px;
}


@media screen and (max-width: 720px) {
  .favorite {
    font-size: 1.4em;
  }

  .favorite-div
  {
    padding: 5px 10px;
  }

  img {
    display: block;
    height: 60px;
    max-width: 87px;
    margin-right: 5px;
  }

  .artist h4 {
    font-size: .9em;
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
    cursor: pointer;
}

h4:hover {
  text-decoration: underline;
}


p {
  color: rgba(255, 255, 255, 0.11);
  margin: 0;
  font-size: 1em;
  text-align: right;
  cursor: pointer;
  transition: all .3s ease;
  width: 100px;
  position: absolute;
  top: 20px;
  right: 20px;
}

p:hover {
  color: white;
}
</style>