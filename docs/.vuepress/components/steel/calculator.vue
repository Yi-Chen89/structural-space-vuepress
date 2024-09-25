<template>
  <div>
    <div>
      <h2>Input</h2>

      <div v-if="shapeTypeSelectionDisplay" class="select-container">
        <label for="descShapeType">Select Shape Type:&emsp;</label>
        <select id="descShapeType" v-model="selectedDescShapeType" class="select">
          <option v-for="descShapeType in descShapeTypeList" :key="descShapeType" :value="descShapeType">
            {{ descShapeType }}
          </option>
        </select>
      </div>

      <div v-if="shapeSelectionDisplay" class="select-container">
        <label for="shape">Select Shape:&emsp;</label>
        <select id="shape" v-model="selectedShape" class="select">
          <option v-for="shape in shapeList" :key="shape" :value="shape">
            {{ shape }}
          </option>
        </select>
      </div>

      <div v-if="gradeSelectionDisplay" class="select-container">
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
      </div>

      <h3>For Flexure</h3>

      <div v-if="unbracedLengthInputDisplay" class="input-container">
        <label for="unbracedLength">Enter Unbraced Length (<em>L<sub>b</sub></em>):&emsp;</label>
        <input type="number" id="unbracedLength" v-model="enteredUnbracedLength" class="input-number-short" @input="unbracedLengthInputValidator">
        <span><em>ft</em></span>
        <p v-if="unbracedLengthInputError" class="error-message">{{ unbracedLengthInputError }}</p>
      </div>

      <div v-if="ltbModFactorInputDisplay" class="input-container">
        <label for="ltbModFactor">Enter LTB Modification Factor (<em>C<sub>b</sub></em>):&emsp;</label>
        <input type="number" id="ltbModFactor" v-model="enteredLTBModFactor" class="input-number-short" @input="ltbModFactorInputValidator">
        <p v-if="ltbModFactorInputError" class="error-message">{{ ltbModFactorInputError }}</p>
      </div>
    </div>

    <div v-if="shapeDataDisplay">
      <h2>Shape Dimension and Property</h2>

      <div><strong>{{ selectedShape }}</strong></div>

      <div>
        <div>Weight</div>
        <table>
          <tbody>
            <tr v-for="(value, key) in selectedShapeWeightRenderData" :key="key">
              <td v-html="value.notation"  :title="value.description"></td>
              <td>{{ value.value }}</td>
              <td v-html="value.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div>Dimension</div>
        <table>
          <tbody>
            <tr v-for="(value, key) in selectedShapeDimensionRenderData" :key="key">
              <td v-html="value.notation"  :title="value.description"></td>
              <td>{{ value.value }}</td>
              <td v-html="value.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div>Property</div>
        <table>
          <tbody>
            <tr v-for="(value, key) in selectedShapePropertyRenderData" :key="key">
              <td v-html="value.notation"  :title="value.description"></td>
              <td>{{ value.value }}</td>
              <td v-html="value.unit"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {{ selectedShapeData }}
    </div>

    <div v-if="gradeDataDisplay">
      <h2>Steel Property</h2>

      <div><strong>{{ selectedGradeDesig }}</strong></div>

      <table>
        <tbody>
          <tr v-for="(value, key) in selectedASTMSpecProp" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
            <td>ksi</td>
          </tr>
        </tbody>
      </table>

    </div>

    <div v-if="slenderClassDisplay">
      <h2>Element Slenderness Class</h2>

      <div>
        <div>Slenderness Ratio</div>
        <table>
          <tbody>
            <tr v-for="(value, key) in selectedShapeSlenderRatioRenderData" :key="key">
              <td v-html="value.notation"  :title="value.description"></td>
              <td>{{ value.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Subject to Axial Compression</h3>
      {{ selectedShapeAxialSlenderClass }}
      <br>
      {{ selectedShapeTypeAxialSlenderLimitRatio }}
      <h3>Subject to Flexure</h3>
      {{ selectedShapeFlexureSlenderClass }}
      <br>
      {{ selectedShapeTypeFlexureSlenderLimitRatio }}
    </div>

    <div v-if="tensionCalcDisplay">
      <h2>Tensile Strength</h2>
    </div>

    <div v-if="compressionCalcDisplay">
      <h2>Compressive Strength</h2>
    </div>

    <div v-if="flexureCalcDisplay">
      <h2>Flexural Strength</h2>
      
      <div v-if="true">
        <h3>Major Axis</h3>
        {{ selectedShapeMajorFlexureCapacity }}
      </div>

      <div v-if="false">
        <h3>Minor Axis</h3>
      </div>
    </div>

    <div v-if="shearCalcDisplay">
      <h2>Shear Strength</h2>
    </div>

    <footer>
      <hr>
      Steel Construction Manual 15th Edition
      <hr>
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

  import { axialSlenderLimitRatioCalculator } from './utils/slender-calculators.js';
  import { axialSlenderClassifier } from './utils/slender-calculators.js';
  import { flexureSlenderLimitRatioCalculator } from './utils/slender-calculators.js';
  import { flexureSlenderClassifier } from './utils/slender-calculators.js';

  import { majorFlexureCalculator } from './utils/flexure-calculators.js';

  import { selectionValidator } from '../utils/validators.js';
  import { positiveNumberInputValidator } from '../utils/validators.js';
  import { nonnegativeNumberInputValidator } from '../utils/validators.js';

  import { shapeWeightRenderDataFilterer } from './utils/data-filterers.js';
  import { shapeDimensionRenderDataFilterer } from './utils/data-filterers.js';
  import { shapeSlenderRatioFilterer } from './utils/data-filterers.js';
  import { shapeSlenderRatioRenderDataFilterer } from './utils/data-filterers.js';
  import { shapePropertyRenderDataFilterer } from './utils/data-filterers.js';
  
  
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


      // input display variable

      shapeSelectionDisplay() {
        return this.selectedDescShapeTypeValid;
      },

      gradeSelectionDisplay() {
        return this.selectedShapeValid;
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
        return true;
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