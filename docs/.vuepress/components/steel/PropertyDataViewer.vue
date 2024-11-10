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
      <div style="font-size: 1.1em;"><strong>{{ subtitle }}</strong></div>

      <div v-for="(renderData, index) in renderDataList" :key="index">
        <p><strong>{{ sectionTitles[index] }}</strong></p>

        <div style="margin-left: 1em;">
          <div v-for="(item, key) in renderData" :key="key">
            <p>
              <span v-html="item.notation" :title="item.description"></span>
              <span> = {{ item.value }}&nbsp;</span>
              <span v-html="item.unit"></span>
            </p>
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
    }
  }
</script>