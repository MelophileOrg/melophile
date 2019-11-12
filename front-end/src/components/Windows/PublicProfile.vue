<template>
    <div class="PublicProfile" :style="{'--delay': + 0}" @click="route">
        <h1>{{data.name}}</h1>
    </div>
</template>

<script>
export default {
    name: 'PublicProfile',
    props: {
        delay: Number,
        data: Object,
    },
    methods: {
        route() {
            this.$router.push("/social/profile/" + this.data.id);
        }
    },
    computed: {
        
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.PublicProfile {
    --delay: 0;
    animation: slide-up .5s ease calc(var(--delay) * .1s), hide calc(var(--delay) * .1s);
    display: inline-block;
    width: 75%;
    margin: 30px 30px !important;
    padding: 30px;
    max-width: 400px;
    border-radius: 5px;
    position: relative;
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.247);
    cursor: pointer;
}

h1 {
    color: white;
    margin: 0;
    text-align: left;
}


</style>