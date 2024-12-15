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

// A360 Chapter E

export function compressionCalculator(shapeData, shapeType, astmSpecProp, slenderClass, Lcx, Lcy, Lcz) {
  if (shapeData && shapeType && astmSpecProp && slenderClass) {
    const { Fy, E, G } = astmSpecProp;
    const {
      flange: {
        ratio: { value: lambdaf },
        limit: { value: lambdarf },
        class: flange,
      },
      web: {
        ratio: { value: lambdaw },
        limit: { value: lambdarw },
        class: web,
      } 
    } = slenderClass;

    let result = {
      'Pn_3': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Pn_4': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Pn_3_7': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Pn_4_7': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      const { A, d, bf, tw, tf, Ix, rx, Iy, ry, J, Cw } = shapeData;

      // E3 Flexural Buckling
      const [phi_3, Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      // E4 Torsional Buckling
      const [phi_4, Fcr_4, FcrHtml_4] = E4_aTorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3 E4
        // limit state: FB TB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['phiValue'] = phi_3;
        result['Pn_3']['nominalValue'] = Pn_3;
        result['Pn_3']['designValue'] = phi_3 * Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;

        result['Pn_4']['isApplicable'] = true;
        const [Pn_4, PnHtml_4] = capacityCalculator(Fcr_4, A, 'gross');
        result['Pn_4']['phiValue'] = phi_4;
        result['Pn_4']['nominalValue'] = Pn_4;
        result['Pn_4']['designValue'] = phi_4 * Pn_4;
        result['Pn_4']['html'] = FcrHtml_4 + PnHtml_4;

      } else if (flange === 'slender' || web === 'slender') {
        // E7
        // limit state: LB
        result['Pn_3_7']['isApplicable'] = true;
        const [Ae_3, AeHtml_3] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, bf, d, tf, tw, Fcr_3, lambdaf, lambdaw, lambdarf, lambdarw, flange, web);
        const [Pn_3_7, PnHtml_3_7] = capacityCalculator(Fcr_3, Ae_3, 'effective');
        result['Pn_3_7']['phiValue'] = phi_3;
        result['Pn_3_7']['nominalValue'] = Pn_3_7;
        result['Pn_3_7']['designValue'] = phi_3 * Pn_3_7;
        result['Pn_3_7']['html'] = FcrHtml_3 + AeHtml_3 + PnHtml_3_7;

        result['Pn_4_7']['isApplicable'] = true;
        const [Ae_4, AeHtml_4] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, bf, d, tf, tw, Fcr_4, lambdaf, lambdaw, lambdarf, lambdarw, flange, web);
        const [Pn_4_7, PnHtml_4_7] = capacityCalculator(Fcr_4, Ae_4, 'effective');
        result['Pn_4_7']['phiValue'] = phi_4;
        result['Pn_4_7']['nominalValue'] = Pn_4_7;
        result['Pn_4_7']['designValue'] = phi_4 * Pn_4_7;
        result['Pn_4_7']['html'] = FcrHtml_4 + AeHtml_4 + PnHtml_4_7;
      }

    } else if (['C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
      const { A, d, bf, tw, tf, rx, ry, J, Cw, ro, H } = shapeData;

      // E3 Flexural Buckling
      const [phi_3, Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      // E4 Flexural-Torsional Buckling
      const [phi_4, Fcr_4, FcrHtml_4] = E4_bFlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, A, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3 E4
        // limit state: FB FTB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['phiValue'] = phi_3;
        result['Pn_3']['nominalValue'] = Pn_3;
        result['Pn_3']['designValue'] = phi_3 * Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;

        result['Pn_4']['isApplicable'] = true;
        const [Pn_4, PnHtml_4] = capacityCalculator(Fcr_4, A, 'gross');
        result['Pn_4']['phiValue'] = phi_4;
        result['Pn_4']['nominalValue'] = Pn_4;
        result['Pn_4']['designValue'] = phi_4 * Pn_4;
        result['Pn_4']['html'] = FcrHtml_4 + PnHtml_4;

      } else if (flange === 'slender' || web === 'slender') {
        // E7
        // limit state: LB
        result['Pn_3_7']['isApplicable'] = true;
        const [Ae_3, AeHtml_3] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, bf, d, tf, tw, Fcr_3, lambdaf, lambdaw, lambdarf, lambdarw, flange, web);
        const [Pn_3_7, PnHtml_3_7] = capacityCalculator(Fcr_3, Ae_3, 'effective');
        result['Pn_3_7']['phiValue'] = phi_3;
        result['Pn_3_7']['nominalValue'] = Pn_3_7;
        result['Pn_3_7']['designValue'] = phi_3 * Pn_3_7;
        result['Pn_3_7']['html'] = FcrHtml_3 + AeHtml_3 + PnHtml_3_7;

        result['Pn_4_7']['isApplicable'] = true;
        const [Ae_4, AeHtml_4] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, bf, d, tf, tw, Fcr_4, lambdaf, lambdaw, lambdarf, lambdarw, flange, web);
        const [Pn_4_7, PnHtml_4_7] = capacityCalculator(Fcr_4, Ae_4, 'effective');
        result['Pn_4_7']['phiValue'] = phi_4;
        result['Pn_4_7']['nominalValue'] = Pn_4_7;
        result['Pn_4_7']['designValue'] = phi_4 * Pn_4_7;
        result['Pn_4_7']['html'] = FcrHtml_4 + AeHtml_4 + PnHtml_4_7;
      }
    
    } else if (['L Equal', 'L Unequal'].includes(shapeType)) {
      const { A, h, b, t, x, y, rx, ry, J, Cw, ro } = shapeData;

      // E3 Flexural Buckling
      const [phi_3, Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      // E4 Flexural-Torsional Buckling
      const [phi_4, Fcr_4, FcrHtml_4] = E4_cFlexuralTorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, A, t, x, y, rx, ry, J, Cw, ro, Lcx, Lcy, Lcz, lambdaw);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3 E4
        // limit state: FB FTB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['phiValue'] = phi_3;
        result['Pn_3']['nominalValue'] = Pn_3;
        result['Pn_3']['designValue'] = phi_3 * Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;
        
        result['Pn_4']['isApplicable'] = true;
        const [Pn_4, PnHtml_4] = capacityCalculator(Fcr_4, A, 'gross');
        result['Pn_4']['phiValue'] = phi_4;
        result['Pn_4']['nominalValue'] = Pn_4;
        result['Pn_4']['designValue'] = phi_4 * Pn_4;
        result['Pn_4']['html'] = FcrHtml_4 + PnHtml_4;

      } else if (flange === 'slender' || web === 'slender') {
        // E7
        // limit state: LB
      }
    
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      const { A, h, b, tdes, rx, ry } = shapeData;

      // E3 Flexural Buckling
      const [phi_3, Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3
        // limit state: FB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['phiValue'] = phi_3;
        result['Pn_3']['nominalValue'] = Pn_3;
        result['Pn_3']['designValue'] = phi_3 * Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;

      } else if (flange === 'slender' || web === 'slender') {
        // E7
        // limit state: LB
        result['Pn_3_7']['isApplicable'] = true;
        const [Ae_3, AeHtml_3] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, b, h, tdes, tdes, Fcr_3, lambdaf, lambdaw, lambdarf, lambdarw, flange, web);
        const [Pn_3_7, PnHtml_3_7] = capacityCalculator(Fcr_3, Ae_3, 'effective');
        result['Pn_3_7']['phiValue'] = phi_3;
        result['Pn_3_7']['nominalValue'] = Pn_3_7;
        result['Pn_3_7']['designValue'] = phi_3 * Pn_3_7;
        result['Pn_3_7']['html'] = FcrHtml_3 + AeHtml_3 + PnHtml_3_7;
      }

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      const { A, rx, ry } = shapeData;

      // E3 Flexural Buckling
      const [phi_3, Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      if (flange === 'nonslender') {
        // E3
        // limit state: FB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['phiValue'] = phi_3;
        result['Pn_3']['nominalValue'] = Pn_3;
        result['Pn_3']['designValue'] = phi_3 * Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;
        
      } else if (flange === 'slender') {
        // E7
        // limit state: LB
        result['Pn_3_7']['isApplicable'] = true;
        const [Ae_3, AeHtml_3] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, 0, 0, 0, 0, Fcr_3, lambdaf, 0, lambdarf, 0, flange, null);
        const [Pn_3_7, PnHtml_3_7] = capacityCalculator(Fcr_3, Ae_3, 'effective');
        result['Pn_3_7']['phiValue'] = phi_3;
        result['Pn_3_7']['nominalValue'] = Pn_3_7;
        result['Pn_3_7']['designValue'] = phi_3 * Pn_3_7;
        result['Pn_3_7']['html'] = FcrHtml_3 + AeHtml_3 + PnHtml_3_7;
      }
    }

    result = resultRenderDataConstructor(result, 'compression');
    return result;

  } else {
    return null;
  }
}

