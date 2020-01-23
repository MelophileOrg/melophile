<template>
    <div class="List">
        <div v-for="item in list" :key="type + item">
            <ListItem :id="item" :type="type" v-if="display"/>
        </div>
    </div>
</template>

<script>
import ListItem from '@/components/List/ListItem.vue'

export default {
    name: 'List',
    props: {
        type: Number,
    },
    components: {
        ListItem
    },
    data() {
        return {
            display: false,
            items: [],
        }
    },
    computed: {
        list() {
            return this.$store.state.list.list;
        },
        jimmy() {
            return this.$store.state.jimmy;
        }
    },
    async created() {
        console.log("hey jimmy...");
        this.items = await this.jimmy.getTracks(this.list, false);
        console.log(this.items);
        this.display = true;
    }
};
</script>


<style scoped>
.List {
    

}
</style>