<template>
  <i :class="bem(name)"></i>
</template>

<script>
  import { createNamespace } from '@/utils/created';
  export default {
    name: 'VlIcon',

    props: {
      name: String
    },
    data() {
      return {
        bem: createNamespace('icon')[1]
      }
    }
  };
</script>
