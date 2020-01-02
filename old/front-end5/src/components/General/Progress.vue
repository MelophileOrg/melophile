<template>
    <div class="progress">
        <h1>Loading Library: {{progress.processed}} / {{progress.total}}</h1>
        <div id="progress-bar">
            <div id="fill" :style="{'--progress': + percent}"/>
        </div>
    </div>
</template>

<script>

export default {
  name: 'progress',
  computed: {
      progress() {
        return this.$store.state.progress;
      },
      percent() {
        return this.$store.state.progress.processed / this.$store.state.progress.total;
      }
  }
}
</script>

<style scoped>

.progress {
    display: block;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: calc(100vw - 260px);
    padding: 15px 0px;
    position: fixed;
    left: 260px;
    bottom: 0px;
    background-image: radial-gradient(circle at 50% -500%, rgba(28, 150, 221, 0.87), rgba(58, 181, 252, 0.884));
    color: rgba(240, 240, 240, 0.966);
    animation: slide-up .8s ease;
}

@media screen and (max-width: 720px) {
    .progress {
        width: 100vw !important;
        left: 0px !important;
    }
}

h1 {
    font-size: 1em;
    margin: 0 10px;
    margin-bottom: 10px;
}

#progress-bar {
    width: 95%;
    max-width: 400px;
    height: 8px;
    border-radius: 10px;
    margin: 0 auto;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.096);
}

#progress-bar #fill {
    --progress: 0;
    display: block;
    width: calc(var(--progress) * 100%);
    background: rgba(255, 255, 255, 0.781);
    height: 8px;
}


</style>