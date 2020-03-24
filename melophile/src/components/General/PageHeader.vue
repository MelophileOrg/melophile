<template>
    <div class="PageHeader">
        <div class="page-header-content elevation-2">
            <p class="page-header-title">{{title}}</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'PageHeader',
    props: {
        title: String,
    }
  }
</script>

<style scoped>
.PageHeader {
    padding: 0px 12px;
}

.page-header-content {
    background: var(--dark-3);
    padding: 8px 16px;
}

p.page-header-title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.6rem;
    font-weight: lighter;
    margin: 0;
}
</style>