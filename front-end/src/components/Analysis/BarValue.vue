<template>
    <div class="BarValue">
        <h1>{{valueText()}}</h1>
        <div class="bar">
            <div :style="{'--value': + value, '--red': + color.red, '--green': + color.green, '--blue': + color.blue}" class="bar-fill"/>
        </div>
        <div class="labels">
            <h3>{{minLabel}}</h3>
            <h3>{{maxLabel}}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: "BarValue",
    props: {
        type: String,
        maxLabel: String,
        minLabel: String,
        value: Number,
        color: Object,
    },
    methods: {
        percent(num) {
            return Math.round(num * 100) + "%";
        },
        valueCalc() {
            if (this.type == "tempo")
                return this.value / 210;
            if (this.type == "volume")
                
            return Math.round(this.percent * 100) + "%"
        },
        valueText() {
            if (this.type == "tempo")
                return Math.round(this.value) + "BPM";
            if (this.type == "volume")
                return (Math.round(((this.value * 50) - 50) * 10) / 10) + "dB";
            return Math.round(this.value * 100) + "%"
        },
    }
};
</script>

<style scoped>
.BarValue {
    width: 100%;
    margin: 12px 0px;
}

.bar {
    position: relative;
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.158);
    overflow: hidden;
}

.bar p {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    margin: 0px;
}

.bar-fill {
    --value: 1;
    --red: 255;
    --green: 255;
    --blue: 255;
    width: calc(var(--value) * 100%);
    height: 100%;
    background-color: rgb(var(--red), var(--green), var(--blue));
}

.labels {
    display: flex;
    justify-content: space-between;
}

.labels h3 {
    display: inline-block;
    color: rgba(255, 255, 255, 0.418);
    font-size: .9em;
    margin: 4px;
    font-weight: lighter;
}
</style>