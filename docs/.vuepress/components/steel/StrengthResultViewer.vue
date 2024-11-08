<template>
  <div>
    <h2 style="display: flex; justify-content: space-between; align-items: center;">
      <span>{{ title }}</span>
      <span
        v-html="contentDisplay === '-' ? '&minus;' : '&plus;'"
        style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplay === '-'">
      <div v-for="(item, key) in capacity" :key="key">
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
            <p v-if="item.isMultiState"><strong>{{ title }} ({{ item.section }})</strong></p>
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

    <div v-else>
      <div v-if="criticalCapacity">
        <div v-for="(item, key) in criticalCapacity" :key="key">
          <div style="margin-left: 1em;">
            <p><strong>{{ title }} ({{ item.section }})</strong></p>
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
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      capacity: {
        type: Object,
        required: true,
      },
      criticalCapacity: {
        type: [Object, null],
        required: true,
      },
    },

    data() {
      return {
        contentDisplay: '-',
      }
    },

    methods: {
      toggleContentDisplay() {
        this.contentDisplay = this.contentDisplay === '-' ? '+' : '-';
      },
    }
  }
</script>