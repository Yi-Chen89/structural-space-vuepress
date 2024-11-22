<template>
  <div class="slender-result-container">
    <h2 class="section-title">
      <span>{{ title }}</span>
      <span class="section-title-button"
        v-html="contentDisplayLocal === '-' ? '&minus;' : '&plus;'"
        @click="toggleContentDisplay">
      </span>
    </h2>

    <div v-if="contentDisplayLocal === '-'">
      <div>
        <div class="subsection-title-large">Element Width-to-Thickness Ratio</div>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div class="indented-container">
              <div>
                <span>{{ item.notation }}:&emsp;</span>
                <span v-html="item.ratio.notation"></span> = <span v-html="item.ratio.html"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="compressionDisplay">
        <div class="subsection-title-large">Subject to Axial Compression</div>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div class="subsection-title-small">
              {{ item.notation }}
            </div>
            <div class="indented-container">
              <div>
                <span>Nonslender Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.notation"></span> = <span v-html="item.limit.html"></span>
              </div>
              <div class="final-result">
                {{ item.notation }} is {{ item.class }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="flexureDisplay">
        <div class="subsection-title-large">Subject to Flexure</div>
        
        <div v-for="(item, key) in flexureSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div class="subsection-title-small">
              {{ item.notation }}
            </div>
            <div class="indented-container">
              <div>
                <span>Compact Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.compact.notation"></span> = <span v-html="item.limit.compact.html"></span>
              </div>
              <div>
                <span>Noncompact Limiting Ratio:&emsp;</span>
                <span v-html="item.limit.noncompact.notation"></span> = <span v-html="item.limit.noncompact.html"></span>
              </div>
              <div v-if="shapeType === 'HSS Rect.'">
                <div class="final-result">
                  {{ item.notation }} is {{ item.class[0] }} (major axis bending)
                </div>
                <div class="final-result">
                  {{ item.notation }} is {{ item.class[1] }} (minor axis bending)
                </div>
              </div>
              <div v-else>
                <div class="final-result">
                  {{ item.notation }} is {{ item.class[0] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="compressionDisplay">
        <div class="subsection-title-large">Subject to Axial Compression</div>

        <div v-for="(item, key) in axialSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div class="indented-container">
              <div>
                {{ item.notation }} is {{ item.class }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="flexureDisplay">
        <div class="subsection-title-large">Subject to Flexure</div>
        
        <div v-for="(item, key) in flexureSlenderClass" :key="key">
          <div v-if="item.isApplicable">
            <div class="indented-container">
              <div v-if="shapeType === 'HSS Rect.'">
                <div>{{ item.notation }} is {{ item.class[0] }} (major) and {{ item.class[1] }} (minor)</div>
              </div>
              <div v-else>
                <div>{{ item.notation }} is {{ item.class[0] }}</div>
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