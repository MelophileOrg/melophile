<template>
  <div>
    <processing-snackbar />

    <connection-snackbar />
  </div>
</template>

<script>
import ProcessingSnackbar from '@/components/ui/snackbars/processing-snackbar.vue';
import ConnectionSnackbar from '@/components/ui/snackbars/connection-snackbar.vue';

export default {
  name: 'Snackbars',
  components: {
    ProcessingSnackbar,
    ConnectionSnackbar,
  },
};
</script>