export function criticalCompressionResultProcessor(result) {
  if (result) {
    // filter out objects where isApplicable is false or designValue is 0
    // filteredResultAsList data structure
    // [
    //   [ "Pn_3", { "isApplicable": true, "phiValue": 0.9, ... } ],
    //   [ "Pn_4", { "isApplicable": true, "phiValue": 0.9, ... } ]
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

// E3 Flexural Buckling of Members without Slender Elements
function E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  if (Lcx === 0 && Lcy === 0) {
    Fcr = Fy;
    html += `<div>Critical stress</div>
             <div class="indented-line">For ${Lcx_} = ${Lcy_} = 0, ${Fcr_} = ${Fy_} = ${Fy.toFixed(2)} ksi</div>`;

  } else {
    const calcTerm1x = Lcx / rx;
    const calcTerm1x_ = `${Lcx_} / ${rx_}`;
    const calcTerm1y = Lcy / ry;
    const calcTerm1y_ = `${Lcy_} / ${ry_}`;

    html += `<div>Effective slenderness ratio</div>
             <div class="indented-line">${calcTerm1x_} = ${calcTerm1x.toFixed(2)}</div>
             <div class="indented-line">${calcTerm1y_} = ${calcTerm1y.toFixed(2)}</div>`;

    let calcTerm2 = 0;
    let calcTerm2_ = '';
    if (calcTerm1x > calcTerm1y) {
      calcTerm2 = calcTerm1x;
      calcTerm2_ = calcTerm1x_;
      html += `<div class="indented-line">Major axis governs</div>`;
    } else if (calcTerm1x < calcTerm1y) {
      calcTerm2 = calcTerm1y;
      calcTerm2_ = calcTerm1y_;
      html += `<div class="indented-line">Minor axis governs</div>`;
    } else {
      calcTerm2 = calcTerm1x;
      calcTerm2_ = calcTerm1x_;
      html += `<div class="indented-line">Major and minor axes govern equally</div>`;
    }

    if (calcTerm2 > 200) {
      html += `<div class="note-message">Effective slenderness ratio preferably should not exceed 200</div>`;
    }
  
    const Fe = Math.PI**2 * E / calcTerm2**2;
    html += `<div>Elastic buckling stress</div>
             <div class="indented-line">${Fe_} = &pi;<sup>2</sup> ${E_} / (${calcTerm2_})<sup>2</sup> = ${Fe.toFixed(2)} ksi</div>`;

    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [phi, Fcr, html];
}

// E4 Torsional and Flexural-Torsional Buckling of Single Angles and Members without Slender Elements

// E4(a) Torsional Buckling of Members without Slender Elements
function E4_aTorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<div>For sections with continuous torsional bracing, torsional buckling does not apply</div>`;

  } else {
    const Fe = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ix + Iy);
    html += `<div>Torsional elastic buckling stress</div>
             <div class="indented-line">${Fe_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ix_} + ${Iy_}) = ${Fe.toFixed(2)} ksi</div>`;
    
    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [phi, Fcr, html];
}

// E4(b) Flexural-Torsional Buckling of Members without Slender Elements
function E4_bFlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, Ag, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<div>For sections with continuous torsional bracing, flexural-torsional buckling does not apply</div>`;

  } else {
    let Fe = 0;
    let FeHtml = '';
    if (['C', 'MC'].includes(shapeType)) {
      if (Lcx === 0) {
        html += `<div>${Lcx_} must not be 0</div>`;
        return [phi, Fcr, html];
      } else {
        [Fe, FeHtml] = SinglySymmetricFlexuralTorsionalElasticBucklingStressCalculator('x', E, G, Ag, rx, J, Cw, ro, H, Lcx, Lcz);
      }

    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      if (Lcy === 0) {
        html += `<div>${Lcy_} must not be 0</div>`;
        return [phi, Fcr, html];
      } else {
        [Fe, FeHtml] = SinglySymmetricFlexuralTorsionalElasticBucklingStressCalculator('y', E, G, Ag, ry, J, 0, ro, H, Lcy, Lcz);
      }

    }
    html += FeHtml;

    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [phi, Fcr, html];
}

