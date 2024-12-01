<template>
  <div class="strength-result-container">
    <h2 class="section-title">
      <span>{{ title }}</span>
      <span class="section-title-button"
        v-html="contentDisplayLocal === '-' ? '&minus;' : '&plus;'"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplayLocal === '-'">
      <div v-for="(criticalCapacity, index) in criticalCapacities" :key="index">
        <div class="subsection-title-large"
          v-if="criticalCapacities.length === 2 && index === 0">
          Major Axis
        </div>
        <div class="subsection-title-large"
          v-if="criticalCapacities.length === 2 && index === 1">
          Minor Axis
        </div>

        <div v-for="(item, key) in capacities[index]" :key="key">
          <div class="subsection-title-small">
            {{ item.section }} {{ item.title }}
          </div>
          <div class="indented-container">
            <div v-html="item.html"></div>
          </div>
        </div>

        <div v-if="criticalCapacity">
          <div class="subsection-title-small"
            v-if="criticalCapacity.some(item => item.isMultiState)">
            Governing Limit State
          </div>
          <div v-for="(item, index) in criticalCapacity" :key="index">
            <div class="indented-container">
              <div class="subsection-title-small"
                v-if="item.isMultiState">
                {{ item.titlePrefix }} {{ title }} ({{ item.section }})
              </div>
              <div v-if="item.isMultiState">
                <span v-html="item.nominalNotation"></span> = {{ item.nominalValue.toFixed(1) }} {{ item.unit }}
              </div>
              <div>
                <span v-html="item.phiNotation"></span> = {{ item.phiValue.toFixed(2) }}
              </div>
              <div class="final-result">
                <span v-html="item.designNotation"></span> = {{ item.designValue.toFixed(1) }} {{ item.unit }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="indented-container">
            <div>Not available</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-for="(criticalCapacity, index) in criticalCapacities" :key="index">
        <div class="subsection-title-large"
          v-if="criticalCapacities.length === 2 && index === 0">
          Major Axis
        </div>
        <div class="subsection-title-large"
          v-if="criticalCapacities.length === 2 && index === 1">
          Minor Axis
        </div>

        <div v-if="criticalCapacity">
          <div v-for="(item, index) in criticalCapacity" :key="index">
            <div class="indented-container">
              <div class="subsection-title-small">
                {{ item.titlePrefix }} {{ title }} ({{ item.section }})
              </div>
              <div>
                <span v-html="item.nominalNotation"></span> = {{ item.nominalValue.toFixed(1) }} {{ item.unit }}
              </div>
              <div class="final-result">
                <span v-html="item.designNotation"></span> = {{ item.designValue.toFixed(1) }} {{ item.unit }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="indented-container">
            <div>Not available</div>
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