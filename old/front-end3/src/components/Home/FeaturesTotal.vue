<template>
    <div class="FeaturesTotal">
        <div class="flex flex-left content">
            <div class="titles">
                <h2>My Music Taste</h2>
                <h1>Analyze</h1>
                <h1>Share</h1>
                <h1>Discover</h1>
            </div>
            <div class="flex flex-center flex-align-center images">
                <img src="https://i.scdn.co/image/ab67616d0000b273e67b3ca02b6f4ab0946158ea"/>
                <img src="https://i.scdn.co/image/3e2f1571b61ed0acbd4e0df95c280a715b774ddb"/>
                <img src="https://i.scdn.co/image/8a05e09475e260bd3e7e859d7d7cc75bcc6d7f02"/>
                <img src="https://i.scdn.co/image/ab67616d0000b273397d02cfe1aab2923f9d1697"/>
                <img src="https://i.scdn.co/image/ab67616d0000b273a81ec0503c55850ad4687940"/>
                <img src="https://i.scdn.co/image/d59f65dd6a0bf7afcd7dc2fc8e112c347de0d8d4"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'FeaturesTotal',
  components: {
      
  },
  data() {
      return {

      }
  },
  watch: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.FeaturesTotal {
    display: block;
    width: calc(100vw - 260px);
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.295)), linear-gradient(0.25turn, #f18686, #969ef8);
    background-size: 100% 100%;
    background-position: center center;
    color: white;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.144);
}

.titles {
    width: 49%;
    max-width: 400px;
}

h1 {
    font-size: 5em;
    text-align: right;
    margin: 0px 0px 5px 0px;
}

h2 {
    color: rgba(250, 250, 250, 0.726);
    text-align: right;
    margin: 10px 0px 0px 0px;
}

.images {
    width: 49%;
    max-width: 700px;
    flex-wrap: wrap;
    margin-left: 10px;
}

img {
    width: 25vh;
    height: 25vh;
    margin: 8px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.137);
}

</style>