// Flexural-Torsional Elastic Buckling Stress Calculator for Singly Symmetric Members
function SinglySymmetricFlexuralTorsionalElasticBucklingStressCalculator(axisOfSym, E, G, Ag, r, J, Cw, ro, H, Lc, Lcz) {
  let Fe = 0;
  let html = `<div>Flexural-torsional elastic buckling stress</div>
              <div class="indented-line">${ro_} = ${ro.toFixed(2)} in.&emsp;
                                         ${H_} = ${H.toFixed(3)}</div>`;

  const calcTerm1 = Lc / r;
  let calcTerm1_ = '';
  let Fexy_ = '';
  if (axisOfSym === 'x') {
    calcTerm1_ = `${Lcx_} / ${rx_}`;
    Fexy_ = `${Fex_}`;
  } else if (axisOfSym === 'y') {
    calcTerm1_ = `${Lcy_} / ${ry_}`;
    Fexy_ = `${Fey_}`;
  }

  const Fexy = Math.PI**2 * E / calcTerm1**2;
  html += `<div class="indented-line">${Fexy_} = &pi;<sup>2</sup> ${E_} / (${calcTerm1_})<sup>2</sup> = ${Fexy.toFixed(2)} ksi</div>`;

  let Fez = 0;
  if (Cw === 0) {
    Fez = (Math.PI**2 * E / Lcz**2 + G * J) / (Ag * ro**2);
    html += `<div class="indented-line">${Fez_} = (&pi;<sup>2</sup> ${E_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ag_} ${ro_}<sup>2</sup>) = ${Fez.toFixed(2)} ksi</div>`;

  } else {
    Fez = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ag * ro**2);
    html += `<div class="indented-line">${Fez_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ag_} ${ro_}<sup>2</sup>) = ${Fez.toFixed(2)} ksi</div>`;
  }

  Fe = (Fexy + Fez) / (2 * H) * (1 - Math.sqrt(1 - 4 * Fexy * Fez * H / (Fexy + Fez)**2));
  html += `<div class="indented-line">${Fe_} = (${Fexy_} + ${Fez_}) / (2 ${H_}) (1 - &radic;(1 - 4 ${Fexy_} ${Fez_} ${H_} / (${Fexy_} + ${Fez_})<sup>2</sup>)) = ${Fe.toFixed(2)} ksi</div>`;

  return [Fe, html];
}

