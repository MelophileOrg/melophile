<template>
  <div id="main-flex" class="publicprofiles">
    <NavBar/>
    <div id="main">
      <h1 id="margin">Public Profiles</h1>
      <div id="profiles">
        <PublicProfile v-for="(profile, index) in profiles" :key="profile.id" :data="profile" :delay="index"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/General/NavBar.vue'
import PublicProfile from '@/components/Social/PublicProfile.vue'

import axios from 'axios';

export default {
  name: 'publicprofiles',
  components: {
    NavBar,
    PublicProfile
  },
  data() {
    return {
      profiles: null,
    }
  },
  computed: {

  },
  async created() {
    window.scroll({
      top: 0,
      behavior: 'auto'
    });
    let response = await axios.get("/api/profile");
    console.log(response.data);
    this.profiles = response.data;
  }
}
</script>

<style scoped>
h1 {
    color: #fff;
    margin-left: 32px;
    margin-top: 0px;
    text-align: left;
    -webkit-animation: slide-up .3s ease 0s,hide 0s linear;
    animation: slide-up .3s ease 0s,hide 0s linear;
    position: relative;
}

#margin {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 25px;
  padding-bottom: 15px;
}
</style>