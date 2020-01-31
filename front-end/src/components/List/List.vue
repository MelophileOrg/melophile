<template>
    <div class="List">
        <div v-if="display">
            <ListItem :feature="feature" :trackNum="trackNum" v-intersect.once="onIntersect" :number="number" :delay="delay" :index="index" :item="item" :type="type" v-for="(item, index) in items" :key="'list-item' + index"/>
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
        number: Boolean,
        trackNum: Boolean,
        feature: String,
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
        },
        key(item) {
            if ('_id' in item) return this.type + item._id;
            else return this.type + item.name;
        }
    },
    async created() {
        this.display = true;
    }
};
</script>


<style scoped>

</style>