// E4(c) Flexural-Torsional Buckling of Members without Slender Elements
function E4_cFlexuralTorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ag, t, x, y, rx, ry, J, Cw, ro, Lcx, Lcy, Lcz, lambdaw) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  const calcTerm1 = 0.71 * Math.sqrt(E / Fy);
  const calcTerm1_ = `0.71 &radic;(${E_} / ${Fy_})`;
  if (lambdaw <= calcTerm1) {
    html += `<div>For ${lambdaw_} &le; ${calcTerm1_}, flexural-torsional buckling does not apply</div>`;

  } else {
    if (Lcz === 0) {
      html += `<div>For sections with continuous torsional bracing, flexural-torsional buckling does not apply</div>`;

    } else {
      let Fe = 0;
      let FeHtml = '';

      if (Lcx === 0 && Lcy === 0) {
        html += `<div>${Lcx_} and ${Lcy_} must not be 0</div>`;
        
      } else if (Lcx === 0) {
        html += `<div>${Lcx_} must not be 0</div>`;
        
      } else if (Lcy === 0) {
        html += `<div>${Lcy_} must not be 0</div>`;
        
      } else {
        [Fe, FeHtml] = UnsymmetricFlexuralTorsionalElasticBucklingStressCalculator(E, G, Ag, t, x, y, rx, ry, J, Cw, ro, Lcx, Lcy, Lcz);
        html += FeHtml;

        let FcrHtml = '';
        [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
        html += FcrHtml;
      }
    }
  }

  return [phi, Fcr, html];
}

