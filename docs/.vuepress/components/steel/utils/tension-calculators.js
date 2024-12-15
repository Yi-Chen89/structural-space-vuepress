import { Fy_, Fu_, E_, G_ } from '../constants/variable-html';
import { W_, A_ } from '../constants/variable-html';
import { d_, Ht_, h_, OD_, bf_, B_, b_, ID_, tw_, tf_, t_, tdes_, kdes_ } from '../constants/variable-html';
import { x_, y_, eo_, xp_, yp_ } from '../constants/variable-html';
import { Ix_, Zx_, Sx_, rx_, Iy_, Zy_, Sy_, ry_, Iz_, rz_, Sz_, J_, Cw_, C_ } from '../constants/variable-html';
import { ro_, H_ } from '../constants/variable-html';
import { rts_, ho_ } from '../constants/variable-html';
import { lambda_, lambdap_, lambdar_, lambdaf_, lambdapf_, lambdarf_, lambdaw_, lambdapw_, lambdarw_ } from '../constants/variable-html';
import { Lcx_, Lcy_, Lcz_, Lb_, Lp_, Lr_, Lv_, L_ } from '../constants/variable-html';
import { Pn_, Mp_, Mn_, Vn_, Tn_ } from '../constants/variable-html';

import { resultRenderDataConstructor } from './render-data-constructors';

// A360 Chapter D

export function tensionCalculator(shapeData, shapeType, astmSpecProp) {
  if (shapeData && shapeType && astmSpecProp) {
    const { Fy, Fu, E } = astmSpecProp;

    let result = {
      'Pn_2_a': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Pn_2_b': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'L Equal', 'L Unequal', 'WT', 'MT', 'ST', 'HSS Rect.', 'HSS Square', 'HSS Round', 'PIPE'].includes(shapeType)) {
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
    //   [ "Pn_2_b", { "isApplicable": true, "phiValue": 0.75, ... } ]
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
      
      // output data structure (deep copy)
      // [
      //   { "phiValue": 0.9, ..., "isMultiState": true }
      // ]
      const output = [];
      // deep copy
      const object = JSON.parse(JSON.stringify(criticalResult[1]));
      // remove unnecessary key-value from object
      const keysToRemove = ['isApplicable', 'html', 'title'];
      keysToRemove.forEach(keyToRemove => {
        delete object[keyToRemove];
      });
      output.push(object);
      
      // add isMultiState attribute
      for (const item of output) {
        if (item) {
          item['isMultiState'] = Object.keys(result).length > 1;
        }
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
  const html = `<div>${Pn_} = ${Fy_} ${Ag_} = ${Pn.toFixed(2)} k</div>
                <div>${Pn_} = ${Pn.toFixed(1)} k</div>`;
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
  html += `<div>${Pn_} = ${Fu_} ${Ae_} = ${Pn.toFixed(2)} k</div>
           <div>${Pn_} = ${Pn.toFixed(1)} k</div>`;
  return [phi, Pn, html];
}

// Effective Net Area, Ae, Calculator
function effectiveNetAreaCalculator(Ag) {
  let Ae = 0;
  let html = '';

  Ae = 0.75 * Ag;
  html += `<div>Effective net area</div>
           <div class="indented-line">${Ae_} = 0.75 ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;

  return [Ae, html];
}


// html notation
const Ag_ = 'A<sub>g</sub>';
const Ae_ = 'A<sub>e</sub>';