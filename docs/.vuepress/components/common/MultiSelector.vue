<template>
  <div>
    <p v-for="option in options" :key="option.value">
      <label>
        <input type="checkbox" :value="option.value" v-model="selectedLocal" />
        {{ option.label }}
      </label>
    </p>
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