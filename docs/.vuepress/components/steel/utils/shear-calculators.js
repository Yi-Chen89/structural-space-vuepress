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

// A360 Chapter G

export function majorShearCalculator(shapeData, shapeType, astmSpecProp, slenderClass, considerTFA, considerStiffener, stiffenerDistance, Lv) {
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
      'Vn_2_1': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_2_2': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_3': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_4': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_5': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
      // G2

      const { d, bf, tw, tf } = shapeData;

      result['Vn_2_1']['isApplicable'] = true;
      const [phi_2_1, Vn_2_1, html_2_1] = G2_1IShapedAndChannelWithoutTFA(shapeType, Fy, E, d, tw, lambdaw, considerStiffener, stiffenerDistance);
      result['Vn_2_1']['phiValue'] = phi_2_1;
      result['Vn_2_1']['nominalValue'] = Vn_2_1;
      result['Vn_2_1']['designValue'] = phi_2_1 * Vn_2_1;
      result['Vn_2_1']['html'] = html_2_1;

      if (considerTFA) {
        result['Vn_2_2']['isApplicable'] = true;
        const [phi_2_2, Vn_2_2, html_2_2] = G2_2IShapedAndChannelWithTFA(Fy, E, d, bf, tw, tf, lambdaw, considerStiffener, stiffenerDistance);
        result['Vn_2_2']['phiValue'] = phi_2_2;
        result['Vn_2_2']['nominalValue'] = Vn_2_2;
        result['Vn_2_2']['designValue'] = phi_2_2 * Vn_2_2;
        result['Vn_2_2']['html'] = html_2_2;
      }

    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      // G3

      const { d, tw } = shapeData;

      result['Vn_3']['isApplicable'] = true;
      const [phi_3, Vn_3, html_3] = G3Tee(Fy, E, d, tw, lambdaw);
      result['Vn_3']['phiValue'] = phi_3;
      result['Vn_3']['nominalValue'] = Vn_3;
      result['Vn_3']['designValue'] = phi_3 * Vn_3;
      result['Vn_3']['html'] = html_3;

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // G4

      const { h, tdes } = shapeData;

      result['Vn_4']['isApplicable'] = true;
      const [phi_4, Vn_4, html_4] = G4RectangularHollowSection('x', Fy, E, h, tdes, lambdaw);
      result['Vn_4']['phiValue'] = phi_4;
      result['Vn_4']['nominalValue'] = Vn_4;
      result['Vn_4']['designValue'] = phi_4 * Vn_4;
      result['Vn_4']['html'] = html_4;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // G5

      const { A, OD } = shapeData;

      result['Vn_5']['isApplicable'] = true;
      const [phi_5, Vn_5, html_5] = G5CircularHollowSection(Fy, E, A, OD, lambdaf, Lv);
      result['Vn_5']['phiValue'] = phi_5;
      result['Vn_5']['nominalValue'] = Vn_5;
      result['Vn_5']['designValue'] = phi_5 * Vn_5;
      result['Vn_5']['html'] = html_5;
    }

    result = resultRenderDataConstructor(result, 'shear');
    return result;

  } else {
    return null;
  }
}