// Flexural-Torsional Elastic Buckling Stress Calculator for Unsymmetric Members
function UnsymmetricFlexuralTorsionalElasticBucklingStressCalculator(E, G, Ag, t, x, y, rx, ry, J, Cw, ro, Lcx, Lcy, Lcz) {
  let Fe = 0;
  let html = `<div>Flexural-torsional elastic buckling stress</div>
              <div class="indented-line">${x_} = ${x.toFixed(3)} in.&emsp;
                                         ${y_} = ${y.toFixed(3)} in.</div>
              <div class="indented-line">${ro_} = ${ro.toFixed(2)} in.</div>`;

  const Fex = Math.PI**2 * E / (Lcx / rx)**2;
  html += `<div class="indented-line">${Fex_} = &pi;<sup>2</sup> ${E_} / (${Lcx_} / ${rx_})<sup>2</sup> = ${Fex.toFixed(2)} ksi</div>`;

  const Fey = Math.PI**2 * E / (Lcy / ry)**2;
  html += `<div class="indented-line">${Fey_} = &pi;<sup>2</sup> ${E_} / (${Lcy_} / ${ry_})<sup>2</sup> = ${Fey.toFixed(2)} ksi</div>`;

  const Fez = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ag * ro**2);
  html += `<div class="indented-line">${Fez_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ag_} ${ro_}<sup>2</sup>) = ${Fez.toFixed(2)} ksi</div>`;

  const ex = t / 2;
  const ey = t / 2;
  html += `<div class="indented-line">Shear center</div>
           <div class="indented-line" style="--indented-line-level: 2;">${ex_} = ${t_} / 2 = ${ex.toFixed(3)} in.</div>
           <div class="indented-line" style="--indented-line-level: 2;">${ey_} = ${t_} / 2 = ${ey.toFixed(3)} in.</div>`;
           
  const xo = Math.abs(x - ex);
  const yo = Math.abs(y - ey);
  html += `<div class="indented-line">Coordinates of shear center with respect to centroid</div>
           <div class="indented-line" style="--indented-line-level: 2;">${xo_} = |${x_} - ${ex_}| = ${xo.toFixed(3)} in.</div>
           <div class="indented-line" style="--indented-line-level: 2;">${yo_} = |${y_} - ${ey_}| = ${yo.toFixed(3)} in.</div>`;

  const calcTerm1 = (xo / ro)**2;
  const calcTerm1_ = `(${xo_} / ${ro_})<sup>2</sup>`;
  const calcTerm2 = (yo / ro)**2;
  const calcTerm2_ = `(${yo_} / ${ro_})<sup>2</sup>`;

  const coeff1 = 1 - calcTerm1 - calcTerm2;
  const coeff1_ = `(1 - ${calcTerm1_} - ${calcTerm2_})`;
  const coeff2 = Fey * calcTerm1 + Fex * calcTerm2 - Fex - Fey - Fez;
  const coeff2_ = `(${Fey_} ${calcTerm1_} + ${Fex_} ${calcTerm2_} - ${Fex_} - ${Fey_} - ${Fez_})`;
  const coeff3 = Fex * Fey + Fey * Fez + Fex * Fez;
  const coeff3_ = `(${Fex_} ${Fey_} + ${Fey_} ${Fez_} + ${Fex_} ${Fez_})`;
  const coeff4 = -1 * Fex * Fey * Fez;
  const coeff4_ = `${Fex_} ${Fey_} ${Fez_}`;
  html += `<div class="indented-line">Solve for the lowest root of the cubic equation</div>
           <div class="indented-line" style="--indented-line-level: 2;">(${Fe_} - ${Fex_}) (${Fe_} - ${Fey_}) (${Fe_} - ${Fez_}) - ${Fe_}<sup>2</sup> (${Fe_} - ${Fey_}) (${xo_} / ${ro_})<sup>2</sup> - ${Fe_}<sup>2</sup> (${Fe_} - ${Fex_}) (${yo_} / ${ro_})<sup>2</sup> = 0</div>
           <div class="indented-line" style="--indented-line-level: 2;">${coeff1_} ${Fe_}<sup>3</sup> + ${coeff2_} ${Fe_}<sup>2</sup> + ${coeff3_} ${Fe_} - ${coeff4_} = 0</div>
           <div class="indented-line" style="--indented-line-level: 2;">(${coeff1.toFixed(2)}) ${Fe_}<sup>3</sup> + (${coeff2.toFixed(2)}) ${Fe_}<sup>2</sup> + (${coeff3.toFixed(2)}) ${Fe_} + (${coeff4.toFixed(2)}) = 0</div>`;

  const Fes = cubicEquationSolver(coeff1, coeff2, coeff3, coeff4);
  Fes.sort((a, b) => a - b);
  const Fes_ = ['F<sub>e,1</sub>', 'F<sub>e,2</sub>', 'F<sub>e,3</sub>'];
  for (let i = 0; i < Fes.length; i++) {
    html += `<div class="indented-line" style="--indented-line-level: 3;">${Fes_[i]} = ${Fes[i].toFixed(2)} ksi</div>`;
  }

  Fe = Fes[0];
  html += `<div class="indented-line" style="--indented-line-level: 2;">${Fe_} = ${Fe.toFixed(2)} ksi</div>`;

  return [Fe, html];
}

