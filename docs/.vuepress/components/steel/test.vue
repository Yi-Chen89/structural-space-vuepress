<template>
  <div>
    <h2>{{ x }} Component</h2>

    {{ importedFunction }}
  </div>
</template>

<script>
  import { test } from './utils';

  export default {
    name: 'test',

    data() {
      return {
        x: 'Test',
        y: 'test value'
      }
    },

    computed: {
      importedFunction() {
        return test(this.y)
      }
    },

    methods: {

    },
  };
</script>