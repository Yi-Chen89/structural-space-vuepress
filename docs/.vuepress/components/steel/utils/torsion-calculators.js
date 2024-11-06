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
      'Tn_H3_1_a': {'isApplicable': false, 'phi': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
      'Tn_H3_1_b': {'isApplicable': false, 'phi': 0, 'nominalValue': 0, 'designValue': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {



    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // H3.1(b)

      const { C } = shapeData;

      result['Tn_H3_1_b']['isApplicable'] = true;
      const [phi_H3_1_b, Tn_H3_1_b, html_H3_1_b] = H3_1bRectangularHollowSection(Fy, E, C, lambdaw);
      result['Tn_H3_1_b']['phi'] = phi_H3_1_b;
      result['Tn_H3_1_b']['nominalValue'] = Tn_H3_1_b;
      result['Tn_H3_1_b']['designValue'] = phi_H3_1_b * Tn_H3_1_b;
      result['Tn_H3_1_b']['html'] = html_H3_1_b;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // H3.1(a)

      const { OD, C } = shapeData;
      
      result['Tn_H3_1_a']['isApplicable'] = true;
      const [phi_H3_1_a, Tn_H3_1_a, html_H3_1_a] = H3_1aCircularHollowSection(Fy, E, OD, C, lambdaf, L);
      result['Tn_H3_1_a']['phi'] = phi_H3_1_a;
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
    //   [ "Tn_H3_1_a", { "isApplicable": true, "phi": 0.9, ... } ],
    //   [ "Tn_H3_1_b", { "isApplicable": true, "phi": 0.9, ... } ]
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
      //   "Tn_H3_1_a": { "isApplicable": true, "phi": 0.9, ... }
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
  html += `<p>Critical stress</p>`;
  if (L > 0) {
    Fcr1 = 1.23 * E / (Math.sqrt(L / D) * lambda**(5 / 4));
    html += `<p>${Fcr_} = 1.23 ${E_} / (&radic;(${L_} / ${OD_}) ${lambda_}<sup>5 / 4</sup>) = ${Fcr1.toFixed(2)} ksi</p>`;
  }
  Fcr2 = 0.60 * E / lambda**(3 / 2);
  html += `<p>${Fcr_} = 0.60 ${E_} / ${lambda_}<sup>3 / 2</sup> = ${Fcr2.toFixed(2)} ksi</p>`;

  let Fcr = Math.max(Fcr1, Fcr2);
  html += `<p>${Fcr_} = ${Fcr.toFixed(2)} ksi &le; 0.6 ${Fy_}</p>`;

  if (Fcr <= 0.6 * Fy) {
    html += `<p>Torsional buckling governs</p>`;
  } else {
    Fcr = 0.6 * Fy;
    html += `<p>Torsional yielding governs</p>
             <p>${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;
  }

  Tn = Fcr * C;
  html += `<p>${Tn_} = ${Fcr_} ${C_} = ${Tn.toFixed(2)} k-in</p>
           <p>${Tn_} = ${Tn.toFixed(1)} k-in = ${(Tn / 12).toFixed(1)} k-ft</p>`;

  return [phi, Tn, html];
}

// H3.1(b) Rectangular HSS Subject to Torsion
function H3_1bRectangularHollowSection(Fy, E, C, lambdaw) {
  let phi = 0.9;
  let Tn = 0;
  let html = '';

  const calcTerm1 = Math.sqrt(E / Fy);
  const calcTerm1_ = `&radic;(${E_} / ${Fy_})`;

  let Fcr = 0;
  if (lambdaw <= 2.45 * calcTerm1) {
    Fcr = 0.6 * Fy;
    html += `<p>For ${lambdaw_} &le; 2.45 ${calcTerm1_}</p>
             <p>Torsional yielding governs</p>
             <p>${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;

  } else if (lambdaw <= 3.07 * calcTerm1) {
    Fcr = 0.6 * Fy * (2.45 * calcTerm1) / lambdaw;
    html += `<p>For 2.45 ${calcTerm1_} &lt; ${lambdaw_} &le; 3.07 ${calcTerm1_}</p>
             <p>Torsional buckling governs</p>
             <p>${Fcr_} = 0.6 ${Fy_} (2.45 ${calcTerm1_}) / ${lambdaw_} = ${Fcr.toFixed(2)} ksi</p>`;

  } else if (lambdaw <= 260) {
    Fcr = 0.458 * Math.PI**2 * E / lambdaw**2;
    html += `<p>For 3.07 ${calcTerm1_} &lt; ${lambdaw_} &le; 260</p>
             <p>Torsional buckling governs</p>
             <p>${Fcr_} = 0.458 &pi;<sup>2</sup> ${E_} / ${lambdaw_}<sup>2</sup> = ${Fcr.toFixed(2)} ksi</p>`;
  }

  Tn = Fcr * C;
  html += `<p>${Tn_} = ${Fcr_} ${C_} = ${Tn.toFixed(2)} k-in</p>
           <p>${Tn_} = ${Tn.toFixed(1)} k-in = ${(Tn / 12).toFixed(1)} k-ft</p>`;

  return [phi, Tn, html];
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


const L_ = 'L';


const Fcr_ = 'F<sub>cr</sub>';



const Tn_ = 'T<sub>n</sub>';

const lambda_ = '&lambda;';
const lambdaf_ = '&lambda;<sub>f</sub>';
const lambdarf_ = '&lambda;<sub>rf</sub>';
const lambdaw_ = '&lambda;<sub>w</sub>';
const lambdarw_ = '&lambda;<sub>rw</sub>';