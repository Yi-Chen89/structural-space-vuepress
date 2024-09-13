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
    {{ selectedShapeTypeFlexureSlenderLimitRatio }}

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
  import { FlexureSlenderLimitRatioCalculator } from './utils';


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

      selectedShapeData() {
        return shapeDataFetcher(this.unit, this.selectedShape);  ////////////
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

      selectedShapeType() {
        return shapeTypeFetcher(this.unit, this.selectedShape);
      },

      selectedASTMSpecProp() {
        return astmSpecPropFetcher(this.selectedGrade);
      },

      selectedShapeSlenderRatio() {
        return shapeSlenderRatioFetcher(this.unit, this.selectedShape, this.selectedShapeType);
      },


      selectedShapeTypeFlexureSlenderLimitRatio () {
        return FlexureSlenderLimitRatioCalculator(this.selectedShapeType, this.selectedASTMSpecProp);
      },

    },

    mounted() {
      
    },

    methods: {

    },
  };
</script>