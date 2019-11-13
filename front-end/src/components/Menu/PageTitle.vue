<template>
  <div class="pagetitle">
      <h1>{{title}}</h1>
      <button @click="route" v-if="link">{{linkTitle}}</button>
  </div>
</template>

<script>

export default {
  name: 'pagetitle',
  props: {
      title: String,
      linkTitle: String,
      link: String,
  },
  methods: {
      route() {
        this.$router.push(this.link);
      }
  }
}
</script>

<style scoped>

.pagetitle {
    display: flex;
    align-items: center;
    justify-content: left;
    width: calc(100% - 64px);
    padding: 10px 32px;
    margin-top: 10px;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
}

.pagetitle h1 {
    display: inline-block;
    color: #fff;
    position: relative;
    text-align: left;
    margin: 0;
}
.pagetitle button {
  border: 0px;
  color: rgba(255, 255, 255, 0.486);
  background-color: rgba(255, 255, 255, 0.103);
  font-size: 1.2em;
  height: 2em;
  border-radius: 20px;
  margin-left: 20px;
  padding: 5px 20px;
  transition: all .3s ease;
}

.pagetitle button:hover {
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.103);
}

</style>