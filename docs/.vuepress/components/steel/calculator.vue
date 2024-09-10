<template>
  <div>

    <div v-if="sectionDisplay" class="select-container">
      <label for="section">Select section:&emsp;</label>
      <select id="section" v-model="selectedSection" class="select">
        <option v-for="section in sectionList" :key="section" :value="section">
          {{ section }}
        </option>
      </select>
    </div>

    {{ sectionData }}
  </div>
</template>

<script>
  import { sectionListFecher } from './utils';
  import { dataFetcher } from './utils';

  export default {
    data() {
      return {
        unit: 0,   // 0 for US units, 1 for metric units
        selectedSection: null,
      }
    },

    computed: {
      sectionDisplay() {
        return true;
      },


      sectionList() {
        return sectionListFecher(this.unit);
      },

      sectionData() {
        return dataFetcher(this.unit, this.selectedSection);
      },
    },

    methods: {

    },
  };
</script>