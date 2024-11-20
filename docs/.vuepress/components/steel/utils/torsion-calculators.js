import { Fy_, Fu_, E_, G_ } from '../constants/variable-html';
import { W_, A_ } from '../constants/variable-html';
import { d_, Ht_, h_, OD_, bf_, B_, b_, ID_, tw_, tf_, t_, tdes_, kdes_ } from '../constants/variable-html';
import { x_, y_, eo_, xp_, yp_ } from '../constants/variable-html';
import { Ix_, Zx_, Sx_, rx_, Iy_, Zy_, Sy_, ry_, Iz_, rz_, Sz_, J_, Cw_, C_ } from '../constants/variable-html';
import { ro_, H_ } from '../constants/variable-html';
import { rts_, ho_ } from '../constants/variable-html';
import { lambda_, lambdap_, lambdar_, lambdaf_, lambdapf_, lambdarf_, lambdaw_, lambdapw_, lambdarw_ } from '../constants/variable-html';

import { resultRenderDataConstructor } from './render-data-constructors';

// A360 Chapter H3

export function torsionCalculator(shapeData, shapeType, astmSpecProp, slenderClass, L) {
  if (shapeData && shapeType && astmSpecProp && slenderClass) {
    const { Fy, E } = astmSpecProp;
    const {
      flange: {
        ratio: { value: lambdaf },
      },
      web: {
        ratio: { value: lambdaw },
      } 
    } = slenderClass;
    
    let result = {
      'Tn_H3_1_a': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Tn_H3_1_b': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {



    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // H3.1(b)

      const { C } = shapeData;

      result['Tn_H3_1_b']['isApplicable'] = true;
      const [phi_H3_1_b, Tn_H3_1_b, html_H3_1_b] = H3_1bRectangularHollowSection(Fy, E, C, lambdaw);
      result['Tn_H3_1_b']['phiValue'] = phi_H3_1_b;
      result['Tn_H3_1_b']['nominalValue'] = Tn_H3_1_b;
      result['Tn_H3_1_b']['designValue'] = phi_H3_1_b * Tn_H3_1_b;
      result['Tn_H3_1_b']['html'] = html_H3_1_b;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // H3.1(a)

      const { OD, C } = shapeData;
      
      result['Tn_H3_1_a']['isApplicable'] = true;
      const [phi_H3_1_a, Tn_H3_1_a, html_H3_1_a] = H3_1aCircularHollowSection(Fy, E, OD, C, lambdaf, L);
      result['Tn_H3_1_a']['phiValue'] = phi_H3_1_a;
      result['Tn_H3_1_a']['nominalValue'] = Tn_H3_1_a;
      result['Tn_H3_1_a']['designValue'] = phi_H3_1_a * Tn_H3_1_a;
      result['Tn_H3_1_a']['html'] = html_H3_1_a;
    }
    
    result = resultRenderDataConstructor(result, 'torsion');
    return result;

  } else {
    return null;
  }
}

