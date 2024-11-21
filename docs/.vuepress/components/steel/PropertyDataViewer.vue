<template>
  <div class="property-data-container">
    <h2 class="section-title">
      <span>{{ title }}</span>
      <span class="section-title-button"
        v-html="contentDisplayLocal === '-' ? '&minus;' : '&plus;'"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplayLocal === '-'">
      <div class="subsection-title-large">{{ subtitle }}</div>

      <div v-for="(renderData, index) in renderDataList" :key="index">
        <div class="subsection-title-small">{{ sectionTitles[index] }}</div>

        <div class="indented-container">
          <div v-for="(item, key) in renderData" :key="key">
            <div>
              <span v-html="item.notation" :title="item.description"></span>
              <span> = {{ item.value }}&nbsp;</span>
              <span v-html="item.unit"></span>
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
      type: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      sectionTitles: {
        type: Array,
        required: true,
      },
      renderDataList: {
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