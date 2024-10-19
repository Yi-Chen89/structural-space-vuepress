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
      'Pn_3': {'isApplicable': false, 'value': 0, 'html': null},
      'Fcr_3': {'isApplicable': false, 'value': 0, 'html': null},
      'Pn_4': {'isApplicable': false, 'value': 0, 'html': null},
      'Ae': {'isApplicable': false, 'value': 0, 'html': null},
      'Pn_3_7': {'isApplicable': false, 'value': 0, 'html': null},
    };

    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      const { A, Ix, rx, Iy, ry, J, Cw } = shapeData;

      // E3 Flexural Buckling
      const [Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      // E4 Torsional Buckling
      const [Fcr_4, FcrHtml_4] = E4TorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3 E4
        // limit state: FB TB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['value'] = Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;

        result['Pn_4']['isApplicable'] = true;
        const [Pn_4, PnHtml_4] = capacityCalculator(Fcr_4, A, 'gross');
        result['Pn_4']['value'] = Pn_4;
        result['Pn_4']['html'] = FcrHtml_4 + PnHtml_4;
      }

    } else if (['C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
      const { A, rx, ry, J, Cw, ro, H } = shapeData;

      // E3 Flexural Buckling
      const [Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      // E4 Flexural-Torsional Buckling
      const [Fcr_4, FcrHtml_4] = E4FlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, A, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3 E4
        // limit state: FB FTB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['value'] = Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;

        result['Pn_4']['isApplicable'] = true;
        const [Pn_4, PnHtml_4] = capacityCalculator(Fcr_4, A, 'gross');
        result['Pn_4']['value'] = Pn_4;
        result['Pn_4']['html'] = FcrHtml_4 + PnHtml_4;
      }

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      const { A, rx, ry } = shapeData;

      // E3 Flexural Buckling
      const [Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      if (flange === 'nonslender' && web === 'nonslender') {
        // E3
        // limit state: FB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['value'] = Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;
      }

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      const { A, rx, ry } = shapeData;

      // E3 Flexural Buckling
      const [Fcr_3, FcrHtml_3] = E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy);

      if (flange === 'nonslender') {
        // E3
        // limit state: FB
        result['Pn_3']['isApplicable'] = true;
        const [Pn_3, PnHtml_3] = capacityCalculator(Fcr_3, A, 'gross');
        result['Pn_3']['value'] = Pn_3;
        result['Pn_3']['html'] = FcrHtml_3 + PnHtml_3;
        
      } else if (flange === 'slender') {
        // E7
        // limit state: LB
        result['Fcr_3']['isApplicable'] = true;
        result['Fcr_3']['value'] = Fcr_3;
        result['Fcr_3']['html'] = FcrHtml_3;

        result['Ae']['isApplicable'] = true;
        const [Ae, AeHtml] = E7MemberWithSlenderElementAe(shapeType, Fy, E, A, lambdaf);
        result['Ae']['value'] = Ae;
        result['Ae']['html'] = AeHtml;

        result['Pn_3_7']['isApplicable'] = true;
        const [Pn_3_7, Html_3_7] = capacityCalculator(Fcr_3, Ae, 'effective');
        result['Pn_3_7']['value'] = Pn_3_7;
        result['Pn_3_7']['html'] = Html_3_7;
      }
    }
    return result;

  } else {
    return null;
  }
}


// Helper Function

