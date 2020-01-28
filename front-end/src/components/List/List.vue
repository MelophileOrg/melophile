<template>
    <div class="List">
        <div v-if="display">
            <ListItem v-intersect.once="onIntersect" :delay="delay" :index="index" :item="item" :type="type" v-for="(item, index) in items" :key="type + item._id"/>
        </div>
    </div>
</template>

<script>
import ListItem from '@/components/List/ListItem.vue'

export default {
    name: 'List',
    props: {
        items: Array,
        type: Number,
        delay: Number,
    },
    components: {
        ListItem
    },
    data() {
        return {
            display: false,
        }
    },
    methods: {
        onIntersect(index) {
            if (index != this.items.length - 1) return;
            this.$emit('listEnd', this.items.length);
        }
    },
    async created() {
        this.display = true;
    }
};
</script>


<style scoped>

</style>