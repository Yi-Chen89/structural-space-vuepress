<template>
  <div>

    <div v-if="shapeSelectionDisplay" class="select-container">
      <label for="shape">Select shape:&emsp;</label>
      <select id="shape" v-model="selectedShape" class="select">
        <option v-for="shape in shapeList" :key="shape" :value="shape">
          {{ shape }}
        </option>
      </select>
    </div>

    <div v-if="gradeSelectionDisplay" class="select-container">
      <label for="grade">Select grade:&emsp;</label>
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

    <div v-if="unbracedLengthInputDisplay" class="input-container">
      <label for="unbracedLength">Enter unbraced length, <em>L<sub>b</sub></em>:&emsp;</label>
      <input type="number" id="unbracedLength" v-model="enteredUnbracedLength" class="input-number-short" @input="unbracedLengthInputValidator">
      <span><em>ft</em></span>
      <p v-if="unbracedLengthInputError" class="error-message">{{ unbracedLengthInputError }}</p>
    </div>

    <div v-if="ltbModFactorInputDisplay" class="input-container">
      <label for="ltbModFactor">Enter LTB modification factor, <em>C<sub>b</sub></em>:&emsp;</label>
      <input type="number" id="ltbModFactor" v-model="enteredLTBModFactor" class="input-number-short" @input="ltbModFactorInputValidator">
      <p v-if="ltbModFactorInputError" class="error-message">{{ ltbModFactorInputError }}</p>
    </div>


    {{ selectedShapeType }}
    <br>
    <!-- {{ selectedShapeData }} -->
    <br>
    <!-- {{ selectedShapeTypeASTMSpecPreferredKey }} -->
    <br>
    <!-- {{ selectedShapeTypeASTMSpecPreferredDesig }} -->
    <br>
    <!-- {{ selectedShapeTypeASTMSpecApplicableKeys }} -->
    <br>
    <!-- {{ selectedShapeTypeASTMSpecApplicableDesigs }} -->
    <br>
    {{ selectedGrade }}
    <br>
    {{ selectedASTMSpecProp }}
    <br>
    {{ selectedShapeSlenderRatio }}
    <br>
    {{ selectedShapeTypeAxialSlenderLimitRatio }}
    <br>
    {{ selectedShapeAxialSlenderClass }}
    <br>
    {{ selectedShapeTypeFlexureSlenderLimitRatio }}
    <br>
    {{ selectedShapeFlexureSlenderClass }}
    <br>
    {{ selectedShapeMajorFlexureCapacity }}

  </div>
</template>

<script>
  import { shapeListFecher } from './utils';
  import { shapeDataFetcher } from './utils';
  import { shapeTypeFetcher } from './utils';
  import { shapeASTMSpecListFetcher } from './utils';
  import { astmSpecDesigFetcher } from './utils';
  import { astmSpecPropFetcher } from './utils';
  import { shapeSlenderRatioFetcher } from './utils';

  import { axialSlenderLimitRatioCalculator } from './calculator-utils';
  import { axialSlenderClassifier } from './calculator-utils';
  import { flexureSlenderLimitRatioCalculator } from './calculator-utils';
  import { flexureSlenderClassifier } from './calculator-utils';
  import { majorFlexureCalculator } from './calculator-utils';


  import { selectionValidator } from '../validation.js';
  import { positiveNumberInputValidator } from '../validation.js';
  import { nonnegativeNumberInputValidator } from '../validation.js';
  
  
  export default {
    data() {
      return {
        unit: 0,   // 0 for US units, 1 for metric units


        selectedShape: null,
        selectedGrade: null,
        enteredUnbracedLength: 0,
        enteredLTBModFactor: 1,


        // display variable
        shapeSelectionDisplay: true,

        // error variable
        unbracedLengthInputError: '',
        ltbModFactorInputError: '',
        
      }
    },

    computed: {
      // input field variable

      shapeList() {
        return shapeListFecher(this.unit);
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


      // valid variable

      selectedShapeValid() {
        return selectionValidator(this.selectedShape);
      },

      selectedGradeValid() {
        return selectionValidator(this.selectedGrade);
      },


      // display variable

      gradeSelectionDisplay() {
        return this.selectedShapeValid;
      },

      unbracedLengthInputDisplay() {
        return this.selectedGradeValid;
      },

      ltbModFactorInputDisplay() {
        return this.selectedGradeValid;
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
        return shapeSlenderRatioFetcher(this.unit, this.selectedShape, this.selectedShapeType);
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
        return majorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },

    },

    watch: {
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