export function minorShearCalculator(shapeData, shapeType, astmSpecProp, slenderClass, Lv){
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
      'Vn_4': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_5': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Vn_6': {'isApplicable': false, 'phiValue': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
      // G6

      const { bf, tf } = shapeData;

      result['Vn_6']['isApplicable'] = true;
      const [phi_6, Vn_6, html_6] = G6DoublyAndSinglySymmetricShape(shapeType, Fy, E, bf, tf, lambdaf);
      result['Vn_6']['phiValue'] = phi_6;
      result['Vn_6']['nominalValue'] = Vn_6;
      result['Vn_6']['designValue'] = phi_6 * Vn_6;
      result['Vn_6']['html'] = html_6;

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // G4

      const { b, tdes } = shapeData;

      result['Vn_4']['isApplicable'] = true;
      const [phi_4, Vn_4, html_4] = G4RectangularHollowSection('y', Fy, E, b, tdes, lambdaf);
      result['Vn_4']['phiValue'] = phi_4;
      result['Vn_4']['nominalValue'] = Vn_4;
      result['Vn_4']['designValue'] = phi_4 * Vn_4;
      result['Vn_4']['html'] = html_4;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // G5

      const { A, OD } = shapeData;

      result['Vn_5']['isApplicable'] = true;
      const [phi_5, Vn_5, html_5] = G5CircularHollowSection(Fy, E, A, OD, lambdaf, Lv);
      result['Vn_5']['phiValue'] = phi_5;
      result['Vn_5']['nominalValue'] = Vn_5;
      result['Vn_5']['designValue'] = phi_5 * Vn_5;
      result['Vn_5']['html'] = html_5;
    }

    result = resultRenderDataConstructor(result, 'shear');
    return result;

  } else {
    return null;
  }
}

