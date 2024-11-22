<template>
  <div class="summary-container">
    <h2 class="section-title">
      <span>{{ title }}</span>
      <span class="section-title-button"
        v-html="contentDisplayLocal === '-' ? '&minus;' : '&plus;'"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplayLocal === '-'">
      <div class="subsection-title-large">{{ grade }} {{ shape }}</div>

      <div v-for="(criticalCapacities, index) in calcCriticalCapacities" :key="index">
        <div v-if="calcDisplays[index]">
          <div class="subsection-title-small">{{ calcTitles[index] }}</div>

          <div v-for="(criticalCapacity, index) in criticalCapacities" :key="index">
            <div class="indented-container">
              <div
                v-if="criticalCapacities.length === 2 && index === 0">
                Major Axis
              </div>
              <div
                v-if="criticalCapacities.length === 2 && index === 1">
                Minor Axis
              </div>
            </div>

            <div v-if="criticalCapacity">
              <div v-for="(item, key) in criticalCapacity" :key="key">
                <div class="indented-container">
                  <div>
                    <span v-html="item.designNotation"></span>
                    <span> = {{ item.designValue.toFixed(1) }} {{ item.unit }}</span>
                    <span v-if="item.titlePrefix">&emsp;({{ item.titlePrefix || '' }})</span>
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
      shape: {
        type: String,
        required: true,
      },
      grade: {
        type: String,
        required: true,
      },
      calcTitles: {
        type: Array,
        required: true,
      },
      calcDisplays: {
        type: Array,
        required: true,
      },
      calcCriticalCapacities: {
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
        this.$emit('updateContentDisplay', { contentDisplay: this.contentDisplayLocal });
      },
    },
  }
</script>