// Cubic Equation Solver
function cubicEquationSolver(a, b, c, d) {
  // standard cubic form: ax^3 + bx^2 + cx + d = 0

  // normalize coefficients
  b /= a;
  c /= a;
  d /= a;

  // depressed cubic form: x^3 + px + q = 0
  const p = c - b**2 / 3;
  const q = 2 * b**3 / 27 - b * c / 3 + d;

  // calculate discriminant
  const discriminant = q**2 / 4 + p**3 / 27;

  let roots = [];
  if (discriminant > 0) {
      // 1 real root
      const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
      const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
      const root1 = u + v - b / 3;
      roots.push(root1);

  } else if (discriminant === 0) {
      // multiple real roots (2 or 3 roots)
      const u = Math.cbrt(-q / 2);
      roots.push(2 * u - b / 3);
      roots.push(-u - b / 3);

  } else {
      // 3 distinct real roots
      const r = Math.sqrt(-(p**3) / 27);
      const phi = Math.acos(-q / (2 * Math.sqrt(-(p**3) / 27)));
      const t = 2 * Math.cbrt(r);

      const root1 = t * Math.cos(phi / 3) - b / 3;
      const root2 = t * Math.cos((phi + 2 * Math.PI) / 3) - b / 3;
      const root3 = t * Math.cos((phi + 4 * Math.PI) / 3) - b / 3;

      roots.push(root1, root2, root3);
  }

  return roots;
}

// Critical Stress Calculator
function criticalStressCalculator(Fy, Fe) {
  let Fcr = 0;
  let html = '';

  const calcTerm1 = Fy / Fe;
  const calcTerm1_ = `${Fy_} / ${Fe_}`;

  html += `<div>Critical stress</div>`;
  if (calcTerm1 <= 2.25) {
    Fcr = 0.658**calcTerm1 * Fy;
    html += `<div class="indented-line">For ${calcTerm1_} &le; 2.25</div>
             <div class="indented-line">${Fcr_} = 0.658<sup>${calcTerm1_}</sup> ${Fy_} = ${Fcr.toFixed(2)} ksi</div>`;

  } else {
    Fcr = 0.877 * Fe;
    html += `<div class="indented-line">For ${calcTerm1_} &gt; 2.25</div>
             <div class="indented-line">${Fcr_} = 0.877 ${Fe_} = ${Fcr.toFixed(2)} ksi</div>`;
  }

  return [Fcr, html];
}

// E5 Single-Angle Compression Members


// E6 Built-Up Members