export function criticalShearResultProcessor(result) {
  if (result) {
    // filter out objects where isApplicable is false or designValue is 0
    // filteredResultAsList data structure
    // [
    //   [ "Vn_2_1", { "isApplicable": true, "phiValue": 0.9, ... } ],
    //   [ "Vn_2_2", { "isApplicable": true, "phiValue": 0.9, ... } ]
    // ]
    const filteredResultAsList = Object.entries(result)
      .filter(([, item]) => 
        item['isApplicable'] && item['designValue'] !== 0
      );

    // output data structure (deep copy)
    // [
    //   { "phiValue": 0.9, ..., "isMultiState": true }
    // ]
    const output = [];
    if (filteredResultAsList.length === 1) {
      // deep copy
      const object = JSON.parse(JSON.stringify(filteredResultAsList[0][1]));
      output.push(object);
      
    } else if (filteredResultAsList.length === 2) {
      const designValue_2_1 = filteredResultAsList[0][1]['designValue'];
      const designValue_2_2 = filteredResultAsList[1][1]['designValue'];

      if (designValue_2_1 >= designValue_2_2) {
        // deep copy
        const object = JSON.parse(JSON.stringify(filteredResultAsList[0][1]));
        output.push(object);
        
      } else {
        const panel = ['End Web Panel', 'Interior Web Panel'];

        filteredResultAsList.forEach((value, index) => {
          // deep copy
          const object = JSON.parse(JSON.stringify(value[1]));
          object['titlePrefix'] = panel[index];
          output.push(object);
        });
      }
    }

    // remove unnecessary key-value from object
    const keysToRemove = ['isApplicable', 'html', 'title'];
    output.forEach((object) => {
      keysToRemove.forEach((keyToRemove) => {
        delete object[keyToRemove];
      });
    });

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
}


// Helper Function

// G2 I-Shaped Members and Channels

// G2.1 I-Shaped Members and Channels without Tension Field Action
function G2_1IShapedAndChannelWithoutTFA(shapeType, Fy, E, d, tw, lambdaw, considerStiffener, a) {
  let phi = 0;
  let Vn = 0;
  let html = '';

  const Aw = d * tw;
  html += `<div>Area of web</div>
           <div class="indented-line">${Aw_} = ${d_} ${tw_} = ${Aw.toFixed(2)} in.<sup>2</sup></div>`;
  
  let Cv1 = 0;
  if (['W', 'M', 'S', 'HP'].includes(shapeType) && lambdaw <= 2.24 * Math.sqrt(E / Fy)) {
    phi = 1;
    Cv1 = 1;
    html += `<div>For I-shaped members with ${lambdaw_} &le; 2.24 &radic;(${E_} / ${Fy_})</div>
             <div class="indented-line">${phiv_} = ${phi.toFixed(2)}</div>
             <div class="indented-line">${Cv1_} = ${Cv1.toFixed(1)}</div>
             <div class="indented-line">Shear yielding governs</div>`;
  
  } else if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
    phi = 0.9;

    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      html += `<div>For I-shaped members with ${lambdaw_} &gt; 2.24 &radic;(${E_} / ${Fy_})</div>`;
    } else if (['C', 'MC'].includes(shapeType)) {
      html += `<div>For channels</div>`;
    }

    let kv = 0;
    if (considerStiffener && a > 0) {
      const h = lambdaw * tw;
      html += `<div class="indented-line">Web plate shear buckling coefficient for webs with transverse stiffeners</div>
               <div class="indented-line" style="--indented-line-level: 2;">${h_} = ${lambdaw_} ${tw_} = ${h.toFixed(2)} in.</div>`;

      if (a / h <= 3.0) {
        kv = 5 + 5 / (a / h)**2;
        html += `<div class="indented-line" style="--indented-line-level: 2;">For ${a_} / ${h_} &le; 3.0</div>
                 <div class="indented-line" style="--indented-line-level: 2;">${kv_} = 5 + 5 / (${a_} / ${h_})<sup>2</sup> = ${kv.toFixed(2)}</div>`;
      } else {
        kv = 5.34;
        html += `<div class="indented-line" style="--indented-line-level: 2;">For ${a_} / ${h_} &gt; 3.0</div>
                 <div class="indented-line" style="--indented-line-level: 2;">${kv_} = 5.34</div>`;
      }

    } else {
      kv = 5.34;
      html += `<div class="indented-line">Web plate shear buckling coefficient for webs without transverse stiffeners</div>
               <div class="indented-line" style="--indented-line-level: 2;">${kv_} = ${kv.toFixed(2)}</div>`;
    }
    
    const calcTerm1 = 1.10 * Math.sqrt(kv * E / Fy);
    const calcTerm1_ = `1.10 &radic;(${kv_} ${E_} / ${Fy_})`;
    html += `<div class="indented-line">Web shear strength coefficient</div>`;
    if (lambdaw <= calcTerm1) {
      Cv1 = 1.0;
      html += `<div class="indented-line" style="--indented-line-level: 2;">For ${lambdaw_} &le; ${calcTerm1_}</div>
               <div class="indented-line" style="--indented-line-level: 2;">${Cv1_} = 1.0</div>
               <div class="indented-line" style="--indented-line-level: 2;">Shear yielding governs</div>`;

    } else {
      Cv1 = calcTerm1 / lambdaw;
      html += `<div class="indented-line" style="--indented-line-level: 2;">For ${lambdaw_} &gt; ${calcTerm1_}</div>
               <div class="indented-line" style="--indented-line-level: 2;">${Cv1_} = ${calcTerm1_} / ${lambdaw_} = ${Cv1.toFixed(2)}</div>
               <div class="indented-line" style="--indented-line-level: 2;">Shear buckling governs</div>`;
    }
  }

  Vn = 0.6 * Fy * Aw * Cv1;
  html += `<div>${Vn_} = 0.6 ${Fy_} ${Aw_} ${Cv1_} = ${Vn.toFixed(2)} k</div>
           <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;
  
  return [phi, Vn, html];
}

// G2.1 I-Shaped Members and Channels Interior Web Panels with Tension Field Action
function G2_2IShapedAndChannelWithTFA(Fy, E, d, bf, tw, tf, lambdaw, considerStiffener, a) {
  let phi = 0;
  let Vn = 0;
  let html = '';

  if (considerStiffener && a > 0) {
    phi = 0.9;

    const h = lambdaw * tw;
    html += `<div>${h_} = ${lambdaw_} ${tw_} = ${h.toFixed(2)} in.</div>`;
    
    const calcTerm1 = a / h;
    const calcTerm1_ = `${a_} / ${h_}`;

    if (calcTerm1 > 3.0) {
      html += `<div>Tension Field Action is not considered for ${calcTerm1_} &gt; 3</div>`;

    } else {
      const Aw = d * tw;
      html += `<div>Area of web</div>
               <div class="indented-line">${Aw_} = ${d_} ${tw_} = ${Aw.toFixed(2)} in.<sup>2</sup></div>`;

      const kv = 5 + 5 / calcTerm1**2;
      html += `<div>Web plate shear buckling coefficient</div>
               <div class="indented-line">${kv_} = 5 + 5 / (${calcTerm1_})<sup>2</sup> = ${kv.toFixed(2)}</div>`;

      const calcTerm2 = 1.10 * Math.sqrt(kv * E / Fy);
      const calcTerm2_ = `1.10 &radic;(${kv_} ${E_} / ${Fy_})`;

      if (lambdaw <= calcTerm2) {
        Vn = 0.6 * Fy * Aw;
        html += `<div>For ${lambdaw_} &le; ${calcTerm2_}</div>
                 <div>Shear yielding governs</div>
                 <div>${Vn_} = 0.6 ${Fy_} ${Aw_} = ${Vn.toFixed(2)} k</div>
                 <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

      } else {
        const [Cv2, Cv2Html] = webShearBucklingCoefficientCalculator('x', Fy, E, kv, lambdaw);
        html += Cv2Html;

        const Afc = bf * tf;
        const Aft = bf * tf;
        html += `<div>Area of compression and tension flange</div>
                 <div class="indented-line">${Afc_} = ${Aft_} = ${bf_} ${tf_} = ${Afc.toFixed(2)} in.<sup>2</sup></div>`;

        const bfc = bf;
        const bft = bf;
        html += `<div>Width of compression and tension flange</div>
                 <div class="indented-line">${bfc_} = ${bft_} = ${bf_} = ${bfc.toFixed(2)} in.</div>`;
        
        html += `<div>For ${lambdaw_} &gt; ${calcTerm2_}`;
        if (2 * Aw / (Afc + Aft) <= 2.5 && h / bfc <= 6.0 && h / bft <= 6.0) {
          Vn = 0.6 * Fy * Aw * (Cv2 + (1 - Cv2) / (1.15 * Math.sqrt(1 + calcTerm1**2)));
          html += `, 2 ${Aw_} / (${Afc_} + ${Aft_}) &le; 2.5, ${h_} / ${bfc_} &le; 6.0, and ${h_} / ${bft_} &le; 6.0</div>
                   <div>${Vn_} = 0.6 ${Fy_} ${Aw_} (${Cv2_} + (1 - ${Cv2_}) / (1.15 &radic;(1 + (${calcTerm1_})<sup>2</sup>))) = ${Vn.toFixed(2)} k</div>
                   <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

        } else {
          if (2 * Aw / (Afc + Aft) > 2.5) {
            if (h / bfc > 6.0) {
              html += `, 2 ${Aw_} / (${Afc_} + ${Aft_}) &gt; 2.5, ${h_} / ${bfc_} &gt; 6.0, and ${h_} / ${bft_} &gt; 6.0</div>`;
            } else {
              html += ` and 2 ${Aw_} / (${Afc_} + ${Aft_}) &gt; 2.5</div>`;
            }
          } else {
            if (h / bfc > 6.0) {
              html += `, ${h_} / ${bfc_} &gt; 6.0, and ${h_} / ${bft_} &gt; 6.0</div>`;
            }
          }

          Vn = 0.6 * Fy * Aw * (Cv2 + (1 - Cv2) / (1.15 * (calcTerm1 + Math.sqrt(1 + calcTerm1**2))));
          html += `<div>${Vn_} = 0.6 ${Fy_} ${Aw_} (${Cv2_} + (1 - ${Cv2_}) / (1.15 (${calcTerm1_} + &radic;(1 + (${calcTerm1_})<sup>2</sup>)))) = ${Vn.toFixed(2)} k</div>
                   <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;
        }
      }
    }

  } else {
    html += `<div>To consider Tension Field Action, ${a_} must not be 0</div>`;
  }

  return [phi, Vn, html];
}

