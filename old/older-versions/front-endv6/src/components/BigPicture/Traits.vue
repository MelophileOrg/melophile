<template>
    <div class="Traits">
        <div class="flex flex-align-top flex-wrap flex-justify-center">
            <div id="trait-overview" class="card">
                <h2>Traits</h2>
                <TraitGraph/>
            </div>
        </div>
    </div>
</template>

<script>
import TraitGraph from '@/components/RadialGraphs/TraitGraph.vue'

export default {
    name: "Traits",
    components: {
        TraitGraph,
    },
    data() {
        return {
        };
    },
    methods: {
    },
    computed: {

    },
};
</script>

<style scoped>
.Traits {
    font-family: Open Sans, sans-serif !important;
    width: 100%;
}

h2 {
    font-weight: lighter;
}

#trait-overview {
    width: 95%;
    max-width: 366px;
    margin: 15px;
}

.card {
    display: block;
    padding: 20px;
    background-color: rgb(23, 37, 66);
}
</style>