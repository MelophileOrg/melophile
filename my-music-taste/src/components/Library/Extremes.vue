<template>
  <div class="Extremes">
      <Selector :items="selector" :load="false" :override="false" @pending="pending" @selection="select"/>
  </div>
</template>

<script>
import Selector from '@/components/Library/Selector.vue'

export default {
  name: 'Extremes',
  components: {
      Selector
  },
  data() {
    return {
        selector: [
            {type: "text", text: "List My"}, 
            {
                type: "select", 
                options: [
                    {value: "most", text: "Most"},
                    {value: "least", text: "Least"}
                ]
            },
            {
                type: "select", 
                options: [
                    {value: "valence", text: "Happy"},
                    {value: "energy", text: "Energetic"},
                    {value: "danceability", text: "Danceable"},
                    {value: "tempo", text: "High Tempos"},
                    {value: "banger", text: "Bangers"},
                    {value: "acousticness", text: "Accoustic"},
                    {value: "instrumentalness", text: "Instrumental"},
                    {value: "liveness", text: "Live"},
                    {value: "speechiness", text: "Talking"},
                ]
            }
        ],

    }
  },
  methods: {
      select(val) {
          console.log(val);
      },
      pending() {
          console.log("pending");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Extremes {

}

</style>
