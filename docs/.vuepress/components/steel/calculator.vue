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

      <div v-if="flexureInputDisplay">
        <p style="font-size: 1.2em;"><strong>For Flexure</strong></p>

        <p v-if="unbracedLengthInputDisplay" class="input-container">
          <label for="unbracedLength">Enter Unbraced Length (L<sub>b</sub>):&emsp;</label>
          <input type="number" id="unbracedLength" v-model="enteredUnbracedLength" class="input-number-short" @input="unbracedLengthInputValidator">
          <span>&emsp;ft</span>
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
      <h2>Shape Dimension and Property</h2>

      <div style="font-size: 1.1em;"><strong>{{ selectedShape }}</strong></div>

      <div>
        <p>Weight</p>

        <table>
          <tbody>
            <tr v-for="(item, key) in selectedShapeWeightRenderData" :key="key">
              <td v-html="item.notation"  :title="item.description"></td>
              <td>{{ item.value }}</td>
              <td v-html="item.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <p>Dimension</p>

        <table>
          <tbody>
            <tr v-for="(item, key) in selectedShapeDimensionRenderData" :key="key">
              <td v-html="item.notation"  :title="item.description"></td>
              <td>{{ item.value }}</td>
              <td v-html="item.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <p>Property</p>

        <table>
          <tbody>
            <tr v-for="(item, key) in selectedShapePropertyRenderData" :key="key">
              <td v-html="item.notation"  :title="item.description"></td>
              <td>{{ item.value }}</td>
              <td v-html="item.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="gradeDataDisplay">
      <h2>Steel Property</h2>

      <div style="font-size: 1.1em;"><strong>{{ selectedGradeDesig }}</strong></div>

      <table>
        <tbody>
          <tr v-for="(item, key) in selectedASTMSpecPropRenderData" :key="key">
            <td v-html="item.notation"  :title="item.description"></td>
            <td>{{ item.value }}</td>
            <td v-html="item.unit"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="slenderClassDisplay">
      <h2>Element Slenderness Class</h2>

      <div>
        <p>Slenderness Ratio</p>

        <table>
          <tbody>
            <tr v-for="(item, key) in selectedShapeSlenderRatioRenderData" :key="key">
              <td v-html="item.notation"  :title="item.description"></td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <p style="font-size: 1.2em;"><strong>Subject to Axial Compression</strong></p>

        <div v-for="(item, key) in selectedShapeAxialSlenderClass" :key="key">
          <p>
            {{ key.charAt(0).toUpperCase() + key.slice(1) }} Class: {{ item }}
          </p>
        </div>
        
        <!-- {{ selectedShapeTypeAxialSlenderLimitRatio }} -->
      </div>

      <div>
        <p style="font-size: 1.2em;"><strong>Subject to Flexure</strong></p>

        <div v-for="(item, key) in selectedShapeFlexureSlenderClass" :key="key">
          <p>
            {{ key.charAt(0).toUpperCase() + key.slice(1) }} Class: {{ item }}
          </p>
        </div>
        
        <!-- {{ selectedShapeTypeFlexureSlenderLimitRatio }} -->
      </div>
    </div>

    <div v-if="tensionCalcDisplay">
      <h2>Tensile Strength</h2>
    </div>

    <div v-if="compressionCalcDisplay">
      <h2>Compressive Strength</h2>
    </div>

    <div v-if="flexureCalcDisplay">
      <h2>Flexural Strength</h2>
      <div>{{ selectedShapeMajorFlexureCapacityRenderData }}</div>
      <div v-if="true">
        <p style="font-size: 1.2em;"><strong>Major Axis</strong></p>
        <div>
          <div v-for="(item, key) in selectedShapeMajorFlexureCapacityRenderData" :key="key">
            <p><strong>{{ item.section }} {{ item.title }}</strong></p>
            <div style="margin-left: 1em;">
              <div v-html="item.html"></div>
              <!-- <p v-if="item.value">
                <span v-html="item.notation"></span> = {{ item.value.toFixed(1) }} {{ item.unit }}
              </p> -->
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
      
      <div v-if="false">
        <p style="font-size: 1.2em;"><strong>Minor Axis</strong></p>
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

  import { axialSlenderLimitRatioCalculator } from './utils/slender-calculators.js';
  import { axialSlenderClassifier } from './utils/slender-calculators.js';
  import { flexureSlenderLimitRatioCalculator } from './utils/slender-calculators.js';
  import { flexureSlenderClassifier } from './utils/slender-calculators.js';

  import { majorFlexureCalculator } from './utils/flexure-calculators.js';
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
        enteredUnbracedLength: 0,
        enteredLTBModFactor: 1,


        // display variable
        shapeTypeSelectionDisplay: true,

        // error variable
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

      selectedShapeMajorFlexureCapacityRenderData() {
        return resultRenderDataConstructor(this.selectedShapeMajorFlexureCapacity, 'flexure');
      },

      selectedShapeMajorFlexureCriticalCapacityRenderData() {
        return criticalResultRenderDataConstructor(this.selectedShapeMajorFlexureCriticalCapacity, 'flexure');
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

      flexureCalcValid() {
        return !!this.selectedShapeMajorFlexureCapacity;
      },


      // input display variable

      shapeSelectionDisplay() {
        return this.selectedDescShapeTypeValid;
      },

      gradeSelectionDisplay() {
        return this.selectedShapeValid;
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
        return false;
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

      selectedShapeTypeAxialSlenderLimitRatio() {
        return axialSlenderLimitRatioCalculator(this.selectedShapeType, this.selectedASTMSpecProp);
      },

      selectedShapeAxialSlenderClass() {
        return axialSlenderClassifier(this.selectedShapeType, this.selectedShapeSlenderRatio, this.selectedShapeTypeAxialSlenderLimitRatio);
      },

      selectedShapeTypeFlexureSlenderLimitRatio() {
        return flexureSlenderLimitRatioCalculator(this.selectedShapeType, this.selectedASTMSpecProp);
      },

      selectedShapeFlexureSlenderClass() {
        return flexureSlenderClassifier(this.selectedShapeType, this.selectedShapeSlenderRatio, this.selectedShapeTypeFlexureSlenderLimitRatio);
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

      selectedShapeMajorFlexureCapacity() {
        return majorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeSlenderRatio, this.selectedShapeTypeFlexureSlenderLimitRatio, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },

      selectedShapeMajorFlexureCriticalCapacity() {
        return criticalResultProcessor(this.selectedShapeMajorFlexureCapacity);
      },

    },

    watch: {
      selectedDescShapeType(newDescShapeType) {
        if (!this.shapeList.includes(this.selectedShape)) {
          this.selectedShape = null;
        }
      },

      selectedShape(newShape) {
        this.selectedGrade = this.selectedShapeTypeASTMSpecPreferredKey;
      },
    },

    methods: {
      unbracedLengthInputValidator() {
        this.unbracedLengthInputError = nonnegativeNumberInputValidator(this.enteredUnbracedLength);
      },

      ltbModFactorInputValidator() {
        this.ltbModFactorInputError = positiveNumberInputValidator(this.enteredLTBModFactor);
      },
    },
  };
</script>