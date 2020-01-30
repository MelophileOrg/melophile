<template>
    <div class="MenuList pop-up">
        <div v-if="display">
            <MenuListItem :type="type" @addItem="addItem" :index="index" :item="item" v-for="(item, index) in items" :key="type + item._id"/>
        </div>
    </div>
</template>

<script>
import MenuListItem from '@/components/List/MenuListItem.vue'

export default {
    name: 'MenuList',
    props: {
        items: Array,
        type: Number,
    },
    components: {
        MenuListItem
    },
    methods: {
        addItem(index) {
            this.$emit('addItem', index);
        }
    },
    data() {
        return {
            display: false,
        }
    },
    async created() {
        this.display = true;
    }
};
</script>


<style scoped>
.MenuList {
    background-color: #40404d;
    width: calc(100% - 12px);
    margin: 0 auto;
    padding: 0px 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>