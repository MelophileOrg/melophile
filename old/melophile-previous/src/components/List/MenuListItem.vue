<template>
  <div class="MenuListItem flex flex-align-center" @click="addItem(index)">
      <div class="img" :style="{backgroundImage: 'url(' + image + ')'}"/>
      <div class="flex limit">
      <h1>{{item.name}}</h1>
      <h1 v-if="type == 0" class="artist"> - {{item.artists[0].name}}</h1>
      </div>
  </div>
</template>

<script>

export default {
    name: 'MenuListItem',  
    props: {
        index: Number,
        item: Object,
        type: Number,
    },
    methods: {
        addItem(index) {
            this.$emit('addItem', index);
        }
    },
    computed: {
      image() {
        if (this.item.image != "Undefined")
          return this.item.image;
        return "https://i.ibb.co/m6qD5cD/undefined-image.png";
      }
    }
};
</script>


<style scoped>
.MenuListItem {
    display: flex;
    width: calc(100%);
    padding: 10px;
    border-radius: 0px;
    transition: all .3s ease;
    cursor: pointer;
}

.MenuListItem:hover {
    background-color: #52e3c13d;
}

.img {
    display: block;
    width: 30px;
    border-radius: 100%;
    height: 30px;
    background-size: 100% 100%;
    background-position: center center;
    margin-right: 15px;
}

.limit {
  max-width: calc(100% - 70px);
}

h1 {
  display: inline-block;
  font-size: 1em;
  font-weight: lighter;
  max-width: calc(100% - 45px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

h1.artist {
  color: rgba(255, 255, 255, 0.26);
  margin-left: 10px;
}
</style>