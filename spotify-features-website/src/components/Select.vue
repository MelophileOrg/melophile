<template>
    <div class="Select">
        <h1 :class="{throb: show || hover, load: load, throbempty: (load && index == -1)}" @mouseover="hovering" @mouseout="leave" @click="toggle">{{selected}}</h1>
        <div v-if="show" class="dropdown">
            <h1 @click="select(index)" v-for="(option, index) in options" :style="{'--delay': + index}" :key="option.value">{{option.text}}</h1>
        </div>
    </div>
</template>

<script>
/*
types: [
        {value: "", text: "Tracks"},
        {value: "artists", text: "Artists"},
      ],
*/
export default {
    name: 'Select',
    props: {
        options: Array,
        load: Boolean,
    },
    data() {
        return {
            show: false,
            index: -1,
            hover: false,
        }
    },
    methods: {
        hovering() {
            this.hover = true;
        },
        leave() {
            this.hover = false;
        },
        open() {
            this.show = true;
            this.$emit('pending');
        },
        close() {
            this.show = false;
        },
        toggle() {
            if (this.show)
            {
                this.index = -1;
                this.close();
            }
            else
                this.open();
        },
        select(num) {
            this.index = num;
            this.show = false;
            this.$emit('selection', this.options[this.index].value);
        }
    },
    computed: {
        selected() {
            if (this.show)
            {
                return "______";
            }
            if (this.index == -1)
            {
                return "______";
            }
            else
                return this.options[this.index].text;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Select {
    position: relative;
    display: inline-block;
}

.Select h1 {
    font-size: 40px;
    font-weight: bolder;
    color: rgb(255, 255, 255);
    cursor: pointer;
    margin: 0;
    
}


.throb {
    animation: throb 2s ease infinite;
}

.throbempty {
    animation: throb-empty 2s ease infinite;
}

@keyframes throb {
    50% {
        opacity: .3;
    }
}

@keyframes throb-empty {
    0% {
        opacity: 1;
        text-shadow:01px 0px 10px white;
    }
    50% {
        opacity: .1;
        text-shadow: 0px 0px 0px white;
    }
    100% {
        opacity: 1;
        text-shadow: 0px 0px 10px white;
    }
}

.dropdown {
    position: absolute;
    width: 300px;
    top: 90%;
    margin-top: 10px;
    left: calc((100% - 300px) / 2);
    z-index: 100;
}

.dropdown h1 {
    --delay: 0;
    margin: 5px 0px;
    animation: slide-up .3s ease calc(var(--delay) * .1s), peekaboo calc(var(--delay) * .1s);
}

@keyframes slide-up {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
}
</style>
