<template>
  <div class="spotlight window" :style="{'--delay': + delay}">
    <Loading v-if="!override"/>
    <div v-if="override && list.length > 0" id="spotlight-data">
        <h3  class="window-title nomargin">{{title}}</h3>
        <div class="row favorite-div" v-for="(item, index) in list" :key="'spotlight-'+  title + index">
            <div class="image" v-if="image != ''" :style="{ backgroundImage: 'url(\'' + item.image + '\')'}"/>
            <img v-if="image == ''" src="../../assets/icons/genres.svg"/>
            <div>
            <h4 v-if="numOff" @click="routeTo(item)" class="favorite">{{item}}</h4>
            <h4 v-if="!numOff" @click="routeTo(item)" class="favorite">{{item.name}}</h4>
            <h5 v-if="!numOff">{{item.value}} Songs</h5>
            </div>
        </div>
        <p v-if="!numOff && !profile" @click="toCharts">View More</p>
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
  created() {
    console.log(this.list);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.max {
  width: 100%;
  overflow: hidden;
}
.row {
  display: flex;
  align-items: center;
}



.favorite {
  font-size: 1.1em;
  text-transform: capitalize;
  margin-left: 3px;
}

.index {
  color: rgba(255, 255, 255, 0.493);
  font-size: 1.1em;
  display: inline-block !important;
  text-transform: capitalize;
  margin-left: 3px;
  width: 20px;
}

.index:hover {
  text-decoration: none;
  cursor: default;
}

.favorite-div
{
  margin-top: 2px;
  height: 60px;
  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.062);
  overflow: hidden;
}

.favorite-div h5 {
  font-size: .9em;
  margin-top: 0px;
  margin-left: 3px;
  
}

.center {
  justify-content: space-around;
  flex-wrap: wrap;
}

img {
  display: block;
  height: 50px;
  width: 50px;
  margin-right: 10px;
}

.image {
  display: block;
  height: 50px;
  width: 50px;
  margin-right: 10px;
  background-position: center center;
  background-size: auto 100%;
}


@media screen and (max-width: 720px) {
  .favorite {
    font-size: 1em;
  }

  .favorite-div
  {
    padding: 10px 10px;
  }

  img {
    display: block;
    height: 45px;
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