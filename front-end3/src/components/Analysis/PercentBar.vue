<template>
    <div class="percentbar">
        <h4 class="bar-title">{{title}}</h4>
        <div class="stat-bar">
            <div class="fill" :style="{'--percent': + percent, '--red': + color.red, '--green': + color.green, '--blue': + color.blue}"/>
        </div>
        <h5 class="value">{{value(percent)}}</h5>
    </div>
</template>

<script>
export default {
  name: 'percentbar',
  props: {
    title: String,
    percent: Number,
    color: Object,
    type: String,
  },
  methods: {
    percentprint(num) {
        return Math.round(num * 100) + "%";
    },
    value() {
      if (this.type == "tempo")
        return Math.round(this.percent * 210) + "BPM";
      if (this.type == "volume")
        return (Math.round(((this.percent * 50) - 50) * 10) / 10) + "dB";
      return Math.round(this.percent * 100) + "%"
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.percentbar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;
}

.stat-bar {
    display: block;
    border-radius: 5px;
    overflow: hidden;
    max-width: 200px;
    width: calc(100% - 155px);
    max-height: 10px;
    background-color: rgba(255, 255, 255, 0.247);
}

.stat-bar .fill {
    --percent: 0;
    --red: 255;
    --green: 255;
    --blue: 255;
    display: block;
    width: calc(var(--percent) * 100%);
    height: 10px;
    background: rgb(var(--red), var(--green), var(--blue));
    animation: slow-fill 1s ease;
}

@keyframes slow-fill {
  from {
    width: calc(var(--percent) * 0%);
  }
}

h4 {
  color: rgba(255, 255, 255, 0.904) !important;
  display: flex;
  align-items: center;
  margin: 4px 0;
  text-align: left;
}

@media screen and (max-width: 720px) {
    h4 {
        font-size: .9em !important;
    }

    .bar-title {
      width: 110px !important;
    }

    .stat-bar {
        width: calc(100% - 150px);
    }

    h5 {
      font-size: .9em !important;
    }
}

h5 {
  color: rgba(255, 255, 255, 0.904) !important;
  margin: 4px 0;
  text-align: right;
}

.bar-title {
  width: 115px;
}

.value {
  width: 63px;
  font-size: 16px;
}
</style>