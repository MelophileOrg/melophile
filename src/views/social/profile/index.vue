<template>
  <TwoColumnLayout>
    <div slot="core" style="background: red">
    </div>
    <div slot="aside">
    </div>
  </TwoColumnLayout>
</template>

<script>
import TwoColumnLayout from '@/components/layout/TwoColumnLayout.vue';

export default {
  name: "Profile",
  components: {
    TwoColumnLayout
  }
}
</script>