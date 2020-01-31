<template>
    <div class="ChartList pop-up">
        <table v-if="display">
            <tr v-for="(item, index) in items" :key="item._id" class="chart-row elevation-1">
                <td class="number">{{index + 1}}</td>
                <td class="img" v-if="type == 0 || type == 1" :style="{backgroundImage: 'url(' + item.image + ')'}"></td>
                <td class="name"><h1>{{item.name}}</h1></td>
            </tr>
        </table>
    </div>
</template>

<script>

export default {
    name: 'ChartList',
    props: {
        items: Array,
        tab: Number,
        type: Number,
    },
    data() {
        return {
            display: false,
        }
    },
    async created() {
        this.display = true;
    }
};
</script>


<style scoped>
.MenuList {

}

.chart-row {
    display: flex;
    width: 100%;
    padding: 15px 10px;
    background-color: rgba(255, 255, 255, 0.018);
    margin: 5px 0px;
    border-radius: 3px;
    text-align: left;
}

table {
    width: 100%;
}

td {
    padding: px auto;
}

.img {
    display: block;
    width: 55px;
    height: 55px;
    background-size: auto 100%;
    background-position: center center;
    margin-right: 15px;
    border-radius: 3px;
}

.img .play-button {
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 60% 60%;
  background-image: url('../../assets/icons/play.svg');
  opacity: 0;
  transform: scale(.6, .6);
  transition: all .3s ease;
}

.img:hover .play-button {
  opacity: 1;
  transform: scale(1, 1);
}

h1 {
    margin: 0 0;
    display: block;
    text-align: left;
    max-width: calc(100%);
    font-size: 1.1em; 
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

h1:hover {
    text-decoration: underline;
}

h2 {
    display: block;
    color: hsla(0,0%,100%,.514)!important;
    font-weight: lighter;
    text-transform: capitalize;
    font-size: 15px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
}

h2:hover {
    text-decoration: underline;
}
</style>