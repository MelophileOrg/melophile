<template>
  <div class="EmptyListItem pop-small" :style="{'--index': + (index - 1 + delay)}">
      <div class="img"/>
  </div>
</template>

<script>


export default {
    name: 'EmptyListItem',
    props: {
        index: Number,
        delay: Number,
    },
};
</script>


<style scoped>
.EmptyListItem {
    --index: 0;
    display: flex;
    width: calc(100% - 12px);
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.068);
    margin: 5px auto;
    border-radius: 3px;
    animation: hide calc(var(--index) * .1s) linear, slide-up .3s ease calc(var(--index) * .1s), emptylist 2.5s linear calc((var(--index) * .5s) + (var(--index) * .1s)) infinite;
}

.img {
    display: block;
    width: 55px;
    height: 55px;
    background-size: 100% 100%;
    background-position: center center;
    margin-right: 15px;
}

</style>