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
      <div>
        <p style="font-size: 1.2em;"><strong>Element Width-to-Thickness Ratio</strong></p>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div style="margin-left: 1em;">
              <p>
                <span>{{ item.notation }}:&emsp;</span>
                <span v-html="item.ratio.notation"></span> = <span v-html="item.ratio.html"></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="compressionDisplay">
        <p style="font-size: 1.2em;"><strong>Subject to Axial Compression</strong></p>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <p>
              <strong>{{ item.notation }}</strong>
            </p>
            <div style="margin-left: 1em;">
              <p>
                <span>Nonslender Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.notation"></span> = <span v-html="item.limit.html"></span>
              </p>
              <p>
                <strong>{{ item.notation }} is {{ item.class }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="flexureDisplay">
        <p style="font-size: 1.2em;"><strong>Subject to Flexure</strong></p>
        
        <div v-for="(item, key) in flexureSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <p>
              <strong>{{ item.notation }}</strong>
            </p>
            <div style="margin-left: 1em;">
              <p>
                <span>Compact Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.compact.notation"></span> = <span v-html="item.limit.compact.html"></span>
              </p>
              <p>
                <span>Noncompact Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.noncompact.notation"></span> = <span v-html="item.limit.noncompact.html"></span>
              </p>
              <div v-if="shapeType === 'HSS Rect.'">
                <p><strong>{{ item.notation }} is {{ item.class[0] }}</strong> (major axis bending)</p>
                <p><strong>{{ item.notation }} is {{ item.class[1] }}</strong> (minor axis bending)</p>
              </div>
              <div v-else>
                <p><strong>{{ item.notation }} is {{ item.class[0] }}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="compressionDisplay">
        <p style="font-size: 1.2em;"><strong>Subject to Axial Compression</strong></p>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div style="margin-left: 1em;">
              <p>
                {{ item.notation }} is {{ item.class }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="flexureDisplay">
        <p style="font-size: 1.2em;"><strong>Subject to Flexure</strong></p>
        
        <div v-for="(item, key) in flexureSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div style="margin-left: 1em;">
              <div v-if="shapeType === 'HSS Rect.'">
                <p>{{ item.notation }} is {{ item.class[0] }} (major) and {{ item.class[1] }} (minor)</p>
              </div>
              <div v-else>
                <p>{{ item.notation }} is {{ item.class[0] }}</p>
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
      shapeType: {
        type: String,
        required: true,
      },
      axialSlenderClass: {
        type: Object,
        required: true,
      },
      flexureSlenderClass: {
        type: Object,
        required: true,
      },
      compressionDisplay: {
        type: Boolean,
        required: true,
      },
      flexureDisplay: {
        type: Boolean,
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