// E7 Members with Slender Elements
function E7MemberWithSlenderElementAe(shapeType, Fy, E, Ag, b, h, tf, tw, Fcr, lambdaf, lambdaw, lambdarf, lambdarw, flangeClass, webClass) {
  let Ae = 0;
  let html = '';

  if (Fcr === 0) {
    return [Ae, html];
  }

  if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST', 'HSS Rect.', 'HSS Square'].includes(shapeType)) {
    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
      h = lambdaw * tw;
    }
    const [be, beHtml] = effectiveWidthCalculator(shapeType, 'flange', Fy, b, Fcr, lambdaf, lambdarf, flangeClass);
    const [he, heHtml] = effectiveWidthCalculator(shapeType, 'web', Fy, h, Fcr, lambdaw, lambdarw, webClass);
    html += beHtml + heHtml;

    let AeHtml = '';
    [Ae, AeHtml] = effectiveAreaCalculator(shapeType, Ag, b, h, tf, tw, be, he);
    html += AeHtml;

  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    const calcTerm1 = E / Fy;
    const calcTerm1_ = `${E_} / ${Fy_}`;

    if (lambdaf <= 0.11 * calcTerm1) {
      Ae = Ag;
      html += `<div>For ${lambda_} &le; 0.11 ${calcTerm1_}</div>
               <div class="indented-line">${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;
    } else if (lambdaf <= 0.45 * calcTerm1) {
      Ae = (0.038 * E / (Fy * lambdaf) + 2 / 3) * Ag;
      html += `<div>For 0.11 ${calcTerm1_} &lt; ${lambda_} &le; 0.45 ${calcTerm1_}</div>
               <div class="indented-line">${Ae_} = (0.038 ${E_} / (${Fy_} ${lambda_}) + 2 / 3) ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;
    }
  }
  return [Ae, html];
}

// Effective Width, be, Calculator
function effectiveWidthCalculator(shapeType, elementType, Fy, b, Fcr, lambda, lambdar, elementClass) {
  let be = 0;
  let html = '';

  let lambda_ = '';
  let lambdar_ = '';
  let beff_ = '';
  let bfull_ = '';
  if (elementType === 'flange') {
    lambda_ = lambdaf_;
    lambdar_ = lambdarf_;
    beff_ = be_;
    if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      bfull_ = b_;
    } else {
      bfull_ = bf_;
    }

  } else if (elementType === 'web') {
    lambda_ = lambdaw_;
    lambdar_ = lambdarw_;
    beff_ = he_;
    bfull_ = h_;

  } else if (elementType === 'stem') {
    lambda_ = lambdaw_;
    lambdar_ = lambdarw_;
    beff_ = de_;
    bfull_ = d_;
  }

  const calcTerm1 = lambdar * Math.sqrt(Fy / Fcr);
  const calcTerm1_ = `${lambdar_} &radic;(${Fy_} / ${Fcr_})`;

  if (elementClass === 'nonslender') {
    html += `<div>For nonslender ${elementType}s</div>
             <div class="indented-line">Effective width, ${beff_} = ${bfull_}</div>`;

  } else {
    if (lambda <= calcTerm1) {
      html += `<div>For slender ${elementType}s and ${lambda_} &le; ${calcTerm1_}</div>
               <div class="indented-line">Effective width, ${beff_} = ${bfull_}</div>`;

    } else {
      html += `<div>For slender ${elementType}s and ${lambda_} &gt; ${calcTerm1_}</div>`
      
      if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
        html += `<div class="indented-line">${bfull_} = ${lambda_} ${tw_} = ${b.toFixed(2)} in.</div>`;
      } else {
        html += `<div class="indented-line">${bfull_} = ${b.toFixed(2)} in.</div>`;
      }

      const [c1, c2] = effectiveWidthImperfectionAdjustmentFactorFinder(shapeType, elementType);
      html += `<div class="indented-line">Effective width imperfection adjustment factors</div>
               <div class="indented-line" style="--indented-line-level: 2;">${c1_} = ${c1.toFixed(2)}&emsp;
                                                                            ${c2_} = ${c2.toFixed(2)}</div>`;

      const Fel = (c2 * lambdar / lambda)**2 * Fy;
      html += `<div class="indented-line">Elastic local buckling stress</div>
               <div class="indented-line" style="--indented-line-level: 2;">${Fel_} = (${c2_} ${lambdar_} / ${lambda_})<sup>2</sup> ${Fy_} = ${Fel.toFixed(2)} ksi</div>`;
      
      const calcTerm2 = Math.sqrt(Fel / Fcr);
      const calcTerm2_ = `&radic;(${Fel_} / ${Fcr_})`;
      be = b * (1 - c1 * calcTerm2) * calcTerm2;
      html += `<div class="indented-line">Effective width</div>
               <div class="indented-line" style="--indented-line-level: 2;">${beff_} = ${bfull_} (1 - ${c1_} ${calcTerm2_}) ${calcTerm2_} = ${be.toFixed(2)} in.</div>`;
    }
  }
  return [be, html];
}

