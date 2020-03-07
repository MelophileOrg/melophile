<template>
    <div class="AddedTimeline" :style="{'--width': + width, '--height': + height}">
        <TimelineAddedGraph :width="width" :height="height" :bars="bars" v-if="bars != null"/>
    </div>
</template>

<script>
let axios = require('axios');

import TimelineAddedGraph from '@/components/Graphs/TimelineAddedGraph.vue'

export default {
    name: 'AddedTimeline',
    props: {
        width: { type: Number, default: 720 },
        height: { type: Number, default: 300 },
    },
    components: {
        TimelineAddedGraph,
    },
    data() {
        return {
            bars: null,
        }
    },
    computed: {
        token() {
            return this.$store.state.authentication.accessToken;
        },
    },
    async created() {
        let response = await axios.put("/api/me/history/added", {token: this.token});
        this.bars = response.data;
        console.log(this.bars);
    }
};
</script>

<style scoped>
.AddedTimeline {
    --width: 720;
    --height: 400;
    width: calc(var(--width) * 1px);
    height: calc(var(--height) * 1px);
}


</style>
