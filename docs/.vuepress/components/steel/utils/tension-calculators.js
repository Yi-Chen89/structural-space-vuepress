import { resultRenderDataConstructor } from './render-data-constructors';

// A360 Chapter D

export function tensionCalculator(shapeData, shapeType, astmSpecProp) {
  if (shapeData && shapeType && astmSpecProp) {
    const { Fy, Fu, E } = astmSpecProp;

    let result = {
      'Pn_2_a': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Pn_2_b': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST', 'HSS Rect.', 'HSS Square', 'HSS Round', 'PIPE'].includes(shapeType)) {
      const { A } = shapeData;

      // D2(a) Tension Yielding
      result['Pn_2_a']['isApplicable'] = true;
      const [phi_2_a, Pn_2_a, PnHtml_2_a] = D2_aYielding(Fy, A);
      result['Pn_2_a']['phiValue'] = phi_2_a;
      result['Pn_2_a']['nominalValue'] = Pn_2_a;
      result['Pn_2_a']['designValue'] = phi_2_a * Pn_2_a;
      result['Pn_2_a']['html'] = PnHtml_2_a;

      // D2(b) Tension Rupture
      result['Pn_2_b']['isApplicable'] = true;
      const [phi_2_b, Pn_2_b, PnHtml_2_b] = D2_bRupture(Fu, A);
      result['Pn_2_b']['phiValue'] = phi_2_b;
      result['Pn_2_b']['nominalValue'] = Pn_2_b;
      result['Pn_2_b']['designValue'] = phi_2_b * Pn_2_b;
      result['Pn_2_b']['html'] = PnHtml_2_b;
    }

    result = resultRenderDataConstructor(result, 'tension');
    return result;

  } else {
    return null;
  }
}

export function criticalTensionResultProcessor(result) {
  if (result) {
    // filter out objects where isApplicable is false or designValue is 0
    // filteredResultAsList data structure
    // [
    //   [ "Pn_2_a", { "isApplicable": true, "phiValue": 0.9, ... } ],
    //   [ "Pn_2_b", { "isApplicable": true, "phiValue": 0.9, ... } ]
    // ]
    const filteredResultAsList = Object.entries(result)
      .filter(([, item]) =>
        item['isApplicable'] && item['designValue'] !== 0
      );
    
    if (filteredResultAsList.length > 0) {
      const criticalResult = filteredResultAsList.reduce(
        (min, item) =>
          item[1]['designValue'] < min[1]['designValue'] ? item : min
      );
    
      // convert list back to dictionary
      // output data structure
      // {
      //   "Pn_2_a": { "isApplicable": true, "phiValue": 0.9, ... }
      // }
      const output = Object.fromEntries([criticalResult]);
    
      // add isMultiState attribute
      for (const key in output) {
        output[key]['isMultiState'] = Object.keys(result).length > 1;
      }
      return output;
    
    } else {
      return null;
    }
  } else {
    return null;
  }
}


// Helper Function

// D2(a) Tension Yielding
function D2_aYielding(Fy, Ag) {
  const phi = 0.9;
  const Pn = Fy * Ag;
  const html = `<p>${Pn_} = ${Fy_} ${Ag_} = ${Pn.toFixed(2)} k</p>
                <p>${Pn_} = ${Pn.toFixed(1)} k</p>`;
  return [phi, Pn, html];
}

// D2(b) Tension Rupture
function D2_bRupture(Fu, Ag) {
  const phi = 0.75;
  let Pn = 0;
  let html = '';

  const [Ae, AeHtml] = effectiveNetAreaCalculator(Ag);
  html += AeHtml;

  Pn = Fu * Ae;
  html += `<p>${Pn_} = ${Fu_} ${Ae_} = ${Pn.toFixed(2)} k</p>
           <p>${Pn_} = ${Pn.toFixed(1)} k</p>`;
  return [phi, Pn, html];
}

// Effective Net Area, Ae, Calculator
function effectiveNetAreaCalculator(Ag) {
  let Ae = 0;
  let html = '';

  Ae = 0.75 * Ag;
  html += `<p>Effective net area</p>
           <p>${Ae_} = 0.75 ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  return [Ae, html];
}


// html notation
// material notation
const Fy_ = 'F<sub>y</sub>';
const Fu_ = 'F<sub>u</sub>';
const E_ = 'E';
const G_ = 'G';
// database variable notation
const W_ = 'W';
const A_ = 'A';
const d_ = 'd';
const Ht_ = 'Ht';
const h_ = 'h';
const OD_ = 'OD';
const bf_ = 'b<sub>f</sub>';
const B_ = 'B';
const b_ = 'b';
const ID_ = 'ID';
const tw_ = 't<sub>w</sub>';
const tf_ = 't<sub>f</sub>';
const t_ = 't';
const tdes_ = 't<sub>des</sub>';
const y_ = 'y';
const Ix_ = 'I<sub>x</sub>';
const Zx_ = 'Z<sub>x</sub>';
const Sx_ = 'S<sub>x</sub>';
const rx_ = 'r<sub>x</sub>';
const Iy_ = 'I<sub>y</sub>';
const Zy_ = 'Z<sub>y</sub>';
const Sy_ = 'S<sub>y</sub>';
const ry_ = 'r<sub>y</sub>';
const Iz_ = 'I<sub>z</sub>';
const rz_ = 'r<sub>z</sub>';
const Sz_ = 'S<sub>z</sub>';
const J_ = 'J';
const Cw_ = 'C<sub>w</sub>';
const C_ = 'C';
const rts_ = 'r<sub>ts</sub>';
const ho_ = 'h<sub>o</sub>';




const Ag_ = 'A<sub>g</sub>';
const Ae_ = 'A<sub>e</sub>';



const Pn_ = 'P<sub>n</sub>';