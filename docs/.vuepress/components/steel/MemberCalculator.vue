<template>
  <div>
    <div class="definition-container">
      <h2>Definition</h2>

      <div>
        <div v-if="shapeTypeSelectionDisplay">
          <label for="descShapeType">Select Shape Type:&emsp;</label>
          <select id="descShapeType" v-model="selectedDescShapeType">
            <option v-for="descShapeType in descShapeTypeList" :key="descShapeType" :value="descShapeType">
              {{ descShapeType }}
            </option>
          </select>
        </div>

        <div v-if="shapeSelectionDisplay">
          <label for="shape">Select Shape:&emsp;</label>
          <select id="shape" v-model="selectedShape">
            <option v-for="shape in shapeList" :key="shape" :value="shape">
              {{ shape }}
            </option>
          </select>
        </div>
        
        <div v-if="gradeSelectionDisplay">
          <label for="grade">Select Grade:&emsp;</label>
          <select id="grade" v-model="selectedGrade">
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
      </div>
      
      <div v-if="calcSelectionDisplay">
        <div class="subsection-title-large">Select Calculations</div>
        
        <div class="indented-container">
          <MultiSelector
            :options="calcOptions"
            v-model="selectedCalcs"
          />
        </div>
      </div>
      
      <div v-if="compressionInputDisplay">
        <div class="subsection-title-large">For Compression Calculation</div>

        <div class="indented-container">
          <NumberInputField
            v-if="effectiveLengthInputDisplay"
            type="nonnegative"
            id="effectiveLengthX"
            label="Enter Effective Length about Major Axis (L<sub>cx</sub>)"
            :enteredValue="enteredEffectiveLengthX"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />
          
          <NumberInputField
            v-if="effectiveLengthInputDisplay"
            type="nonnegative"
            id="effectiveLengthY"
            label="Enter Effective Length about Minor Axis (L<sub>cy</sub>)"
            :enteredValue="enteredEffectiveLengthY"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />

          <NumberInputField
            v-if="effectiveLengthInputDisplay"
            type="nonnegative"
            id="effectiveLengthZ"
            label="Enter Effective Length about Longitudinal Axis (L<sub>cz</sub>)"
            :enteredValue="enteredEffectiveLengthZ"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />

          <NumberInputField
            v-if="angleLengthInputDisplay"
            type="nonnegative"
            id="angleLength"
            label="Enter Length between Work Points (L)"
            :enteredValue="enteredAngleLength"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />

          <div v-if="angleMemberTypeSelectionDisplay">
            <label for="angleMemberType">Select Angle Member Type:&emsp;</label>
            <select id="angleMemberType" v-model="selectedAngleMemberType">
              <option :value="0">Individual Member</option>
              <option :value="1">Web Member of Planar Truss</option>
              <option :value="2">Web Member of Box or Space Truss</option>
            </select>
          </div>

          <div v-if="angleConnectedLegSelectionDisplay">
            <label for="angleConnectedLeg">Select Angle Connected Leg:&emsp;</label>
            <select id="angleConnectedLeg" v-model="selectedAngleConnectedLeg">
              <option :value="0">Longer Leg</option>
              <option :value="1">Shorter Leg</option>
            </select>
          </div>

          <div v-if="angleLengthInputDisplay" class="assumption-statement">
            <div>Calculation Assumption</div>
            <div class="indented-container">
              <div>The effects of eccentricity on single-angle members are permitted to be neglected and the member evaluated as axially loaded using one of the effective slenderness ratios specified in Section E5(a) or E5(b), provided that the following requirements are met:</div>
              <ol>
                <li>Members are loaded at the ends in compression through the same one leg</li>
                <li>Members are attached by welding or by connections with a minimum of two bolts</li>
                <li>There are no intermediate transverse loads</li>
                <li>L<sub>c</sub> / r does not exceed 200</li>
                <li v-if="selectedShapeType=='L Unequal'">For unequal leg angles, the ratio of long leg width to short leg width is less than 1.7</li>
                <li v-if="selectedAngleMemberType!=0">Web members of trusses with adjacent web members attached to the same side of the gusset plate or chord</li>
              </ol>
              <div>Single-angle members that do not meet these requirements shall be evaluated for combined axial load and flexure.</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="flexureInputDisplay">
        <div class="subsection-title-large">For Flexure Calculation</div>

        <div class="indented-container">
          <NumberInputField
            v-if="unbracedLengthInputDisplay"
            type="nonnegative"
            id="unbracedLength"
            label="Enter Unbraced Length (L<sub>b</sub>)"
            :enteredValue="enteredUnbracedLength"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />

          <NumberInputField
            v-if="ltbModFactorInputDisplay"
            type="positive"
            id="ltbModFactor"
            label="Enter LTB Modification Factor (C<sub>b</sub>)"
            :enteredValue="enteredLTBModFactor"
            :defaultValue="1"
            :unit="''"
            @updateValidatedValue="validatedNumberHandler"
          />
        </div>
      </div>

      <div v-if="shearInputDisplay">
        <div class="subsection-title-large">For Shear Calculation</div>

        <div class="indented-container">
          <div v-if="considerTensionFieldActionSelectionDisplay">
            <label for="considerTensionFieldAction">Consider Tension Field Action for Interior Web Panels:&emsp;</label>
            <select id="considerTensionFieldAction" v-model="selectedConsiderTensionFieldAction">
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>

          <div v-if="considerTransverseStiffenerSelectionDisplay">
            <label for="considerTransverseStiffener">Consider Transverse Stiffeners:&emsp;</label>
            <select id="considerTransverseStiffener" v-model="selectedConsiderTransverseStiffener">
              <option :value="true">Yes</option>
              <option :value="false" :disabled="selectedConsiderTensionFieldAction">No</option>
            </select>
          </div>

          <NumberInputField
            v-if="transverseStiffenerDistanceInputDisplay"
            type="nonnegative"
            id="transverseStiffenerDistance"
            label="Enter Clear Distance between Transverse Stiffeners (a)"
            :enteredValue="enteredTransverseStiffenerDistance"
            :defaultValue="0"
            :unit="'in.'"
            @updateValidatedValue="validatedNumberHandler"
          />
          
          <NumberInputField
            v-if="maxToZeroShearDistanceInputDisplay"
            type="nonnegative"
            id="maxToZeroShearDistance"
            label="Enter Distance from Max to Zero Shear Force (L<sub>v</sub>)"
            :enteredValue="enteredMaxToZeroShearDistance"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />
        </div>
      </div>

      <div v-if="torsionInputDisplay">
        <div class="subsection-title-large">For Torsion Calculation</div>

        <div class="indented-container">
          <NumberInputField
            v-if="memberLengthInputDisplay"
            type="nonnegative"
            id="memberLength"
            label="Enter Member Length (L)"
            :enteredValue="enteredMemberLength"
            :defaultValue="0"
            :unit="'ft'"
            @updateValidatedValue="validatedNumberHandler"
          />
        </div>
      </div>
    </div>

    <div>
      <SummaryViewer
        v-if="summaryDisplay"
        title="Summary"
        :shape="selectedShape"
        :grade="selectedGradeDesig"
        :calcTitles="['Tensile Strength', 'Compressive Strength', 'Flexural Strength', 'Shear Strength', 'Torsional Strength']"
        :calcDisplays="[tensionCalcDisplay, compressionCalcDisplay, flexureCalcDisplay, shearCalcDisplay, torsionCalcDisplay]"
        :calcCriticalCapacities="[
          [selectedShapeTensionCriticalCapacity],
          [selectedShapeCompressionCriticalCapacity],
          [selectedShapeMajorFlexureCriticalCapacity, selectedShapeMinorFlexureCriticalCapacity],
          [selectedShapeMajorShearCriticalCapacity, selectedShapeMinorShearCriticalCapacity],
          [selectedShapeTorsionCriticalCapacity]
        ]"
        :contentDisplay="summaryContentDisplay"
        @updateContentDisplay="summaryContentDisplayHandler"
      />
    </div>

    <div>
      <PropertyDataViewer
        v-if="shapeDataDisplay"
        type="shape"
        title="Shape Dimension and Property"
        :subtitle="selectedShape"
        :sectionTitles="['Weight', 'Dimension', 'Property']"
        :renderDataList="[selectedShapeWeightRenderData, selectedShapeDimensionRenderData, selectedShapePropertyRenderData]"
        :contentDisplay="shapeDataContentDisplay"
        @updateContentDisplay="dataContentDisplayHandler"
      />

      <PropertyDataViewer
        v-if="gradeDataDisplay"
        type="grade"
        title="Steel Property"
        :subtitle="selectedGradeDesig"
        :sectionTitles="['']"
        :renderDataList="[selectedASTMSpecPropRenderData]"
        :contentDisplay="gradeDataContentDisplay"
        @updateContentDisplay="dataContentDisplayHandler"
      />
    </div>

    <div>
      <SlenderResultViewer
        v-if="slenderClassDisplay"
        title="Element Slenderness Class"
        :shapeType="selectedShapeType"
        :axialSlenderClass="selectedShapeAxialSlenderClass"
        :flexureSlenderClass="selectedShapeFlexureSlenderClass"
        :compressionDisplay="compressionSlenderClassDisplay"
        :flexureDisplay="flexureSlenderClassDisplay"
        :contentDisplay="slenderClassContentDisplay"
        @updateContentDisplay="slenderContentDisplayHandler"
      />
    </div>

    <div>
      <StrengthResultViewer
        v-if="tensionCalcDisplay"
        type="tension"
        title="Tensile Strength"
        :capacities="[selectedShapeTensionCapacity]"
        :criticalCapacities="[selectedShapeTensionCriticalCapacity]"
        :contentDisplay="tensionCalcContentDisplay"
        @updateContentDisplay="calcContentDisplayHandler"
      />
      
      <StrengthResultViewer
        v-if="compressionCalcDisplay"
        type="compression"
        title="Compressive Strength"
        :capacities="[selectedShapeCompressionCapacity]"
        :criticalCapacities="[selectedShapeCompressionCriticalCapacity]"
        :contentDisplay="compressionCalcContentDisplay"
        @updateContentDisplay="calcContentDisplayHandler"
      />
      
      <StrengthResultViewer
        v-if="flexureCalcDisplay"
        type="flexure"
        title="Flexural Strength"
        :capacities="[selectedShapeMajorFlexureCapacity, selectedShapeMinorFlexureCapacity]"
        :criticalCapacities="[selectedShapeMajorFlexureCriticalCapacity, selectedShapeMinorFlexureCriticalCapacity]"
        :contentDisplay="flexureCalcContentDisplay"
        @updateContentDisplay="calcContentDisplayHandler"
      />
      
      <StrengthResultViewer
        v-if="shearCalcDisplay"
        type="shear"
        title="Shear Strength"
        :capacities="[selectedShapeMajorShearCapacity, selectedShapeMinorShearCapacity]"
        :criticalCapacities="[selectedShapeMajorShearCriticalCapacity, selectedShapeMinorShearCriticalCapacity]"
        :contentDisplay="shearCalcContentDisplay"
        @updateContentDisplay="calcContentDisplayHandler"
      />
      
      <StrengthResultViewer
        v-if="torsionCalcDisplay"
        type="torsion"
        title="Torsional Strength"
        :capacities="[selectedShapeTorsionCapacity]"
        :criticalCapacities="[selectedShapeTorsionCriticalCapacity]"
        :contentDisplay="torsionCalcContentDisplay"
        @updateContentDisplay="calcContentDisplayHandler"
      />
    </div>

    <footer class="footer-container">
      <hr>
      <div>Engineer is responsible for verifying the accuracy, suitability, and applicability of the calculated results</div>
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

  import { tensionCalculator } from './utils/tension-calculators.js';
  import { criticalTensionResultProcessor } from './utils/tension-calculators.js';

  import { compressionCalculator } from './utils/compression-calculators.js';
  import { criticalCompressionResultProcessor } from './utils/compression-calculators.js';

  import { majorFlexureCalculator } from './utils/flexure-calculators.js';
  import { minorFlexureCalculator } from './utils/flexure-calculators.js';
  import { criticalFlexureResultProcessor } from './utils/flexure-calculators.js';

  import { majorShearCalculator } from './utils/shear-calculators.js';
  import { minorShearCalculator } from './utils/shear-calculators.js';
  import { criticalShearResultProcessor } from './utils/shear-calculators.js';

  import { torsionCalculator } from './utils/torsion-calculators.js';
  import { criticalTorsionResultProcessor } from './utils/torsion-calculators.js';

  import { selectionValidator } from '../utils/validators.js';

  import { shapeWeightRenderDataFilterer } from './utils/data-filterers.js';
  import { shapeDimensionRenderDataFilterer } from './utils/data-filterers.js';
  // import { shapeSlenderRatioFilterer } from './utils/data-filterers.js';
  import { shapeSlenderRatioRenderDataFilterer } from './utils/data-filterers.js';
  import { shapePropertyRenderDataFilterer } from './utils/data-filterers.js';

  import MultiSelector from '../common/MultiSelector.vue';
  import NumberInputField from '../common/NumberInputField.vue';

  import SummaryViewer from './SummaryViewer.vue';
  import PropertyDataViewer from './PropertyDataViewer.vue';
  import SlenderResultViewer from './SlenderResultViewer.vue';
  import StrengthResultViewer from './StrengthResultViewer.vue';

  
  export default {
    components: {
      // common component
      MultiSelector,
      NumberInputField,

      // steel component
      SummaryViewer,
      PropertyDataViewer,
      SlenderResultViewer,
      StrengthResultViewer,
    },

    data() {
      return {
        unit: 0,   // 0 for US units, 1 for metric units

        selectedDescShapeType: 'All',
        selectedShape: null,
        selectedGrade: null,
        selectedCalcs: [],
        calcOptions: [
          { value: "tension", label: "Tensile Strength" },
          { value: "compression", label: "Compressive Strength" },
          { value: "flexure", label: "Flexural Strength" },
          { value: "shear", label: "Shear Strength" },
          { value: "torsion", label: "Torsional Strength" }
        ],

        enteredEffectiveLengthX: 0,
        enteredEffectiveLengthY: 0,
        enteredEffectiveLengthZ: 0,
        enteredAngleLength: 0,
        selectedAngleMemberType: 0,
        selectedAngleConnectedLeg: 0,
        enteredUnbracedLength: 0,
        enteredLTBModFactor: 1,
        selectedConsiderTensionFieldAction: false,
        selectedConsiderTransverseStiffener: false,
        enteredTransverseStiffenerDistance: 0,
        enteredMaxToZeroShearDistance: 0,
        enteredMemberLength: 0,

        validatedEffectiveLengthX: 0,
        validatedEffectiveLengthY: 0,
        validatedEffectiveLengthZ: 0,
        validatedAngleLength: 0,
        validatedUnbracedLength: 0,
        validatedLTBModFactor: 1,
        validatedTransverseStiffenerDistance: 0,
        validatedMaxToZeroShearDistance: 0,
        validatedMemberLength: 0,

        // display variable
        shapeTypeSelectionDisplay: true,

        // content display variable
        summaryContentDisplay: '-',
        shapeDataContentDisplay: '-',
        gradeDataContentDisplay: '-',
        slenderClassContentDisplay: '-',
        tensionCalcContentDisplay: '-',
        compressionCalcContentDisplay: '-',
        flexureCalcContentDisplay: '-',
        shearCalcContentDisplay: '-',
        torsionCalcContentDisplay: '-',
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

      // calculation selection variable

      tensionCalcSelected() {
        return this.selectedCalcs.includes('tension');
      },

      compressionCalcSelected() {
        return this.selectedCalcs.includes('compression');
      },

      flexureCalcSelected() {
        return this.selectedCalcs.includes('flexure');
      },

      shearCalcSelected() {
        return this.selectedCalcs.includes('shear');
      },

      torsionCalcSelected() {
        return this.selectedCalcs.includes('torsion');
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

      tensionCalcValid() {
        return !!this.selectedShapeTensionCapacity;
      },

      compressionCalcValid() {
        return !!this.selectedShapeCompressionCapacity;
      },

      flexureCalcValid() {
        return !!this.selectedShapeMajorFlexureCapacity || !!this.selectedShapeMinorFlexureCapacity;
      },

      shearCalcValid() {
        return !!this.selectedShapeMajorShearCapacity || !!this.selectedShapeMinorShearCapacity;
      },

      torsionCalcValid() {
        return !!this.selectedShapeTorsionCapacity;
      },

      // input display variable

      shapeSelectionDisplay() {
        return this.selectedDescShapeTypeValid;
      },

      gradeSelectionDisplay() {
        return this.selectedShapeValid;
      },

      calcSelectionDisplay() {
        return this.selectedGradeValid;
      },

      compressionInputDisplay() {
        return this.selectedGradeValid && this.compressionCalcSelected;
      },
      effectiveLengthInputDisplay() {
        return this.selectedGradeValid && !['L Equal', 'L Unequal'].includes(this.selectedShapeType);
      },
      angleLengthInputDisplay() {
        return this.selectedGradeValid && ['L Equal', 'L Unequal'].includes(this.selectedShapeType);
      },
      angleMemberTypeSelectionDisplay() {
        return this.selectedGradeValid && ['L Equal', 'L Unequal'].includes(this.selectedShapeType);
      },
      angleConnectedLegSelectionDisplay() {
        return this.selectedGradeValid && ['L Unequal'].includes(this.selectedShapeType);
      },

      flexureInputDisplay() {
        return this.selectedGradeValid && this.flexureCalcSelected;
      },
      unbracedLengthInputDisplay() {
        return this.selectedGradeValid;
      },
      ltbModFactorInputDisplay() {
        return this.selectedGradeValid;
      },

      shearInputDisplay() {
        return this.selectedGradeValid && this.shearCalcSelected && (this.considerTransverseStiffenerSelectionDisplay || this.maxToZeroShearDistanceInputDisplay);
      },
      considerTensionFieldActionSelectionDisplay() {
        return this.selectedGradeValid && ['W', 'M', 'S', 'HP', 'C', 'MC'].includes(this.selectedShapeType);
      },
      considerTransverseStiffenerSelectionDisplay() {
        return this.selectedGradeValid && ['W', 'M', 'S', 'HP', 'C', 'MC'].includes(this.selectedShapeType);
      },
      transverseStiffenerDistanceInputDisplay() {
        return this.selectedConsiderTransverseStiffener;
      },
      maxToZeroShearDistanceInputDisplay() {
        return this.selectedGradeValid && ['HSS Round', 'PIPE'].includes(this.selectedShapeType);
      },

      torsionInputDisplay() {
        return this.selectedGradeValid && this.torsionCalcSelected && ['HSS Round', 'PIPE'].includes(this.selectedShapeType);
      },
      memberLengthInputDisplay() {
        return ['HSS Round', 'PIPE'].includes(this.selectedShapeType);
      },

      // output display variable

      summaryDisplay() {
        return this.tensionCalcDisplay || this.compressionCalcDisplay || this.flexureCalcDisplay || this.shearCalcDisplay || this.torsionCalcDisplay;
      },

      shapeDataDisplay() {
        return this.selectedShapeValid;
      },

      gradeDataDisplay() {
        return this.selectedGradeValid;
      },

      slenderClassDisplay() {
        return (this.selectedShapeValid && this.selectedGradeValid) && (this.compressionCalcSelected || this.flexureCalcSelected || this.shearCalcSelected || this.torsionCalcSelected);
      },

      compressionSlenderClassDisplay() {
        return this.compressionCalcSelected;
      },

      flexureSlenderClassDisplay() {
        return this.flexureCalcSelected;
      },

      tensionCalcDisplay() {
        return this.tensionCalcValid && this.tensionCalcSelected;
      },

      compressionCalcDisplay() {
        return this.compressionCalcValid && this.compressionCalcSelected;
      },

      flexureCalcDisplay() {
        return this.flexureCalcValid && this.flexureCalcSelected;
      },

      shearCalcDisplay() {
        return this.shearCalcValid && this.shearCalcSelected;
      },

      torsionCalcDisplay() {
        return this.torsionCalcValid && this.torsionCalcSelected;
      },

      // calc variable

      selectedShapeData() {
        return shapeDataFetcher(this.unit, this.selectedShape);
      },

      selectedShapeType() {
        return shapeTypeFetcher(this.unit, this.selectedShape);
      },

      selectedASTMSpecProp() {
        return astmSpecPropFetcher(this.selectedGrade);
      },

      // selectedShapeSlenderRatio() {
      //   return shapeSlenderRatioFilterer(this.selectedShapeData, this.selectedShapeType);
      // },

      selectedShapeAxialSlenderClass() {
        return axialSlenderClassifier(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp);
      },

      selectedShapeFlexureSlenderClass() {
        return flexureSlenderClassifier(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp);
      },

      // calculated capacity

      selectedShapeTensionCapacity() {
        return tensionCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp);
      },
      selectedShapeTensionCriticalCapacity() {
        return criticalTensionResultProcessor(this.selectedShapeTensionCapacity);
      },

      selectedShapeCompressionCapacity() {
        return compressionCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeAxialSlenderClass, this.validatedEffectiveLengthX, this.validatedEffectiveLengthY, this.validatedEffectiveLengthZ, this.validatedAngleLength, this.selectedAngleMemberType, this.selectedAngleConnectedLeg);
      },
      selectedShapeCompressionCriticalCapacity() {
        return criticalCompressionResultProcessor(this.selectedShapeCompressionCapacity);
      },

      selectedShapeMajorFlexureCapacity() {
        return majorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },
      selectedShapeMajorFlexureCriticalCapacity() {
        return criticalFlexureResultProcessor(this.selectedShapeMajorFlexureCapacity);
      },
      selectedShapeMinorFlexureCapacity() {
        return minorFlexureCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedUnbracedLength, this.validatedLTBModFactor);
      },
      selectedShapeMinorFlexureCriticalCapacity() {
        return criticalFlexureResultProcessor(this.selectedShapeMinorFlexureCapacity);
      },

      selectedShapeMajorShearCapacity() {
        return majorShearCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.selectedConsiderTensionFieldAction, this.selectedConsiderTransverseStiffener, this.validatedTransverseStiffenerDistance, this.validatedMaxToZeroShearDistance);
      },
      selectedShapeMajorShearCriticalCapacity() {
        return criticalShearResultProcessor(this.selectedShapeMajorShearCapacity);
      },
      selectedShapeMinorShearCapacity() {
        return minorShearCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedMaxToZeroShearDistance);
      },
      selectedShapeMinorShearCriticalCapacity() {
        return criticalShearResultProcessor(this.selectedShapeMinorShearCapacity);
      },

      selectedShapeTorsionCapacity() {
        return torsionCalculator(this.selectedShapeData, this.selectedShapeType, this.selectedASTMSpecProp, this.selectedShapeFlexureSlenderClass, this.validatedMemberLength);
      },
      selectedShapeTorsionCriticalCapacity() {
        return criticalTorsionResultProcessor(this.selectedShapeTorsionCapacity);
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

      selectedConsiderTensionFieldAction(newValue) {
        if (newValue) {
          this.selectedConsiderTransverseStiffener = true;
        }
      }
    },

    methods: {
      validatedNumberHandler({ id, value }) {
        if (id === 'effectiveLengthX') {
          this.enteredEffectiveLengthX = value;
          this.validatedEffectiveLengthX = value * 12;
        } else if (id === 'effectiveLengthY') {
          this.enteredEffectiveLengthY = value;
          this.validatedEffectiveLengthY = value * 12;
        } else if (id === 'effectiveLengthZ') {
          this.enteredEffectiveLengthZ = value;
          this.validatedEffectiveLengthZ = value * 12;
        } else if (id === 'angleLength') {
          this.enteredAngleLength = value;
          this.validatedAngleLength = value * 12;
        } else if (id === 'unbracedLength') {
          this.enteredUnbracedLength = value;
          this.validatedUnbracedLength = value * 12;
        } else if (id === 'ltbModFactor') {
          this.enteredLTBModFactor = value;
          this.validatedLTBModFactor = value;
        } else if (id === 'transverseStiffenerDistance') {
          this.enteredTransverseStiffenerDistance = value;
          this.validatedTransverseStiffenerDistance = value;
        } else if (id === 'maxToZeroShearDistance') {
          this.enteredMaxToZeroShearDistance = value;
          this.validatedMaxToZeroShearDistance = value * 12;
        } else if (id === 'memberLength') {
          this.enteredMemberLength = value;
          this.validatedMemberLength = value * 12;
        }
      },

      summaryContentDisplayHandler({ contentDisplay }) {
        this.summaryContentDisplay = contentDisplay;
      },

      dataContentDisplayHandler({ type, contentDisplay }) {
        this[`${type}DataContentDisplay`] = contentDisplay;
      },

      slenderContentDisplayHandler({ contentDisplay }) {
        this.slenderClassContentDisplay = contentDisplay;
      },

      calcContentDisplayHandler({ type, contentDisplay }) {
        this[`${type}CalcContentDisplay`] = contentDisplay;
      },

      reset() {
        this.selectedDescShapeType = 'All';
        this.selectedShape = null;
        this.selectedGrade = null;
        this.selectedCalcs = [];

        this.enteredEffectiveLengthX = 0;
        this.enteredEffectiveLengthY = 0;
        this.enteredEffectiveLengthZ = 0;
        this.enteredAngleLength = 0;
        this.selectedAngleMemberType = 0;
        this.selectedAngleConnectedLeg = 0;
        this.enteredUnbracedLength = 0;
        this.enteredLTBModFactor = 1;
        this.selectedConsiderTensionFieldAction = false;
        this.selectedConsiderTransverseStiffener = false;
        this.enteredTransverseStiffenerDistance = 0;
        this.enteredMaxToZeroShearDistance = 0;
        this.enteredMemberLength = 0;

        this.validatedEffectiveLengthX = 0;
        this.validatedEffectiveLengthY = 0;
        this.validatedEffectiveLengthZ = 0;
        this.validatedAngleLength = 0;
        this.validatedUnbracedLength = 0;
        this.validatedLTBModFactor = 1;
        this.validatedTransverseStiffenerDistance = 0;
        this.validatedMaxToZeroShearDistance = 0;
        this.validatedMemberLength = 0;

        this.summaryContentDisplay = '-';
        this.shapeDataContentDisplay = '-';
        this.gradeDataContentDisplay = '-';
        this.slenderClassContentDisplay = '-';
        this.tensionCalcContentDisplay = '-';
        this.compressionCalcContentDisplay = '-';
        this.flexureCalcContentDisplay = '-';
        this.shearCalcContentDisplay = '-';
        this.torsionCalcContentDisplay = '-';
      },
    },
  };
</script>