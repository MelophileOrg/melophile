<template>
    <div class="SearchBar">
        <input v-model="text" placeholder="Search..." type="text"/>
        <button @click="searchTrack"/>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        
    },
    data() {
        return {
            text: "",
        }
    },
    methods: {
        searchTrack() {
            this.$store.dispatch('searchTrack', {text: this.text})
        }
    },
    computed: {
       
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.SearchBar {
    width: 100%;
    background-color: rgba(50, 50, 50, 0.377)
}

input {
    width: calc(100% - 60px);
    height: 100px;
    background: rgba(0,0,0,0);
    color: white;
    border: 0;
    font-size: 50px;
}

</style>
