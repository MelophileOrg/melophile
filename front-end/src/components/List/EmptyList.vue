<template>
    <div class="EmptyList">
        <EmptyListItem :index="i" :delay="delay" v-for="i in num" :key="'emptylistitem' + i"/>
    </div>
</template>

<script>
import EmptyListItem from '@/components/List/EmptyListItem.vue'

export default {
    name: 'EmptyList',
    props: {
        num: Number,
        delay: Number,
    },
    components: {
        EmptyListItem
    },
};
</script>


<style scoped>
.EmptyList {

}

</style>