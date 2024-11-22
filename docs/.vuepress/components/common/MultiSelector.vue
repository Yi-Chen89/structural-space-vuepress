<template>
  <div>
    <div v-for="option in options" :key="option.value">
      <label>
        <input type="checkbox" :value="option.value" v-model="selectedLocal" />
        <span>&emsp;{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>
  
<script>
  export default {
    props: {
      options: {
        type: Array,
        required: true,
        default: () => []
      },
      modelValue: {
        type: Array,
        default: () => []
      },
    },

    computed: {
      selectedLocal: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit("update:modelValue", value);
        }
      }
    },
  }
</script>