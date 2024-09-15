<template>
  <div>

    <div v-if="shapeDisplay" class="select-container">
      <label for="shape">Select shape:&emsp;</label>
      <select id="shape" v-model="selectedShape" class="select">
        <option v-for="shape in shapeList" :key="shape" :value="shape">
          {{ shape }}
        </option>
      </select>
    </div>

    <div v-if="gradeDisplay" class="select-container">
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
  
  
  export default {
    data() {
      return {
        unit: 0,   // 0 for US units, 1 for metric units


        selectedShape: null,
        selectedGrade: null,


        // display variable
        shapeDisplay: true,
        
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


      // display variable

      gradeDisplay() {
        return this.selectedShapeValid;
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
        return axialSlenderClassifier(this.selectedShapeType, this.selectedShapeSlenderRatio, this.selectedShapeTypeAxialSlenderLimitRatio)
      },

      selectedShapeTypeFlexureSlenderLimitRatio() {
        return flexureSlenderLimitRatioCalculator(this.selectedShapeType, this.selectedASTMSpecProp);
      },

      selectedShapeFlexureSlenderClass() {
        return flexureSlenderClassifier(this.selectedShapeType, this.selectedShapeSlenderRatio, this.selectedShapeTypeFlexureSlenderLimitRatio)
      },

      selectedShapeMajorFlexureCapacity() {
        return majorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, 1, 0)
      },

    },

    watch: {
      selectedShape(newShape) {
        this.selectedGrade = this.selectedShapeTypeASTMSpecPreferredKey;
      },     
    },

    methods: {

    },
  };
</script>