<template>
    <div class="List padding-2">
        <div v-for="(item, index) in list" :key="item._id" class="flex flex-align-center">
            <p class="item-label" v-if="label != null">{{itemLabel(index, item)}}</p>
            <ListItem @play="playFrom(index)" :data="item" :type="type"/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import ListItem from '@/components/Lists/ListItem.vue'

export default {
    name: 'List',
    components: {
        ListItem
    },
    props: {
        type: String,
        label: String,
        list: Array,
    },
    methods: {
        itemLabel(index, item) {
            if (this.label == 'index') {
                return (index + 1);
            } else {
                return item[this.label];
            }
        },
        async playFrom(index) {
            try {
                switch(this.type) {
                    case 'artist': {
                        axios.put('/api/play/artist/' + this.list[index]._id);
                        break;
                    }
                    case 'album': {
                        axios.put('/api/play/album/' + this.list[index]._id);
                        break;
                    }
                    case 'playlist': {
                        axios.put('/api/play/playlist/' + this.list[index]._id);
                        break;
                    }
                    default: {
                        let ids = this.list.map((item) => {
                            return item._id;
                        });
                        axios.put('/api/play/track', {tracks: await ids.concat(await ids.splice(0, index)) });
                        break;
                    }
                }
            } catch (error) {
                return;
            }
        }
    }
}
</script>

<style scoped>
.item-label {
    font-size: 2rem;
    margin: 0;
    margin-right: 12px;
}

.item-label span {
    color: rgba(255, 255, 255, .2);
    font-size: 1rem;
    margin-right: 4px;
}
</style>