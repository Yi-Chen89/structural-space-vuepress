<template>
  <div>
    <div>
      <h2>Input</h2>

      <div>
        <p v-if="shapeTypeSelectionDisplay" class="select-container">
          <label for="descShapeType">Select Shape Type:&emsp;</label>
          <select id="descShapeType" v-model="selectedDescShapeType" class="select">
            <option v-for="descShapeType in descShapeTypeList" :key="descShapeType" :value="descShapeType">
              {{ descShapeType }}
            </option>
          </select>
        </p>

        <p v-if="shapeSelectionDisplay" class="select-container">
          <label for="shape">Select Shape:&emsp;</label>
          <select id="shape" v-model="selectedShape" class="select">
            <option v-for="shape in shapeList" :key="shape" :value="shape">
              {{ shape }}
            </option>
          </select>
        </p>

        <p v-if="gradeSelectionDisplay" class="select-container">
          <label for="grade">Select Grade:&emsp;</label>
          <select id="grade" v-model="selectedGrade" class="select">
            <option :key="selectedShapeTypeASTMSpecPreferredDesig" :value="selectedShapeTypeASTMSpecPreferredKey">
              {{ selectedShapeTypeASTMSpecPreferredDesig }}
            </option>
            <option
              v-for="(Desig, index) in selectedShapeTypeASTMSpecApplicableDesigs"
              :key="selectedShapeTypeASTMSpecApplicableDesigs[index]"
              :value="selectedShapeTypeASTMSpecApplicableKeys[index]"
            >
              {{ Desig }}
            </option>
          </select>
        </p>
      </div>

      <div v-if="compressionInputDisplay">
        <p style="font-size: 1.2em;"><strong>For Compression</strong></p>

        <p v-if="effectiveLengthInputDisplay" class="input-container">
          <label for="effectiveLengthX">Enter Effective Length about Major Axis (L<sub>cx</sub>):&emsp;</label>
          <input type="number" id="effectiveLengthX" v-model="enteredEffectiveLengthX" class="input-number-short" @input="effectiveLengthXInputValidator">
          <span>&nbsp;ft</span>
          <div v-if="effectiveLengthXInputError" class="error-message">{{ effectiveLengthXInputError }}</div>
        </p>

        <p v-if="effectiveLengthInputDisplay" class="input-container">
          <label for="effectiveLengthY">Enter Effective Length about Minor Axis (L<sub>cy</sub>):&emsp;</label>
          <input type="number" id="effectiveLengthY" v-model="enteredEffectiveLengthY" class="input-number-short" @input="effectiveLengthYInputValidator">
          <span>&nbsp;ft</span>
          <div v-if="effectiveLengthYInputError" class="error-message">{{ effectiveLengthYInputError }}</div>
        </p>

        <p v-if="effectiveLengthInputDisplay" class="input-container">
          <label for="effectiveLengthZ">Enter Effective Length about Longitudinal Axis (L<sub>cz</sub>):&emsp;</label>
          <input type="number" id="effectiveLengthZ" v-model="enteredEffectiveLengthZ" class="input-number-short" @input="effectiveLengthZInputValidator">
          <span>&nbsp;ft</span>
          <div v-if="effectiveLengthZInputError" class="error-message">{{ effectiveLengthZInputError }}</div>
        </p>
      </div>

      <div v-if="flexureInputDisplay">
        <p style="font-size: 1.2em;"><strong>For Flexure</strong></p>

        <p v-if="unbracedLengthInputDisplay" class="input-container">
          <label for="unbracedLength">Enter Unbraced Length (L<sub>b</sub>):&emsp;</label>
          <input type="number" id="unbracedLength" v-model="enteredUnbracedLength" class="input-number-short" @input="unbracedLengthInputValidator">
          <span>&nbsp;ft</span>
          <div v-if="unbracedLengthInputError" class="error-message">{{ unbracedLengthInputError }}</div>
        </p>

        <p v-if="ltbModFactorInputDisplay" class="input-container">
          <label for="ltbModFactor">Enter LTB Modification Factor (C<sub>b</sub>):&emsp;</label>
          <input type="number" id="ltbModFactor" v-model="enteredLTBModFactor" class="input-number-short" @input="ltbModFactorInputValidator">
          <div v-if="ltbModFactorInputError" class="error-message">{{ ltbModFactorInputError }}</div>
        </p>
      </div>
    </div>

    <div v-if="shapeDataDisplay">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>Shape Dimension and Property</span>
        <span
          v-html="shapeDataContentDisplay === '-' ? '&minus;' : '&plus;'"
          style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
          @click="showShapeDataContent()">
        </span>
      </h2>

      <div v-if="shapeDataContentDisplay === '-'">
        <div style="font-size: 1.1em;"><strong>{{ selectedShape }}</strong></div>

        <div>
          <p><strong>Weight</strong></p>

          <div style="margin-left: 1em;">
            <div v-for="(item, key) in selectedShapeWeightRenderData" :key="key">
              <p>
                <span v-html="item.notation" :title="item.description"></span>
                <span> = {{ item.value }}&nbsp;</span>
                <span v-html="item.unit"></span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <p><strong>Dimension</strong></p>

          <div style="margin-left: 1em;">
            <div v-for="(item, key) in selectedShapeDimensionRenderData" :key="key">
              <p>
                <span v-html="item.notation" :title="item.description"></span>
                <span> = {{ item.value }}&nbsp;</span>
                <span v-html="item.unit"></span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <p><strong>Property</strong></p>

          <div style="margin-left: 1em;">
            <div v-for="(item, key) in selectedShapePropertyRenderData" :key="key">
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

    <div v-if="gradeDataDisplay">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>Steel Property</span>
        <span
          v-html="gradeDataContentDisplay === '-' ? '&minus;' : '&plus;'"
          style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
          @click="showGradeDataContent()">
        </span>
      </h2>

      <div v-if="gradeDataContentDisplay === '-'">
        <div style="font-size: 1.1em;"><strong>{{ selectedGradeDesig }}</strong></div>

        <div style="margin-left: 1em;">
          <div v-for="(item, key) in selectedASTMSpecPropRenderData" :key="key">
            <p>
              <span v-html="item.notation" :title="item.description"></span>
              <span> = {{ item.value }}&nbsp;</span>
              <span v-html="item.unit"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="slenderClassDisplay">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>Element Slenderness Class</span>
        <span
          v-html="slenderClassContentDisplay === '-' ? '&minus;' : '&plus;'"
          style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
          @click="showSlenderClassContent()">
        </span>
      </h2>
      
      <div v-if="slenderClassContentDisplay === '-'">
        <div>
          <p style="font-size: 1.2em;"><strong>Element Width-to-Thickness Ratio</strong></p>

          <div v-for="(item, key) in selectedShapeAxialSlenderClass" :key="key">
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

        <div>
          <p style="font-size: 1.2em;"><strong>Subject to Axial Compression</strong></p>

          <div v-for="(item, key) in selectedShapeAxialSlenderClass" :key="key">
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

        <div>
          <p style="font-size: 1.2em;"><strong>Subject to Flexure</strong></p>
          
          <div v-for="(item, key) in selectedShapeFlexureSlenderClass" :key="key">
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
                <div v-if="selectedShapeType === 'HSS Rect.'">
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
        <div>
          <p style="font-size: 1.2em;"><strong>Subject to Axial Compression</strong></p>

          <div v-for="(item, key) in selectedShapeAxialSlenderClass" :key="key">
            <div v-if="item.isApplicable">
              <div style="margin-left: 1em;">
                <p>
                  {{ item.notation }} is {{ item.class }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p style="font-size: 1.2em;"><strong>Subject to Flexure</strong></p>
          
          <div v-for="(item, key) in selectedShapeFlexureSlenderClass" :key="key">
            <div v-if="item.isApplicable">
              <div style="margin-left: 1em;">
                <div v-if="selectedShapeType === 'HSS Rect.'">
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
  

    <div v-if="tensionCalcDisplay">
      <h2>Tensile Strength</h2>
    </div>
    
    <div v-if="compressionCalcDisplay">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>Compressive Strength</span>
        <span
          v-html="compressionCalcContentDisplay === '-' ? '&minus;' : '&plus;'"
          style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
          @click="showCompressionCalcContent()">
        </span>
      </h2>
      
      <div v-if="compressionCalcContentDisplay === '-'">
        <div v-for="(item, key) in selectedShapeCompressionCapacityRenderData" :key="key">
          <p><strong>{{ item.section }} {{ item.title }}</strong></p>
            <div style="margin-left: 1em;">
              <div v-html="item.html"></div>
            </div>
        </div>
        
        <div>
          <p><strong>Governing Limit State</strong></p>
          <div v-for="data in selectedShapeCompressionCriticalCapacityRenderData">
            <div style="margin-left: 1em;">
              <p><strong>Compressive Strength ({{ data.section }})</strong></p>
              <p>
                P<sub>n</sub> = {{ data.value.toFixed(1) }} {{ data.unit }}
              </p>
              <p><strong>
                &phi;<sub>c</sub>P<sub>n</sub> = {{ (0.9 * data.value).toFixed(1) }} {{ data.unit }}
              </strong></p>
            </div>
          </div>
        </div>
      </div>

      <div v-else>

      </div>
    </div>

    <div v-if="flexureCalcDisplay">
      <h2 style="display: flex; justify-content: space-between; align-items: center;">
        <span>Flexural Strength</span>
        <span
          v-html="flexureCalcContentDisplay === '-' ? '&minus;' : '&plus;'"
          style="font-size: 0.9em; font-weight: normal; cursor: pointer;"
          @click="showFlexureCalcContent()">
        </span>
      </h2>
      
      <div v-if="flexureCalcContentDisplay === '-'">
        <div v-if="true">
          <p style="font-size: 1.2em;"><strong>Major Axis</strong></p>
          <div>
            <div v-for="(item, key) in selectedShapeMajorFlexureCapacityRenderData" :key="key">
              <p><strong>{{ item.section }} {{ item.title }}</strong></p>
              <div style="margin-left: 1em;">
                <div v-html="item.html"></div>
              </div>
            </div>
          </div>

          <div>
            <p><strong>Governing Limit State</strong></p>
            <div v-for="data in selectedShapeMajorFlexureCriticalCapacityRenderData">
              <div style="margin-left: 1em;">
                <p><strong>{{ data.sign }} Flexural Strength ({{ data.section }})</strong></p>
                <p>
                  M<sub>n</sub> = {{ data.value.toFixed(1) }} {{ data.unit }} = {{ (data.value / 12).toFixed(1) }} k-ft
                </p>
                <p><strong>
                  &phi;<sub>b</sub>M<sub>n</sub> = {{ (0.9 * data.value / 12).toFixed(1) }} k-ft
                </strong></p>
              </div>
            </div>
          </div>
        </div>
      
        <div v-if="true">
          <p style="font-size: 1.2em;"><strong>Minor Axis</strong></p>
          <div>
            <div v-for="(item, key) in selectedShapeMinorFlexureCapacityRenderData" :key="key">
              <p><strong>{{ item.section }} {{ item.title }}</strong></p>
              <div style="margin-left: 1em;">
                <div v-html="item.html"></div>
              </div>
            </div>
          </div>

          <div>
            <p><strong>Governing Limit State</strong></p>
            <div v-for="data in selectedShapeMinorFlexureCriticalCapacityRenderData">
              <div style="margin-left: 1em;">
                <p><strong>{{ data.sign }} Flexural Strength ({{ data.section }})</strong></p>
                <p>
                  M<sub>n</sub> = {{ data.value.toFixed(1) }} {{ data.unit }} = {{ (data.value / 12).toFixed(1) }} k-ft
                </p>
                <p><strong>
                  &phi;<sub>b</sub>M<sub>n</sub> = {{ (0.9 * data.value / 12).toFixed(1) }} k-ft
                </strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="true">
          <p style="font-size: 1.2em;"><strong>Major Axis</strong></p>

          <div>
            <div v-for="data in selectedShapeMajorFlexureCriticalCapacityRenderData">
              <div style="margin-left: 1em;">
                <p><strong>{{ data.sign }} Flexural Strength ({{ data.section }})</strong></p>
                <p>
                  M<sub>n</sub> = {{ (data.value / 12).toFixed(1) }} k-ft
                </p>
                <p><strong>
                  &phi;<sub>b</sub>M<sub>n</sub> = {{ (0.9 * data.value / 12).toFixed(1) }} k-ft
                </strong></p>
              </div>
            </div>
          </div>
        </div>
      
        <div v-if="true">
          <p style="font-size: 1.2em;"><strong>Minor Axis</strong></p>

          <div>
            <div v-for="data in selectedShapeMinorFlexureCriticalCapacityRenderData">
              <div style="margin-left: 1em;">
                <p><strong>{{ data.sign }} Flexural Strength ({{ data.section }})</strong></p>
                <p>
                  M<sub>n</sub> = {{ (data.value / 12).toFixed(1) }} k-ft
                </p>
                <p><strong>
                  &phi;<sub>b</sub>M<sub>n</sub> = {{ (0.9 * data.value / 12).toFixed(1) }} k-ft
                </strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="shearCalcDisplay">
      <h2>Shear Strength</h2>
    </div>

    <footer style="font-size: 0.75em; margin-top: 50px;">
      <hr>
      <div>Steel Construction Manual 15th Edition</div>
      <ul style="margin-top: 0;">
        <li>AISC Shapes Database v15.0</li>
        <li>ANSI/AISC 360-16</li>
      </ul>
    </footer>
  </div>
</template>

<script>
  import { descShapeTypeListFetcher } from './utils/data-fetchers.js';
  import { shapeListFetcher } from './utils/data-fetchers.js';
  import { shapeDataFetcher } from './utils/data-fetchers.js';
  import { shapeTypeFetcher } from './utils/data-fetchers.js';
  import { shapeASTMSpecListFetcher } from './utils/data-fetchers.js';
  import { astmSpecDesigFetcher } from './utils/data-fetchers.js';
  import { astmSpecPropFetcher } from './utils/data-fetchers.js';
  import { astmSpecPropRenderDataFetcher } from './utils/data-fetchers.js';

  import { axialSlenderClassifier } from './utils/slender-calculators.js';
  import { flexureSlenderClassifier } from './utils/slender-calculators.js';

  import { compressionCalculator } from './utils/compression-calculators.js';
  import { criticalCompressionCapacityProcessor } from './utils/compression-calculators.js';

  import { majorFlexureCalculator } from './utils/flexure-calculators.js';
  import { minorFlexureCalculator } from './utils/flexure-calculators.js';
  import { criticalResultProcessor } from './utils/flexure-calculators.js';

  import { selectionValidator } from '../utils/validators.js';
  import { positiveNumberInputValidator } from '../utils/validators.js';
  import { nonnegativeNumberInputValidator } from '../utils/validators.js';

  import { shapeWeightRenderDataFilterer } from './utils/data-filterers.js';
  import { shapeDimensionRenderDataFilterer } from './utils/data-filterers.js';
  import { shapeSlenderRatioFilterer } from './utils/data-filterers.js';
  import { shapeSlenderRatioRenderDataFilterer } from './utils/data-filterers.js';
  import { shapePropertyRenderDataFilterer } from './utils/data-filterers.js';
  import { resultRenderDataFilterer } from './utils/data-filterers.js';
  
  import { resultRenderDataConstructor } from './utils/render-data-constructors.js';
  import { criticalResultRenderDataConstructor } from './utils/render-data-constructors.js';

  
  export default {
    data() {
      return {
        unit: 0,   // 0 for US units, 1 for metric units

        selectedDescShapeType: 'All',
        selectedShape: null,
        selectedGrade: null,
        enteredEffectiveLengthX: 0,
        enteredEffectiveLengthY: 0,
        enteredEffectiveLengthZ: 0,
        enteredUnbracedLength: 0,
        enteredLTBModFactor: 1,

        // display variable
        shapeTypeSelectionDisplay: true,

        // content display variable
        shapeDataContentDisplay: '-',
        gradeDataContentDisplay: '-',
        slenderClassContentDisplay: '-',
        compressionCalcContentDisplay: '-',
        flexureCalcContentDisplay: '-',

        // error variable
        effectiveLengthXInputError: '',
        effectiveLengthYInputError: '',
        effectiveLengthZInputError: '',
        unbracedLengthInputError: '',
        ltbModFactorInputError: '',
        
      }
    },

    computed: {
      // input field variable

      descShapeTypeList() {
        return descShapeTypeListFetcher();
      },

      shapeList() {
        return shapeListFetcher(this.unit, this.selectedDescShapeType);
      },

      selectedShapeTypeASTMSpecPreferredKey() {
        if (this.selectedShapeType) {
          return shapeASTMSpecListFetcher(this.selectedShapeType)["ASTM_Designation_preferred"];
        } else {
          return null;
        }
      },
      selectedShapeTypeASTMSpecPreferredDesig() {
        if (this.selectedShapeTypeASTMSpecPreferredKey) {
          return astmSpecDesigFetcher(this.selectedShapeTypeASTMSpecPreferredKey);
        } else {
          return null;
        }
      },

      selectedShapeTypeASTMSpecApplicableKeys() {
        if (this.selectedShapeType) {
          return shapeASTMSpecListFetcher(this.selectedShapeType)["ASTM_Designation_applicable"];
        } else {
          return null;
        }
      },
      selectedShapeTypeASTMSpecApplicableDesigs() {
        if (this.selectedShapeTypeASTMSpecApplicableKeys) {
          return this.selectedShapeTypeASTMSpecApplicableKeys.map(key => astmSpecDesigFetcher(key));
        } else {
          return null;
        }
      },


      // rendering variable

      selectedGradeDesig() {
        return astmSpecDesigFetcher(this.selectedGrade);
      },

      selectedShapeWeightRenderData() {
        return shapeWeightRenderDataFilterer(this.selectedShapeData, this.selectedShapeType);
      },

      selectedShapeDimensionRenderData() {
        return shapeDimensionRenderDataFilterer(this.selectedShapeData, this.selectedShapeType);
      },

      selectedShapePropertyRenderData() {
        return shapePropertyRenderDataFilterer(this.selectedShapeData, this.selectedShapeType);
      },

      selectedShapeSlenderRatioRenderData() {
        return shapeSlenderRatioRenderDataFilterer(this.selectedShapeData, this.selectedShapeType);
      },

      selectedASTMSpecPropRenderData() {
        return astmSpecPropRenderDataFetcher(this.selectedGrade);
      },

      selectedShapeCompressionCapacityRenderData() {
        return resultRenderDataConstructor(this.selectedShapeCompressionCapacity, 'compression');
      },

      selectedShapeCompressionCriticalCapacityRenderData() {
        return criticalResultRenderDataConstructor(this.selectedShapeCompressionCriticalCapacity, 'compression');
      },

      selectedShapeMajorFlexureCapacityRenderData() {
        return resultRenderDataConstructor(this.selectedShapeMajorFlexureCapacity, 'flexure');
      },

      selectedShapeMajorFlexureCriticalCapacityRenderData() {
        return criticalResultRenderDataConstructor(this.selectedShapeMajorFlexureCriticalCapacity, 'flexure');
      },

      selectedShapeMinorFlexureCapacityRenderData() {
        return resultRenderDataConstructor(this.selectedShapeMinorFlexureCapacity, 'flexure');
      },

      selectedShapeMinorFlexureCriticalCapacityRenderData() {
        return criticalResultRenderDataConstructor(this.selectedShapeMinorFlexureCriticalCapacity, 'flexure');
      },

      // valid variable

      selectedDescShapeTypeValid() {
        return selectionValidator(this.selectedDescShapeType);
      },

      selectedShapeValid() {
        return selectionValidator(this.selectedShape);
      },

      selectedGradeValid() {
        return selectionValidator(this.selectedGrade);
      },

      compressionCalcValid() {
        return !!this.selectedShapeCompressionCapacity;
      },

      flexureCalcValid() {
        return !!this.selectedShapeMajorFlexureCapacity || !!this.selectedShapeMinorFlexureCapacity;
      },


      // input display variable

      shapeSelectionDisplay() {
        return this.selectedDescShapeTypeValid;
      },

      gradeSelectionDisplay() {
        return this.selectedShapeValid;
      },

      compressionInputDisplay() {
        return this.selectedGradeValid;
      },

      effectiveLengthInputDisplay() {
        return this.selectedGradeValid;
      },

      flexureInputDisplay() {
        return this.selectedGradeValid;
      },

      unbracedLengthInputDisplay() {
        return this.selectedGradeValid;
      },

      ltbModFactorInputDisplay() {
        return this.selectedGradeValid;
      },


      // output display variable

      shapeDataDisplay() {
        return this.selectedShapeValid;
      },

      gradeDataDisplay() {
        return this.selectedGradeValid;
      },

      slenderClassDisplay() {
        return this.selectedShapeValid && this.selectedGradeValid;
      },

      tensionCalcDisplay() {
        return false;
      },

      compressionCalcDisplay() {
        return this.compressionCalcValid;
      },

      flexureCalcDisplay() {
        return this.flexureCalcValid;
      },

      shearCalcDisplay() {
        return false;
      },


      // calc variable
      // value in a dict format for 1 selected input value

      selectedShapeData() {
        return shapeDataFetcher(this.unit, this.selectedShape);
      },

      selectedShapeType() {
        return shapeTypeFetcher(this.unit, this.selectedShape);
      },

      selectedASTMSpecProp() {
        return astmSpecPropFetcher(this.selectedGrade);
      },

      selectedShapeSlenderRatio() {
        return shapeSlenderRatioFilterer(this.selectedShapeData, this.selectedShapeType);
      },

      selectedShapeAxialSlenderClass() {
        return axialSlenderClassifier(this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeSlenderRatio);
      },

      selectedShapeFlexureSlenderClass() {
        return flexureSlenderClassifier(this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeSlenderRatio);
      },

      validatedEffectiveLengthX() {
        if (this.effectiveLengthXInputError) {
          return 0;
        } else {
          return this.enteredEffectiveLengthX * 12;
        }
      },

      validatedEffectiveLengthY() {
        if (this.effectiveLengthYInputError) {
          return 0;
        } else {
          return this.enteredEffectiveLengthY * 12;
        }
      },

      validatedEffectiveLengthZ() {
        if (this.effectiveLengthZInputError) {
          return 0;
        } else {
          return this.enteredEffectiveLengthZ * 12;
        }
      },

      validatedUnbracedLength() {
        if (this.unbracedLengthInputError) {
          return 0;
        } else {
          return this.enteredUnbracedLength * 12;
        }
      },

      validatedLTBModFactor() {
        if (this.ltbModFactorInputError) {
          return 1;
        } else {
          return this.enteredLTBModFactor;
        }
      },

      selectedShapeCompressionCapacity() {
        return compressionCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeAxialSlenderClass, this.validatedEffectiveLengthX, this.validatedEffectiveLengthY, this.validatedEffectiveLengthZ);
      },

      selectedShapeCompressionCriticalCapacity() {
        return criticalCompressionCapacityProcessor(this.selectedShapeCompressionCapacity);
      },

      selectedShapeMajorFlexureCapacity() {
        return majorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },

      selectedShapeMajorFlexureCriticalCapacity() {
        return criticalResultProcessor(this.selectedShapeMajorFlexureCapacity);
      },

      selectedShapeMinorFlexureCapacity() {
        return minorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },

      selectedShapeMinorFlexureCriticalCapacity() {
        return criticalResultProcessor(this.selectedShapeMinorFlexureCapacity);
      },

    },

    watch: {
      selectedDescShapeType(newDescShapeType) {
        if (!this.shapeList.includes(this.selectedShape)) {
          this.selectedShape = null;
          this.resetContentDisplay();
        }
      },

      selectedShape(newShape) {
        this.selectedGrade = this.selectedShapeTypeASTMSpecPreferredKey;
      },
    },

    methods: {
      effectiveLengthXInputValidator() {
        this.effectiveLengthXInputError = nonnegativeNumberInputValidator(this.enteredEffectiveLengthX);
      },

      effectiveLengthYInputValidator() {
        this.effectiveLengthYInputError = nonnegativeNumberInputValidator(this.enteredEffectiveLengthY);
      },

      effectiveLengthZInputValidator() {
        this.effectiveLengthZInputError = nonnegativeNumberInputValidator(this.enteredEffectiveLengthZ);
      },

      unbracedLengthInputValidator() {
        this.unbracedLengthInputError = nonnegativeNumberInputValidator(this.enteredUnbracedLength);
      },

      ltbModFactorInputValidator() {
        this.ltbModFactorInputError = positiveNumberInputValidator(this.enteredLTBModFactor);
      },

      showShapeDataContent() {
        this.shapeDataContentDisplay = this.shapeDataContentDisplay === '-' ? '+' : '-';
      },

      showGradeDataContent() {
        this.gradeDataContentDisplay = this.gradeDataContentDisplay === '-' ? '+' : '-';
      },

      showSlenderClassContent() {
        this.slenderClassContentDisplay = this.slenderClassContentDisplay === '-' ? '+' : '-';
      },

      showCompressionCalcContent() {
        this.compressionCalcContentDisplay = this.compressionCalcContentDisplay === '-' ? '+' : '-';
      },

      showFlexureCalcContent() {
        this.flexureCalcContentDisplay = this.flexureCalcContentDisplay === '-' ? '+' : '-';
      },

      resetContentDisplay() {
        this.shapeDataContentDisplay = '-';
        this.gradeDataContentDisplay = '-';
        this.slenderClassContentDisplay = '-';
        this.compressionCalcContentDisplay = '-';
        this.flexureCalcContentDisplay = '-';
      },
    },
  };
</script>