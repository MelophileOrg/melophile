<template>
    <div class="percentbar">
        <h4 class="bar-title">{{title}}</h4>
        <div class="stat-bar">
            <div class="fill" :style="{'--percent': + percent, '--red': + color.red, '--green': + color.green, '--blue': + color.blue}"/>
        </div>
        <h4 class="value">{{percentprint(percent)}}</h4>
    </div>
</template>

<script>
export default {
  name: 'percentbar',
  props: {
    title: String,
    percent: Number,
    color: Object
  },
  methods: {
    percentprint(num) {
        return Math.round(num * 100) + "%";
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.percentbar {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    justify-content: space-between;
}

.bar-title {
  width: 115px;
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
  color: white;
  display: flex;
  align-items: center;
  margin: 4px 0;
  text-align: left;
}

.bar-title {
  width: 115px;
}
</style>