// G3 Single Angles and Tees
function G3Tee(Fy, E, b, t, lambdaw) {
  let phi = 0.9;
  let Vn = 0;
  let html = '';

  const kv = 1.2;
  const [Cv2, Cv2Html] = webShearBucklingCoefficientCalculator('x', Fy, E, kv, lambdaw);
  html += `<div>Web plate shear buckling coefficient</div>
           <div class="indented-line">${kv_} = ${kv.toFixed(1)}</div>`;
  html += Cv2Html;

  Vn = 0.6 * Fy * b * t * Cv2;
  html += `<div>${Vn_} = 0.6 ${Fy_} ${d_} ${tw_} ${Cv2_} = ${Vn.toFixed(2)} k</div>
           <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

  return [phi, Vn, html];
}

// G4 Rectangular HSS, Box Sections, and Other Singly and Doubly Symmetric Members
function G4RectangularHollowSection(axis, Fy, E, h, t, lambda) {
  let phi = 0.9;
  let Vn = 0;
  let html = '';

  let hshear_ = axis === 'x' ? h_ : b_;
  let Ashear_ = axis === 'x' ? Aw_ : Af_;

  html += `<div>Area of ${axis === 'x' ? 'web' : 'flange'}</div>`;

  const Aw = 2 * h * t;
  html += `<div class="indented-line">${hshear_} = ${h.toFixed(2)} in.</div>
           <div class="indented-line">${Ashear_} = 2 ${hshear_} ${tdes_} = ${Aw.toFixed(2)} in.<sup>2</sup></div>`;

  const kv = 5;
  const [Cv2, Cv2Html] = webShearBucklingCoefficientCalculator(axis, Fy, E, kv, lambda);
  html += `<div>Web plate shear buckling coefficient</div>
           <div class="indented-line">${kv_} = ${kv.toFixed(0)}</div>`;
  html += Cv2Html;

  Vn = 0.6 * Fy * Aw * Cv2;
  html += `<div>${Vn_} = 0.6 ${Fy_} ${Ashear_} ${Cv2_} = ${Vn.toFixed(2)} k</div>
           <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

  return [phi, Vn, html];
}