// Effective Width Imperfection Adjustment Factors Finder
function effectiveWidthImperfectionAdjustmentFactorFinder(shapeType, elementType) {
  let c1 = 0;
  let c2 = 0;

  if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType) && elementType === 'web') {
    c1 = 0.18;
    c2 = 1.31;
  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    c1 = 0.20;
    c2 = 1.38;
  } else {
    c1 = 0.22;
    c2 = 1.49;
  }

  return [c1, c2];
}

// Effective Area, Ae, Calculator
function effectiveAreaCalculator(shapeType, Ag, b, h, tf, tw, be, he) {
  let Ae = 0;
  let html = '';

  let bflange_ = '';
  let hweb_ = '';
  let tflange_ = '';
  let tweb_ = '';
  if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
    bflange_ = bf_;
    hweb_ = h_;
    tflange_ = tf_;
    tweb_ = tw_;

  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    bflange_ = bf_;
    hweb_ = d_;
    tflange_ = tf_;
    tweb_ = tw_;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    bflange_ = b_;
    hweb_ = h_;
    tflange_ = tdes_;
    tweb_ = tdes_;
  }

  let calcTerm1 = 0;
  let calcTerm1_ = '';
  if (['W', 'M', 'S', 'HP', 'C', 'MC','HSS Rect.', 'HSS Square'].includes(shapeType)) {
    calcTerm1 = 2 * (b - be) * tf;
    calcTerm1_ = `2 (${bflange_} - ${be_}) ${tflange_}`;
  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    calcTerm1 = (b - be) * tf;
    calcTerm1_ = `(${bflange_} - ${be_}) ${tflange_}`;
  }

  let calcTerm2 = 0;
  let calcTerm2_ = '';
  if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    calcTerm2 = 2 * (h - he) * tw;
    calcTerm2_ = `2 (${hweb_} - ${he_}) ${tweb_}`;
  } else if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
    calcTerm2 = (h - he) * tw;
    calcTerm2_ = `(${hweb_} - ${he_}) ${tweb_}`;
  }

  html += `<div>Effective area</div>`;
  if (be === 0 && he === 0) {
    Ae = Ag;
    html += `<div class="indented-line">${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;

  } else if (be > 0 && he === 0) {
    Ae = Ag - calcTerm1;
    html += `<div class="indented-line">${Ae_} = ${Ag_} - ${calcTerm1_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;

  } else if (be === 0 && he > 0) {
    Ae = Ag - calcTerm2;
    html += `<div class="indented-line">${Ae_} = ${Ag_} - ${calcTerm2_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;

  } else if (be > 0 && he > 0) {
    Ae = Ag - calcTerm1 - calcTerm2;
    html += `<div class="indented-line">${Ae_} = ${Ag_} - ${calcTerm1_} - ${calcTerm2_} = ${Ae.toFixed(2)} in.<sup>2</sup></div>`;
  }
  return [Ae, html];
}

// Nominal Compressive Strength, Pn, Calculator
function capacityCalculator(Fcr, A, areaType) {
  let Pn = 0;
  let html = '';
  
  if (Fcr === 0) {
    return [Pn, html];
  }

  Pn = Fcr * A;
  
  let A_ = '';
  if (areaType === 'gross') {
    A_ = Ag_;
  } else if (areaType === 'effective') {
    A_ = Ae_;
  }
  html = `<div>${Pn_} = ${Fcr_} ${A_} = ${Pn.toFixed(2)} k</div>
          <div>${Pn_} = ${Pn.toFixed(1)} k</div>`;

  return [Pn, html];
}


// html notation
const Fe_ = 'F<sub>e</sub>';
const Fex_ = 'F<sub>ex</sub>';
const Fey_ = 'F<sub>ey</sub>';
const Fez_ = 'F<sub>ez</sub>';
const Fcr_ = 'F<sub>cr</sub>';

const be_ = 'b<sub>e</sub>';
const he_ = 'h<sub>e</sub>';
const de_ = 'd<sub>e</sub>';

const c1_ = 'c<sub>1</sub>';
const c2_ = 'c<sub>2</sub>';

const Fel_ = 'F<sub>el</sub>';

const Ag_ = 'A<sub>g</sub>';
const Ae_ = 'A<sub>e</sub>';

const ex_ = 'e<sub>x</sub>';
const ey_ = 'e<sub>y</sub>';

const xo_ = 'x<sub>o</sub>';
const yo_ = 'y<sub>o</sub>';