<template>
  <div>
    <p>
      <label :for="id"><span v-html="label"></span>:&emsp;</label>
      <input
        type="number"
        :id="id"
        v-model="enteredValueLocal"
        @input="validateInput"
      />
      <span>&nbsp;{{ unit }}</span>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </p>
  </div>
</template>
  
<script>
  import { positiveNumberInputValidator } from '../utils/validators.js';
  import { nonnegativeNumberInputValidator } from '../utils/validators.js';

  export default {
    props: {
      type: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      enteredValue: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        enteredValueLocal: this.enteredValue,
        errorMessage: '',
      };
    },

    computed: {
      inputValidator() {
        if (this.type === 'positive') {
          return positiveNumberInputValidator;
        } else if (this.type === 'nonnegative') {
          return nonnegativeNumberInputValidator;
        }
      },
      validatedValue() {
        if (this.errorMessage) {
          return 0;
        } else {
          return this.enteredValueLocal;
        }
      },
    },

    watch: {
      validatedValue(newValue) {
        this.$emit('updateValidatedValue', { id: this.id, value: newValue });
      },
    },

    methods: {
      validateInput() {
        this.errorMessage = this.inputValidator(this.enteredValueLocal);
      },
    },
  };
</script>