// E3 Flexural Buckling of Members without Slender Elements
function E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy) {
  let Fcr = 0;
  let html = '';

  if (Lcx === 0 && Lcy === 0) {
    Fcr = Fy;
    html += `<p>For ${Lcx_} = ${Lcy_} = 0</p>
             <p>Critical stress</p>
             <p>${Fcr_} = ${Fy_} = ${Fy.toFixed(2)} ksi</p>`;

  } else {
    const calcTerm1x = Lcx / rx;
    const calcTerm1x_ = `${Lcx_} / ${rx_}`;
    const calcTerm1y = Lcy / ry;
    const calcTerm1y_ = `${Lcy_} / ${ry_}`;

    html += `<p>Effective slenderness ratio</p>
             <p>${calcTerm1x_} = ${calcTerm1x.toFixed(2)}</p>
             <p>${calcTerm1y_} = ${calcTerm1y.toFixed(2)}</p>`;

    let calcTerm2 = 0;
    let calcTerm2_ = '';
    if (calcTerm1x > calcTerm1y) {
      calcTerm2 = calcTerm1x;
      calcTerm2_ = calcTerm1x_;
      html += `<p>Major axis governs</p>`;
    } else if (calcTerm1x < calcTerm1y) {
      calcTerm2 = calcTerm1y;
      calcTerm2_ = calcTerm1y_;
      html += `<p>Minor axis governs</p>`;
    } else {
      calcTerm2 = calcTerm1x;
      calcTerm2_ = calcTerm1x_;
      html += `<p>Major and minor axes govern equally</p>`;
    }

    if (calcTerm2 > 200) {
      html += `<p>Effective slenderness ratio preferably should not exceed 200</p>`;
    }
  
    const Fe = Math.PI**2 * E / calcTerm2**2;
    html += `<p>Elastic buckling stress</p>
             <p>${Fe_} = &pi;<sup>2</sup> ${E_} / (${calcTerm2_})<sup>2</sup> = ${Fe.toFixed(2)} ksi</p>`;

    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [Fcr, html];
}

// E4 Torsional and Flexural-Torsional Buckling of Single Angles and Members without Slender Elements

// E4 Torsional Buckling of Members without Slender Elements
function E4TorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz) {
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<p>For sections with continuous torsional bracing, torsional buckling does not apply</p>`;
    return [Fcr, html];

  } else {
    const Fe = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ix + Iy);
    html += `<p>Torsional elastic buckling stress</p>
             <p>${Fe_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ix_} + ${Iy_}) = ${Fe.toFixed(2)} ksi</p>`;
    
    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [Fcr, html];
}

// E4 Flexural-Torsional Buckling of Members without Slender Elements
function E4FlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, Ag, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz) {
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<p>For sections with continuous torsional bracing, flexural-torsional buckling does not apply</p>`;
    return [Fcr, html];

  } else {
    let Fe = 0;
    let FeHtml = '';
    if (['C', 'MC'].includes(shapeType)) {
      if (Lcx === 0) {
        html += `<p>${Lcx_} must not be 0</p>`;
        return [Fcr, html];
      } else {
        [Fe, FeHtml] = flexuralTorsionalElasticBucklingStressCalculator('x', E, G, Ag, rx, J, Cw, ro, H, Lcx, Lcz);
      }

    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      if (Lcy === 0) {
        html += `<p>${Lcy_} must not be 0</p>`;
        return [Fcr, html];
      } else {
        [Fe, FeHtml] = flexuralTorsionalElasticBucklingStressCalculator('y', E, G, Ag, ry, J, 0, ro, H, Lcy, Lcz);
      }

    }
    html += FeHtml;

    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [Fcr, html];
}

// Flexural-Torsional Elastic Buckling Stress Calculator
function flexuralTorsionalElasticBucklingStressCalculator(axisOfSym, E, G, Ag, r, J, Cw, ro, H, Lc, Lcz) {
  let Fe = 0;
  let html = `<p>Flexural-torsional elastic buckling stress</p>
              <p>${ro_} = ${ro.toFixed(2)} in.</p>
              <p>${H_} = ${H.toFixed(3)}</p>`;

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
  html += `<p>${Fexy_} = &pi;<sup>2</sup> ${E_} / (${calcTerm1_})<sup>2</sup> = ${Fexy.toFixed(2)} ksi</p>`;

  let Fez = 0;
  if (Cw === 0) {
    Fez = (Math.PI**2 * E / Lcz**2 + G * J) / (Ag * ro**2);
    html += `<p>${Fez_} = (&pi;<sup>2</sup> ${E_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ag_} ${ro_}<sup>2</sup>) = ${Fez.toFixed(2)} ksi</p>`;

  } else {
    Fez = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ag * ro**2);
    html += `<p>${Fez_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ag_} ${ro_}<sup>2</sup>) = ${Fez.toFixed(2)} ksi</p>`;
  }

  Fe = (Fexy + Fez) / (2 * H) * (1 - Math.sqrt(1 - 4 * Fexy * Fez * H / (Fexy + Fez)**2));
  html += `<p>${Fe_} = (${Fexy_} + ${Fez_}) / (2 ${H_}) (1 - &radic;(1 - 4 ${Fexy_} ${Fez_} ${H_} / (${Fexy_} + ${Fez_})<sup>2</sup>)) = ${Fe.toFixed(2)} ksi</p>`;

  return [Fe, html];
}

