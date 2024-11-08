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
      const [phi_4, Fcr_4, FcrHtml_4] = E4TorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz);

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
      const [phi_4, Fcr_4, FcrHtml_4] = E4FlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, A, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz);

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

      // convert list back to dictionary
      // output data structure
      // {
      //   "Pn_3": { "isApplicable": true, "phiValue": 0.9, ... }
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

// E3 Flexural Buckling of Members without Slender Elements
function E3FlexuralBucklingWithoutSlenderElementFcr(Fy, E, rx, ry, Lcx, Lcy) {
  let phi = 0.9;
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

  return [phi, Fcr, html];
}

// E4 Torsional and Flexural-Torsional Buckling of Single Angles and Members without Slender Elements

// E4 Torsional Buckling of Members without Slender Elements
function E4TorsionalBucklingWithoutSlenderElementFcr(Fy, E, G, Ix, Iy, J, Cw, Lcz) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<p>For sections with continuous torsional bracing, torsional buckling does not apply</p>`;
    return [phi, Fcr, html];

  } else {
    const Fe = (Math.PI**2 * E * Cw / Lcz**2 + G * J) / (Ix + Iy);
    html += `<p>Torsional elastic buckling stress</p>
             <p>${Fe_} = (&pi;<sup>2</sup> ${E_} ${Cw_} / ${Lcz_}<sup>2</sup> + ${G_} ${J_}) / (${Ix_} + ${Iy_}) = ${Fe.toFixed(2)} ksi</p>`;
    
    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [phi, Fcr, html];
}

// E4 Flexural-Torsional Buckling of Members without Slender Elements
function E4FlexuralTorsionalBucklingWithoutSlenderElementFcr(shapeType, Fy, E, G, Ag, rx, ry, J, Cw, ro, H, Lcx, Lcy, Lcz) {
  let phi = 0.9;
  let Fcr = 0;
  let html = '';

  if (Lcz === 0) {
    html += `<p>For sections with continuous torsional bracing, flexural-torsional buckling does not apply</p>`;
    return [phi, Fcr, html];

  } else {
    let Fe = 0;
    let FeHtml = '';
    if (['C', 'MC'].includes(shapeType)) {
      if (Lcx === 0) {
        html += `<p>${Lcx_} must not be 0</p>`;
        return [phi, Fcr, html];
      } else {
        [Fe, FeHtml] = flexuralTorsionalElasticBucklingStressCalculator('x', E, G, Ag, rx, J, Cw, ro, H, Lcx, Lcz);
      }

    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      if (Lcy === 0) {
        html += `<p>${Lcy_} must not be 0</p>`;
        return [phi, Fcr, html];
      } else {
        [Fe, FeHtml] = flexuralTorsionalElasticBucklingStressCalculator('y', E, G, Ag, ry, J, 0, ro, H, Lcy, Lcz);
      }

    }
    html += FeHtml;

    let FcrHtml = '';
    [Fcr, FcrHtml] = criticalStressCalculator(Fy, Fe);
    html += FcrHtml;
  }

  return [phi, Fcr, html];
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
      html += `<p>For ${lambda_} &le; 0.11 ${calcTerm1_}</p>
               <p>${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
    } else if (lambdaf <= 0.45 * calcTerm1) {
      Ae = (0.038 * E / (Fy * lambdaf) + 2 / 3) * Ag;
      html += `<p>For 0.11 ${calcTerm1_} &lt; ${lambda_} &le; 0.45 ${calcTerm1_}</p>
               <p>${Ae_} = (0.038 ${E_} / (${Fy_} ${lambda_}) + 2 / 3) ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
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
    html += `<p>For nonslender ${elementType}s, 
                ${beff_} = ${bfull_}</p>`;

  } else {
    if (lambda <= calcTerm1) {
      html += `<p>For slender ${elementType}s when ${lambda_} &le; ${calcTerm1_}, 
                  ${beff_} = ${bfull_}</p>`;

    } else {
      html += `<p>For slender ${elementType}s when ${lambda_} &gt; ${calcTerm1_}</p>`
      
      if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
        html += `<p>${bfull_} = ${lambda_} ${tw_} = ${b.toFixed(2)} in.</p>`;
      } else {
        html += `<p>${bfull_} = ${b.toFixed(2)} in.</p>`;
      }

      const [c1, c2] = effectiveWidthImperfectionAdjustmentFactorFinder(shapeType, elementType);
      html += `<p>Effective width imperfection adjustment factors</p>
               <p>${c1_} = ${c1.toFixed(2)},&emsp;
                  ${c2_} = ${c2.toFixed(2)}</p>`;

      const Fel = (c2 * lambdar / lambda)**2 * Fy;
      html += `<p>Elastic local buckling stress</p>
               <p>${Fel_} = (${c2_} ${lambdar_} / ${lambda_})<sup>2</sup> ${Fy_} = ${Fel.toFixed(2)} ksi</p>`;
      
      const calcTerm2 = Math.sqrt(Fel / Fcr);
      const calcTerm2_ = `&radic;(${Fel_} / ${Fcr_})`;
      be = b * (1 - c1 * calcTerm2) * calcTerm2;
      html += `<p>Effective width</p>
               <p>${beff_} = ${bfull_} (1 - ${c1_} ${calcTerm2_}) ${calcTerm2_} = ${be.toFixed(2)} in.</p>`;
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

  html += `<p>Effective area</p>`;
  if (be === 0 && he === 0) {
    Ae = Ag;
    html += `<p>${Ae_} = ${Ag_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  } else if (be > 0 && he === 0) {
    Ae = Ag - calcTerm1;
    html += `<p>${Ae_} = ${Ag_} - ${calcTerm1_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  } else if (be === 0 && he > 0) {
    Ae = Ag - calcTerm2;
    html += `<p>${Ae_} = ${Ag_} - ${calcTerm2_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;

  } else if (be > 0 && he > 0) {
    Ae = Ag - calcTerm1 - calcTerm2;
    html += `<p>${Ae_} = ${Ag_} - ${calcTerm1_} - ${calcTerm2_} = ${Ae.toFixed(2)} in.<sup>2</sup></p>`;
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
  html = `<p>${Pn_} = ${Fcr_} ${A_} = ${Pn.toFixed(2)} k</p>
          <p>${Pn_} = ${Pn.toFixed(1)} k</p>`;

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

const be_ = 'b<sub>e</sub>';
const he_ = 'h<sub>e</sub>';
const de_ = 'd<sub>e</sub>';

const c1_ = 'c<sub>1</sub>';
const c2_ = 'c<sub>2</sub>';

const Fel_ = 'F<sub>el</sub>';


const Ag_ = 'A<sub>g</sub>';
const Ae_ = 'A<sub>e</sub>';




const Pn_ = 'P<sub>n</sub>';

const lambda_ = '&lambda;';
const lambdaf_ = '&lambda;<sub>f</sub>';
const lambdarf_ = '&lambda;<sub>rf</sub>';
const lambdaw_ = '&lambda;<sub>w</sub>';
const lambdarw_ = '&lambda;<sub>rw</sub>';