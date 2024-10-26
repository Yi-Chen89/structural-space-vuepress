// A360 Chapter G

export function majorShearCalculator(shapeData, shapeType, astmSpecProp, slenderClass, Lv) {
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
      'Vn_3': {'isApplicable': false, 'value': 0, 'html': null},
      'Vn_4': {'isApplicable': false, 'value': 0, 'html': null},
      'Vn_5': {'isApplicable': false, 'value': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {

    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      // G3

      const { d, tw } = shapeData;

      result['Vn_3']['isApplicable'] = true;
      const [Vn_3, html_3] = G3Tee(Fy, E, d, tw, lambdaw);
      result['Vn_3']['value'] = Vn_3;
      result['Vn_3']['html'] = html_3;

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // G4

      const { h, tdes } = shapeData;

      result['Vn_4']['isApplicable'] = true;
      const [Vn_4, html_4] = G4RectangularHollowSection(Fy, E, h, tdes, lambdaw);
      result['Vn_4']['value'] = Vn_4;
      result['Vn_4']['html'] = html_4;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // G5

      const { A, OD } = shapeData;

      result['Vn_5']['isApplicable'] = true;
      const [Vn_5, html_5] = G5CircularHollowSection(Fy, E, A, OD, lambdaf, Lv);
      result['Vn_5']['value'] = Vn_5;
      result['Vn_5']['html'] = html_5;

    }

    return result;

  } else {
    return null;
  }
}


// Helper Function

// G2 I-Shaped Members and Channels


// G3 Single Angles and Tees
function G3Tee(Fy, E, b, t, lambdaw) {
  let Vn = 0;
  let html = '';

  const kv = 1.2;
  const [Cv2, Cv2Html] = webShearBucklingStrengthCoefficientCalculator(Fy, E, kv, lambdaw);
  html += `<p>Web shear buckling strength coefficient</p>
           <p>${kv_} = 1.2</p>`;
  html += Cv2Html;

  Vn = 0.6 * Fy * b * t * Cv2;
  html += `<p>${Vn_} = 0.6 ${Fy_} ${d_} ${tw_} ${Cv2_} = ${Vn.toFixed(2)} k</p>
           <p>${Vn_} = ${Vn.toFixed(1)} k</p>`;

  return [Vn, html];
}

// G4 Rectangular HSS, Box Sections, and Other Singly and Doubly Symmetric Members
function G4RectangularHollowSection(Fy, E, h, t, lambdaw) {
  let Vn = 0;
  let html = '';

  const Aw = 2 * h * t;
  html += `<p>Area of web</p>
           <p>${h_} = ${h.toFixed(2)} in.</p>
           <p>${Aw_} = 2 ${h_} ${tdes_} = ${Aw.toFixed(2)} in.<sup>2</sup></p>`;

  const kv = 5;
  const [Cv2, Cv2Html] = webShearBucklingStrengthCoefficientCalculator(Fy, E, kv, lambdaw);
  html += `<p>Web shear buckling strength coefficient</p>
           <p>${kv_} = 5</p>`;
  html += Cv2Html;

  Vn = 0.6 * Fy * Aw * Cv2;
  html += `<p>${Vn_} = 0.6 ${Fy_} ${Aw_} ${Cv2_} = ${Vn.toFixed(2)} k</p>
           <p>${Vn_} = ${Vn.toFixed(1)} k</p>`;

  return [Vn, html];
}

// Web Shear Buckling Strength Coefficient, Cv2, Calculator
function webShearBucklingStrengthCoefficientCalculator(Fy, E, kv, lambdaw) {
  let Cv2 = 0;
  let html = '';

  const calcTerm1 = Math.sqrt(kv * E / Fy);
  const calcTerm1_ = `&radic;(${kv_} ${E_} / ${Fy_})`;

  if (lambdaw <= 1.10 * calcTerm1) {
    Cv2 = 1.0;
    html += `<p>For ${lambdaw_} &le; 1.10 ${calcTerm1_}</p>
             <p>${Cv2_} = 1.0</p>
             <p>Shear yielding governs</p>`;

  } else if (lambdaw <= 1.37 * calcTerm1) {
    Cv2 = 1.10 * calcTerm1 / lambdaw;
    html += `<p>For 1.10 ${calcTerm1_} &lt; ${lambdaw_} &le; 1.37 ${calcTerm1_}</p>
             <p>${Cv2_} = 1.10 ${calcTerm1_} / ${lambdaw_} = ${Cv2.toFixed(2)}</p>
             <p>Shear buckling governs</p>`;

  } else {
    Cv2 = 1.51 * kv * E / (lambdaw**2 * Fy);
    html += `<p>For ${lambdaw_} &gt; 1.37 ${calcTerm1_}</p>
             <p>${Cv2_} = 1.51 ${kv_} ${E_} / (${lambdaw_}<sup>2</sup> ${Fy_}) = ${Cv2.toFixed(2)}</p>
             <p>Shear buckling governs</p>`;
  }

  return [Cv2, html];
}

// G5 Round HSS
function G5CircularHollowSection(Fy, E, Ag, D, lambda, Lv) {
  let Vn = 0;
  let html = '';

  let Fcr1 = 0;
  let Fcr2 = 0;
  html += `<p>Critical stress</p>`;
  if (Lv > 0) {
    Fcr1 = 1.60 * E / (Math.sqrt(Lv / D) * lambda**(5 / 4));
    html += `<p>${Fcr_} = 1.60 ${E_} / (&radic;(${Lv_} / ${OD_}) ${lambda_}<sup>5 / 4</sup>) = ${Fcr1.toFixed(2)} ksi</p>`;
  }
  Fcr2 = 0.78 * E / lambda**(3 / 2);
  html += `<p>${Fcr_} = 0.78 ${E_} / ${lambda_}<sup>3 / 2</sup> = ${Fcr2.toFixed(2)} ksi</p>`;

  let Fcr = Math.max(Fcr1, Fcr2);
  html += `<p>${Fcr_} = ${Fcr.toFixed(2)} ksi &le; 0.6 ${Fy_}</p>`;

  if (Fcr <= 0.6 * Fy) {
    html += `<p>Shear buckling governs</p>`;
  } else {
    Fcr = 0.6 * Fy;
    html += `<p>Shear yielding governs</p>
             <p>${Fcr_} = 0.6 ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;
  }

  Vn = Fcr * Ag / 2;
  html += `<p>${Vn_} = ${Fcr_} ${Ag_} / 2 = ${Vn.toFixed(2)} k</p>
           <p>${Vn_} = ${Vn.toFixed(1)} k</p>`;

  return [Vn, html];
}

// G6 Weak-Axis Shear in Doubly Symmetric and Singly Symmetric Shapes


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


const Lv_ = 'L<sub>v</sub>';


const Fcr_ = 'F<sub>cr</sub>';

const Aw_ = 'A<sub>w</sub>';
const kv_ = 'k<sub>v</sub>';
const Cv2_ = 'C<sub>v2</sub>';

const Ag_ = 'A<sub>g</sub>';

const Vn_ = 'V<sub>n</sub>';

const lambda_ = '&lambda;';
const lambdaf_ = '&lambda;<sub>f</sub>';
const lambdaw_ = '&lambda;<sub>w</sub>';