// G5 Round HSS
function G5CircularHollowSection(Fy, E, Ag, D, lambda, Lv) {
  let phi = 0.9;
  let Vn = 0;
  let html = '';

  let Fcr1 = 0;
  let Fcr2 = 0;
  html += `<div>Critical stress</div>`;
  if (Lv > 0) {
    Fcr1 = 1.60 * E / (Math.sqrt(Lv / D) * lambda**(5 / 4));
    html += `<div class="indented-line">${Fcr_} = 1.60 ${E_} / (&radic;(${Lv_} / ${OD_}) ${lambda_}<sup>5 / 4</sup>) = ${Fcr1.toFixed(2)} ksi</div>`;
  }
  Fcr2 = 0.78 * E / lambda**(3 / 2);
  html += `<div class="indented-line">${Fcr_} = 0.78 ${E_} / ${lambda_}<sup>3 / 2</sup> = ${Fcr2.toFixed(2)} ksi</div>`;

  let Fcr = Math.max(Fcr1, Fcr2);
  html += `<div class="indented-line">${Fcr_} = ${Fcr.toFixed(2)} ksi &le; 0.6 ${Fy_}</div>`;

  if (Fcr <= 0.6 * Fy) {
    html += `<div class="indented-line">Shear buckling governs</div>`;
  } else {
    Fcr = 0.6 * Fy;
    html += `<div class="indented-line">Shear yielding governs</div>
             <div class="indented-line">${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</div>`;
  }

  Vn = Fcr * Ag / 2;
  html += `<div>${Vn_} = ${Fcr_} ${Ag_} / 2 = ${Vn.toFixed(2)} k</div>
           <div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

  return [phi, Vn, html];
}

// G6 Weak-Axis Shear in Doubly Symmetric and Singly Symmetric Shapes
function G6DoublyAndSinglySymmetricShape(shapeType, Fy, E, bf, tf, lambdaf) {
  let phi = 0.9;
  let Vn = 0;
  let html = '';

  const kv = 1.2;
  const [Cv2, Cv2Html] = webShearBucklingCoefficientCalculator('y', Fy, E, kv, lambdaf);
  html += `<div>Web plate shear buckling coefficient</div>
           <div class="indented-line">${kv_} = ${kv.toFixed(1)}</div>`;
  html += Cv2Html;

  Vn = 0.6 * Fy * bf * tf * Cv2;
  html += `<div>For each shear resisting element</div>
           <div class="indented-line">${Vn_} = 0.6 ${Fy_} ${bf_} ${tf_} ${Cv2_} = ${Vn.toFixed(2)} k</div>`;
  
  if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
    Vn *= 2;
    html += `<div>${Vn_} = 2 ${Vn_} = ${Vn.toFixed(2)} k</div>`;
  }
  html += `<div>${Vn_} = ${Vn.toFixed(1)} k</div>`;

  return [phi, Vn, html];
}

// Web Shear Buckling Coefficient, Cv2, Calculator
function webShearBucklingCoefficientCalculator(axis, Fy, E, kv, lambda) {
  let Cv2 = 0;
  let html = '<div>Web shear buckling coefficient</div>';

  let lambdawf_ = axis === 'x' ? lambdaw_ : lambdaf_;

  const calcTerm1 = Math.sqrt(kv * E / Fy);
  const calcTerm1_ = `&radic;(${kv_} ${E_} / ${Fy_})`;

  if (lambda <= 1.10 * calcTerm1) {
    Cv2 = 1.0;
    html += `<div class="indented-line">For ${lambdawf_} &le; 1.10 ${calcTerm1_}</div>
             <div class="indented-line">${Cv2_} = ${Cv2.toFixed(1)}</div>
             <div class="indented-line">Shear yielding governs</div>`;

  } else if (lambda <= 1.37 * calcTerm1) {
    Cv2 = 1.10 * calcTerm1 / lambda;
    html += `<div class="indented-line">For 1.10 ${calcTerm1_} &lt; ${lambdawf_} &le; 1.37 ${calcTerm1_}</div>
             <div class="indented-line">${Cv2_} = 1.10 ${calcTerm1_} / ${lambdawf_} = ${Cv2.toFixed(2)}</div>
             <div class="indented-line">Shear buckling governs</div>`;

  } else {
    Cv2 = 1.51 * kv * E / (lambda**2 * Fy);
    html += `<div class="indented-line">For ${lambdawf_} &gt; 1.37 ${calcTerm1_}</div>
             <div class="indented-line">${Cv2_} = 1.51 ${kv_} ${E_} / (${lambdawf_}<sup>2</sup> ${Fy_}) = ${Cv2.toFixed(2)}</div>
             <div class="indented-line">Shear buckling governs</div>`;
  }

  return [Cv2, html];
}


// html notation
const Fcr_ = 'F<sub>cr</sub>';

const Aw_ = 'A<sub>w</sub>';
const Af_ = 'A<sub>f</sub>';
const kv_ = 'k<sub>v</sub>';
const Cv1_ = 'C<sub>v1</sub>';
const Cv2_ = 'C<sub>v2</sub>';
const a_ = 'a';

const Ag_ = 'A<sub>g</sub>';
const Afc_ = 'A<sub>fc</sub>';
const Aft_ = 'A<sub>ft</sub>';

const bfc_ = 'b<sub>fc</sub>';
const bft_ = 'b<sub>ft</sub>';

const phiv_ = '&phi;<sub>v</sub>';