export function criticalTorsionResultProcessor(result) {
  if (result) {
    // filter out objects where isApplicable is false or designValue is 0
    // filteredResultAsList data structure
    // [
    //   [ "Tn_H3_1_a", { "isApplicable": true, "phiValue": 0.9, ... } ],
    //   [ "Tn_H3_1_b", { "isApplicable": true, "phiValue": 0.9, ... } ]
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
      //   "Tn_H3_1_a": { "isApplicable": true, "phiValue": 0.9, ... }
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

// H3 Members Subject to Torsion and Combined Torsion, Flexure, Shear, and/or Axial Force

// H3.1(a) Round HSS Subject to Torsion
function H3_1aCircularHollowSection(Fy, E, D, C, lambda, L) {
  let phi = 0.9;
  let Tn = 0;
  let html = '';

  let Fcr1 = 0;
  let Fcr2 = 0;
  html += `<div>Critical stress</div>`;
  if (L > 0) {
    Fcr1 = 1.23 * E / (Math.sqrt(L / D) * lambda**(5 / 4));
    html += `<div class="indented-line">${Fcr_} = 1.23 ${E_} / (&radic;(${L_} / ${OD_}) ${lambda_}<sup>5 / 4</sup>) = ${Fcr1.toFixed(2)} ksi</div>`;
  }
  Fcr2 = 0.60 * E / lambda**(3 / 2);
  html += `<div class="indented-line">${Fcr_} = 0.60 ${E_} / ${lambda_}<sup>3 / 2</sup> = ${Fcr2.toFixed(2)} ksi</div>`;

  let Fcr = Math.max(Fcr1, Fcr2);
  html += `<div class="indented-line">${Fcr_} = ${Fcr.toFixed(2)} ksi &le; 0.6 ${Fy_}</div>`;

  if (Fcr <= 0.6 * Fy) {
    html += `<div class="indented-line">Torsional buckling governs</div>`;
  } else {
    Fcr = 0.6 * Fy;
    html += `<div class="indented-line">Torsional yielding governs</div>
             <div class="indented-line">${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</div>`;
  }

  Tn = Fcr * C;
  html += `<div>${Tn_} = ${Fcr_} ${C_} = ${Tn.toFixed(2)} k-in</div>`;

  const Tn_converted = Tn / 12;
  html += `<div>${Tn_} = ${Tn.toFixed(1)} k-in = ${Tn_converted.toFixed(1)} k-ft</div>`;

  return [phi, Tn_converted, html];
}

// H3.1(b) Rectangular HSS Subject to Torsion
function H3_1bRectangularHollowSection(Fy, E, C, lambdaw) {
  let phi = 0.9;
  let Tn = 0;
  let html = '';

  const calcTerm1 = Math.sqrt(E / Fy);
  const calcTerm1_ = `&radic;(${E_} / ${Fy_})`;

  let Fcr = 0;
  html += `<div>Critical stress</div>`;
  if (lambdaw <= 2.45 * calcTerm1) {
    Fcr = 0.6 * Fy;
    html += `<div class="indented-line">For ${lambdaw_} &le; 2.45 ${calcTerm1_}</div>
             <div class="indented-line">Torsional yielding governs</div>
             <div class="indented-line">${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</div>`;

  } else if (lambdaw <= 3.07 * calcTerm1) {
    Fcr = 0.6 * Fy * (2.45 * calcTerm1) / lambdaw;
    html += `<div> class="indented-line"For 2.45 ${calcTerm1_} &lt; ${lambdaw_} &le; 3.07 ${calcTerm1_}</div>
             <div class="indented-line">Torsional buckling governs</div>
             <div class="indented-line">${Fcr_} = 0.6 ${Fy_} (2.45 ${calcTerm1_}) / ${lambdaw_} = ${Fcr.toFixed(2)} ksi</div>`;

  } else if (lambdaw <= 260) {
    Fcr = 0.458 * Math.PI**2 * E / lambdaw**2;
    html += `<div class="indented-line">For 3.07 ${calcTerm1_} &lt; ${lambdaw_} &le; 260</div>
             <div class="indented-line">Torsional buckling governs</div>
             <div class="indented-line">${Fcr_} = 0.458 &pi;<sup>2</sup> ${E_} / ${lambdaw_}<sup>2</sup> = ${Fcr.toFixed(2)} ksi</div>`;
  }

  Tn = Fcr * C;
  html += `<div>${Tn_} = ${Fcr_} ${C_} = ${Tn.toFixed(2)} k-in</div>`;

  const Tn_converted = Tn / 12;
  html += `<div>${Tn_} = ${Tn.toFixed(1)} k-in = ${Tn_converted.toFixed(1)} k-ft</div>`;

  return [phi, Tn_converted, html];
}


// html notation
const L_ = 'L';

const Fcr_ = 'F<sub>cr</sub>';

const Tn_ = 'T<sub>n</sub>';