// Critical Stress Calculator
function criticalStressCalculator(Fy, Fe) {
  let Fcr = 0;
  let html = '';

  const calcTerm1 = Fy / Fe;
  const calcTerm1_ = `${Fy_} / ${Fe_}`;

  if (calcTerm1 <= 2.25) {
    Fcr = 0.658**calcTerm1 * Fy;
    html += `<p>For ${calcTerm1_} &le; 2.25</p>
             <p>Critical stress</p>
             <p>${Fcr_} = 0.658<sup>${calcTerm1_}</sup> ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;

  } else {
    Fcr = 0.877 * Fe;
    html += `<p>For ${calcTerm1_} &gt; 2.25</p>
             <p>Critical stress</p>
             <p>${Fcr_} = 0.877 ${Fe_} = ${Fcr.toFixed(2)} ksi</p>`;
  }

  return [Fcr, html];
}

// E5 Single-Angle Compression Members


// E6 Built-Up Members


// E7 Members with Slender Elements
function E7MemberWithSlenderElementAe(shapeType, Fy, E, Ag, lambda) {
  let Ae = 0;
  let html = '';

  if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
    // Ae = 0.85 * Ag;
    // html += `<p>Effective net area</p>
    //          <p>${Ae_} = 0.85 ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  } else if (['C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
    // Ae = 0.85 * Ag;
    // html += `<p>Effective net area</p>
    //          <p>${Ae_} = 0.85 ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    // Ae = Ag;
    // html += `<p>Effective net area</p>
    //          <p>${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    const calcTerm1 = E / Fy;
    const calcTerm1_ = `${E_} / ${Fy_}`;

    if (lambda <= 0.11 * calcTerm1) {
      Ae = Ag;
      html += `<p>For ${lambda_} &le; 0.11 ${calcTerm1_}</p>
               <p>${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
    } else if (lambda <= 0.45 * calcTerm1) {
      Ae = (0.038 * E / (Fy * lambda) + 2 / 3) * Ag;
      html += `<p>For 0.11 ${calcTerm1_} &lt; ${lambda_} &le; 0.45 ${calcTerm1_}</p>
               <p>${Ae_} = (0.038 ${E_} / (${Fy_} ${lambda_}) + 2 / 3) ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
    }
  }

  return [Ae, html];
}

// Nominal Compressive Strength, Pn, Calculator
function capacityCalculator(Fcr, A, areaType) {
  let Pn = 0;
  let html = '';
  
  if (Fcr > 0) {
    Pn = Fcr * A;
    
    let A_ = '';
    if (areaType === 'gross') {
      A_ = 'A<sub>g</sub>';
    } else if (areaType === 'effective') {
      A_ = 'A<sub>e</sub>';
    }
    html = `<p>${Pn_} = ${Fcr_} ${A_} = ${Pn.toFixed(2)} k</p>
            <p>${Pn_} = ${Pn.toFixed(1)} k</p>`;
  }

  return [Pn, html];
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
const ro_ = 'r<sub>o</sub>';
const H_ = 'H';
const rts_ = 'r<sub>ts</sub>';
const ho_ = 'h<sub>o</sub>';




const Lcx_ = 'L<sub>cx</sub>';
const Lcy_ = 'L<sub>cy</sub>';
const Lcz_ = 'L<sub>cz</sub>';

const Fe_ = 'F<sub>e</sub>';
const Fex_ = 'F<sub>ex</sub>';
const Fey_ = 'F<sub>ey</sub>';
const Fez_ = 'F<sub>ez</sub>';
const Fcr_ = 'F<sub>cr</sub>';

const Ag_ = 'A<sub>g</sub>';
const Ae_ = 'A<sub>e</sub>';

const Pn_ = 'P<sub>n</sub>';

const lambda_ = '&lambda;';