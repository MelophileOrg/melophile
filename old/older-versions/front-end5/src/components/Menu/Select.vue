<template>
    <div class="Select" :style="{'--width': + width, '--red': + options[index].color.r, '--green': + options[index].color.g, '--blue': + options[index].color.b}">
        <h1 class="select-title"></h1>
        <div class="select-flex">
            <h1 @click="toggle" class="selected">{{options[index].text}}</h1>
            <svg @click="toggle" class="select-append" :class="{sideways: show}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14px" height="14px" viewBox="0 0 50 50" version="1.1">
                <g id="surface1366671">
                    <path style=" stroke:none;fill-rule:nonzero;fill-opacity:1;transition: all .3s ease;" :style="{fill: 'rgba(' + options[index].color.r + ','+ options[index].color.g + ','+ options[index].color.b + ', .8)'}" d="M 9.984375 11 C 9.722656 11.003906 9.476562 11.109375 9.292969 11.292969 L 3.292969 17.292969 C 2.902344 17.683594 2.902344 18.316406 3.292969 18.707031 L 24.292969 39.707031 C 24.683594 40.097656 25.316406 40.097656 25.707031 39.707031 L 46.707031 18.707031 C 47.097656 18.316406 47.097656 17.683594 46.707031 17.292969 L 40.707031 11.292969 C 40.316406 10.902344 39.683594 10.902344 39.292969 11.292969 L 25 25.585938 L 10.707031 11.292969 C 10.515625 11.101562 10.253906 10.996094 9.984375 11 Z M 9.984375 11 "/>
                </g>
            </svg>
            <div class="pop-up-menu" v-if="show">
                <h1 v-for="(item, i) in options" :key="item.value + 'selector'" :class="{active: i == index}" @click="select(i)">{{item.text}}</h1>
            </div>
        </div>
        <div class="border-bar">
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
        title: String,
        options: Array,
    },
    data() {
        return {
            show: false,
            index: 0,
            width: 150,
        }
    },
    methods: {
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
            return this.options[this.index].text;
        }
    },
    created() {
        let largest = "";
        console.log(this.options);
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].text.length > largest.length) {
                largest = this.options[i].text;
            }
        }
        console.log(largest);
        this.width = largest.length * 8 + 30;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Select {
    --width: 150;
    --red: 255;
    --green: 255;
    --blue: 255;
    --alpha: .8;
    width: calc(var(--width) * 1px);
    color: rgb(255, 255, 255, var(--alpha));
    margin: 0;
}

.title {
    
    background: rgb(var(--red), var(--green), var(--blue), var(--alpha));
    transition: all .3s ease;
}
.select-flex {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.selected {
    display: inline-flex;
    margin: 7px 4px 7px 0;
    font-size: 16px;
    font-weight: lighter;
    cursor: pointer;
}

.select-append {
    transition: all .3s ease;
    cursor: pointer;
}

.select-append.sideways {
    transform: rotate(180deg);
}

.border-bar {
    display: block;
    width: 100%;
    height: 2px;
    transition: all .3s ease;
    background: rgb(var(--red), var(--green), var(--blue), .8);
}

.pop-up-menu {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    animation: .3s menu-in ease;
    background: #424242;
}

@keyframes menu-in {
    0% {
        transform: scale(0, 0);
        opacity: 0;
    }
    100% {
        transform: scale(1, 1);
        opacity: 1;
    }
}

.pop-up-menu h1 {
    transition: all .3s all;
    align-items: center;
    display: flex;
    font-size: 16px;
    font-weight: 400;
    height: 48px;
    margin: 0;
    padding: 0 16px;
    cursor: pointer;
}

.pop-up-menu h1:hover {
    background: rgba(255, 255, 255, 0.068);
}

.pop-up-menu h1.active {
    color: rgb(var(--red), var(--green), var(--blue));
}


</style>
