<template>
  <div>
    <h2 style="display: flex; justify-content: space-between; align-items: center;">
      <span>{{ title }}</span>
      <span
        v-html="contentDisplayLocal === '-' ? '&minus;' : '&plus;'"
        style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplayLocal === '-'">
      <div v-for="(criticalCapacity, index) in criticalCapacities" :key="index">
        <p v-if="criticalCapacities.length === 2 && index === 0" style="font-size: 1.2em;">
          <strong>Major Axis</strong>
        </p>
        <p v-if="criticalCapacities.length === 2 && index === 1" style="font-size: 1.2em;">
          <strong>Minor Axis</strong>
        </p>

        <div v-for="(item, key) in capacities[index]" :key="key">
          <p><strong>{{ item.section }} {{ item.title }}</strong></p>
          <div style="margin-left: 1em;">
            <div v-html="item.html"></div>
          </div>
        </div>

        <div v-if="criticalCapacity">
          <p v-if="Object.values(criticalCapacity).some(item => item.isMultiState)">
            <strong>Governing Limit State</strong>
          </p>
          <div v-for="(item, key) in criticalCapacity" :key="key">
            <div style="margin-left: 1em;">
              <p v-if="item.isMultiState"><strong>{{ item.titlePrefix || '' }} {{ title }} ({{ item.section }})</strong></p>
              <p v-if="item.isMultiState">
                <span v-html="item.nominalNotation"></span> = {{ item.nominalValue.toFixed(1) }} {{ item.unit }}
              </p>
              <p>
                <span v-html="item.phiNotation"></span> = {{ item.phiValue.toFixed(2) }}
              </p>
              <p><strong>
                <span v-html="item.designNotation"></span> = {{ item.designValue.toFixed(1) }} {{ item.unit }}
              </strong></p>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="margin-left: 1em;">
            <p>Not available</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-for="(criticalCapacity, index) in criticalCapacities" :key="index">
        <p v-if="criticalCapacities.length === 2 && index === 0" style="font-size: 1.2em;">
          <strong>Major Axis</strong>
        </p>
        <p v-if="criticalCapacities.length === 2 && index === 1" style="font-size: 1.2em;">
          <strong>Minor Axis</strong>
        </p>

        <div v-if="criticalCapacity">
          <div v-for="(item, key) in criticalCapacity" :key="key">
            <div style="margin-left: 1em;">
              <p><strong>{{ item.titlePrefix || '' }} {{ title }} ({{ item.section }})</strong></p>
              <p>
                <span v-html="item.nominalNotation"></span> = {{ item.nominalValue.toFixed(1) }} {{ item.unit }}
              </p>
              <p><strong>
                <span v-html="item.designNotation"></span> = {{ item.designValue.toFixed(1) }} {{ item.unit }}
              </strong></p>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="margin-left: 1em;">
            <p>Not available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      capacities: {
        type: Array,
        required: true,
      },
      criticalCapacities: {
        type: Array,
        required: true,
      },
      contentDisplay: {
        type: String,
        default: '-',
      },
    },

    data() {
      return {
        contentDisplayLocal: this.contentDisplay,
      }
    },

    methods: {
      toggleContentDisplay() {
        this.contentDisplayLocal = this.contentDisplayLocal === '-' ? '+' : '-';
        this.$emit('updateContentDisplay', { type: this.type, contentDisplay: this.contentDisplayLocal });
      },
    },
  }
</script>