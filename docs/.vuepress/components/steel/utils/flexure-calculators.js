// A360 Chapter F

export function majorFlexureCalculator(shapeData, shapeType, astmSpecProp, slenderClass, Lb, Cb) {
  if (shapeData && shapeType && astmSpecProp && slenderClass && Cb) {
    const { Fy, E } = astmSpecProp;
    const { 
      flange: {
        ratio: { value: lambdaf },
        limit: {
          compact: { value: lambdapf },
          noncompact: { value: lambdarf },
        },
        class: [flange],
      },
      web: {
        ratio: { value: lambdaw },
        limit: {
          compact: { value: lambdapw },
          noncompact: { value: lambdarw },
        },
        class: [web],
      } 
    } = slenderClass;

    let result = {
      'Mn_2_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_2_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_3_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_3': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_4': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_8_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_8_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_9_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_9_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_9_3': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_9_4': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_10_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType) && flange === 'compact' && web === 'compact') {
      // F2
      // limit state: Y, LTB
      
      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;

      // F2.1 Yielding
      result['Mn_2_1']['isApplicable'] = true;
      const [Mp, html_2_1] = F2_1Yielding(Fy, Zx);
      result['Mn_2_1']['values'][0] = Mp;
      result['Mn_2_1']['html'] = html_2_1;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2']['isApplicable'] = true;
      const [Mn_2_2, html_2_2] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);
      result['Mn_2_2']['values'][0] = Mn_2_2;
      result['Mn_2_2']['html'] = html_2_2;

    } else if (['W', 'M', 'S', 'HP'].includes(shapeType) && ['noncompact', 'slender'].includes(flange) && web === 'compact') {
      // F3
      // limit state: LTB, FLB

      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;
      
      // F2.1 Yielding
      result['Mn_2_1']['isApplicable'] = true;
      const [Mp, html_2_1] = F2_1Yielding(Fy, Zx);
      result['Mn_2_1']['values'][0] = Mp;
      result['Mn_2_1']['html'] = html_2_1;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2']['isApplicable'] = true;
      const [Mn_2_2, html_2_2] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);
      result['Mn_2_2']['values'][0] = Mn_2_2;
      result['Mn_2_2']['html'] = html_2_2;

      // F3.2 Compression Flange Local Buckling
      result['Mn_3_2']['isApplicable'] = true;
      const [Mn_3_2, html_3_2] = F3_2CompressionFlangeLocalBuckling(Mp, Fy, E, Sx, lambdaf, lambdaw, lambdapf, lambdarf, flange);
      result['Mn_3_2']['values'][0] = Mn_3_2;
      result['Mn_3_2']['html'] = html_3_2;

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // F7
      // limit state: Y, FLB, WLB, LTB

      const { A, Ht, h, b, tdes, Ix, Zx, Sx, ry, J } = shapeData;

      // F7.1 Yielding
      result['Mn_7_1']['isApplicable'] = true;
      const [Mp, html_7_1] = F7_1Yielding('x', Fy, Zx);
      result['Mn_7_1']['values'][0] = Mp;
      result['Mn_7_1']['html'] = html_7_1;

      // F7.2 Flange Local Buckling
      result['Mn_7_2']['isApplicable'] = true;
      const [Mn_7_2, html_7_2] = F7_2FlangeLocalBuckling('x', Mp, Fy, E, Ht, b, tdes, Ix, Sx, flange);
      result['Mn_7_2']['values'][0] = Mn_7_2;
      result['Mn_7_2']['html'] = html_7_2;

      // F7.3 Web Local Buckling
      result['Mn_7_3']['isApplicable'] = true;
      const [Mn_7_3, html_7_3] = F7_3WebLocalBuckling('x', Mp, Fy, E, h, b, tdes, tdes, Sx, web);
      result['Mn_7_3']['values'][0] = Mn_7_3;
      result['Mn_7_3']['html'] = html_7_3;

      // F7.4 Lateral-Torsional Buckling
      result['Mn_7_4']['isApplicable'] = true;
      const [Mn_7_4, html_7_4] = F7_4LateralTorsionalBuckling('x', shapeType, Mp, Fy, E, A, Sx, ry, J, Lb, Cb);
      result['Mn_7_4']['values'][0] = Mn_7_4;
      result['Mn_7_4']['html'] = html_7_4;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // F8
      // limit state: Y, LB
      // F8 only applies to round HSS with D/t < 0.45E/Fy

      if (lambdaf < 0.45 * E * Fy) {
        const { Zx, Sx } = shapeData;

        // F8.1 Yielding
        result['Mn_8_1']['isApplicable'] = true;
        const [Mp, html_8_1] = F8_1Yielding('x', Fy, Zx);
        result['Mn_8_1']['values'][0] = Mp;
        result['Mn_8_1']['html'] = html_8_1;

        // F8.2 Local Buckling
        result['Mn_8_2']['isApplicable'] = true;
        const [Mn_8_2, html_8_2] = F8_2LocalBuckling('x', Fy, E, Sx, lambdaf, flange);
        result['Mn_8_2']['values'][0] = Mn_8_2;
        result['Mn_8_2']['html'] = html_8_2;
      }

    } else if (['WT', 'MT', 'ST', '2L'].includes(shapeType)) {
      // F9
      // limit state: Y, LTB, FLB, WLB

      const { d, y, Ix, Zx, Sx, Iy, ry, J } = shapeData;

      // F9.1 Yielding
      result['Mn_9_1']['isApplicable'] = true;
      const [Mp_pos, Mp_neg, html_9_1] = F9_1Yielding(shapeType, Fy, Zx, Sx);
      result['Mn_9_1']['values'] = [Mp_pos, Mp_neg];
      result['Mn_9_1']['html'] = html_9_1;

      // F9.2 Lateral-Torsional Buckling
      result['Mn_9_2']['isApplicable'] = true;
      const [Mn_9_2_pos, Mn_9_2_neg, html_9_2] = F9_2LateralTorsionalBuckling(shapeType, Mp_pos, Fy, E, d, Sx, Iy, ry, J, Lb);
      result['Mn_9_2']['values'] = [Mn_9_2_pos, Mn_9_2_neg];
      result['Mn_9_2']['html'] = html_9_2;

      // F9.3 Flange Local Buckling of Tees and Double-Angle Legs
      // only sagging
      result['Mn_9_3']['isApplicable'] = true;
      const [Mn_9_3_pos, Mn_9_3_neg, html_9_3] = F9_3FlangeLocalBuckling(shapeType, Mp_pos, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flange);
      result['Mn_9_3']['values'] = [Mn_9_3_pos, Mn_9_3_neg];
      result['Mn_9_3']['html'] = html_9_3;

      // F9.4 Local Buckling of Tee Stems and Double-Angle Web Legs in Flexural Compression
      // only hogging
      result['Mn_9_4']['isApplicable'] = true;
      const [Mn_9_4_pos, Mn_9_4_neg, html_9_4] = F9_4WebLocalBuckling(shapeType, Fy, E, Sx, lambdaw, web);
      result['Mn_9_4']['values'] = [Mn_9_4_pos, Mn_9_4_neg];
      result['Mn_9_4']['html'] = html_9_4;

    } else if (['L'].includes(shapeType)) {
      // F10
      // limit state: Y, LTB, LLB

      const { Sx } = shapeData;

      // F10.1 Yielding
      result['Mn_10_1']['isApplicable'] = true;
      const [Mn_10_1, html_10_1] = F10_1Yielding(Fy, Sx);
      result['Mn_10_1']['values'][0] = Mn_10_1;
      result['Mn_10_1']['html'] = html_10_1;
    }
    return result;

  } else {
    return null;
  }
}

export function minorFlexureCalculator(shapeData, shapeType, astmSpecProp, slenderClass) {
  if (shapeData && shapeType && astmSpecProp && slenderClass) {
    const { Fy, E } = astmSpecProp;
    const {
      flange: {
        ratio: { value: lambdaf },
        limit: {
          compact: { value: lambdapf },
          noncompact: { value: lambdarf },
        },
        class: [, flange],
      },
      web: {
        ratio: { value: lambdaw },
        limit: {
          compact: { value: lambdapw },
          noncompact: { value: lambdarw },
        },
        class: [, web],
      }
    } = slenderClass;

    let result = {
      'Mn_6_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_6_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_3': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_7_4': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_8_1': {'isApplicable': false, 'values': [0, 0], 'html': null},
      'Mn_8_2': {'isApplicable': false, 'values': [0, 0], 'html': null},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
      // F6
      // limit state: Y, FLB

      const { Zy, Sy } = shapeData;

      // F6.1 Yielding
      result['Mn_6_1']['isApplicable'] = true;
      const [Mp, html_6_1] = F6_1Yielding(Fy, Zy, Sy);
      result['Mn_6_1']['values'][0] = Mp;
      result['Mn_6_1']['html'] = html_6_1;

      // F6.2 Flange Local Buckling
      result['Mn_6_2']['isApplicable'] = true;
      const [Mn_6_2, html_6_2] = F6_2FlangeLocalBuckling(Mp, Fy, E, Sy, lambdaf, lambdapf, lambdarf, flange);
      result['Mn_6_2']['values'][0] = Mn_6_2;
      result['Mn_6_2']['html'] = html_6_2;

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // F7
      // limit state: Y, FLB, WLB, LTB

      const { B, h, b, tdes, Iy, Zy, Sy } = shapeData;

      // F7.1 Yielding
      result['Mn_7_1']['isApplicable'] = true;
      const [Mp, html_7_1] = F7_1Yielding('y', Fy, Zy);
      result['Mn_7_1']['values'][0] = Mp;
      result['Mn_7_1']['html'] = html_7_1;

      // F7.2 Flange Local Buckling
      result['Mn_7_2']['isApplicable'] = true;
      const [Mn_7_2, html_7_2] = F7_2FlangeLocalBuckling('y', Mp, Fy, E, B, h, tdes, Iy, Sy, flange);
      result['Mn_7_2']['values'][0] = Mn_7_2;
      result['Mn_7_2']['html'] = html_7_2;

      // F7.3 Web Local Buckling
      result['Mn_7_3']['isApplicable'] = true;
      const [Mn_7_3, html_7_3] = F7_3WebLocalBuckling('y', Mp, Fy, E, b, h, tdes, tdes, Sy, web);
      result['Mn_7_3']['values'][0] = Mn_7_3;
      result['Mn_7_3']['html'] = html_7_3;

      // F7.4 Lateral-Torsional Buckling
      result['Mn_7_4']['isApplicable'] = true;
      const [Mn_7_4, html_7_4] = F7_4LateralTorsionalBuckling('y', shapeType, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      result['Mn_7_4']['values'][0] = Mn_7_4;
      result['Mn_7_4']['html'] = html_7_4;

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // F8
      // limit state: Y, LB
      // F8 only applies to round HSS with D/t < 0.45E/Fy
      // same as major axis

      if (lambdaf < 0.45 * E * Fy) {
        const { Zy, Sy } = shapeData;

        // F8.1 Yielding
        result['Mn_8_1']['isApplicable'] = true;
        const [Mp, html_8_1] = F8_1Yielding('y', Fy, Zy);
        result['Mn_8_1']['values'][0] = Mp;
        result['Mn_8_1']['html'] = html_8_1;

        // F8.2 Local Buckling
        result['Mn_8_2']['isApplicable'] = true;
        const [Mn_8_2, html_8_2] = F8_2LocalBuckling('y', Fy, E, Sy, lambdaf, flange);
        result['Mn_8_2']['values'][0] = Mn_8_2;
        result['Mn_8_2']['html'] = html_8_2;
      }
    }
    return result;

  } else {
    return null;
  }
}

export function criticalResultProcessor(result) {
  if (result) {
    const resultAsList = Object.entries(result);

    // filter out objects where isApplicable is false or all values are 0
    const filteredResultAsList = resultAsList.filter(([, item]) => item['isApplicable'] && item['values'].some(value => value !== 0));

    if (filteredResultAsList.length > 0) {
      const criticalKeys = [null, null];
      const criticalResults = [0, 0];

      filteredResultAsList.forEach(([key, item]) => {
        const values = item['values'];

        values.forEach((value, index) => {
          const currentCriticalResult = criticalResults[index];

          if (value !== 0 && (currentCriticalResult === 0 || value < currentCriticalResult)) {
            criticalKeys[index] = key;
            criticalResults[index] = value;
          }
        });
      });
      return [criticalKeys, criticalResults];

    } else {
      return null;
    }

  } else {
    return null;
  }
}


// Helper Function

// F2 Doubly Symmetric Compact I-Shaped Members and Channels Bent about Their Major Axis

// F2.1 Yielding
function F2_1Yielding(Fy, Zx) {
  const Mp = Fy * Zx;
  const html = `<p>${Mp_} = ${Fy_} ${Zx_} = ${Mp.toFixed(2)} k-in</p>
                <p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
  return [Mp, html];
}

// F2.2 Lateral-Torsional Buckling
function F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb) {
  let Mn = 0;
  let html = '';

  // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
  const Lp = 1.76 * ry * Math.sqrt(E / Fy);
  html += `<p>Limiting laterally unbraced length for the limit state of yielding</p>
           <p>${Lp_} = 1.76 ${ry_} &radic;(${E_} / ${Fy_}) = ${Lp.toFixed(1)} in. = ${(Lp / 12).toFixed(1)} ft</p>`;

  if (Lb <= Lp) {
    // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
    html += `<p>${Lb_} &le; ${Lp_}, lateral-torsional buckling does not apply</p>`;
    return [Mn, html];

  } else {
    // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
    html += `<p>Limiting laterally unbraced length for the limit state of inelastic lateral-torsional buckling</p>`;

    const calcTerm1 = E / (0.7 * Fy);

    let c = 0;
    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      c = 1;
      html += `<p>For doubly symmetric I-shapes, c = 1</p>`;
    } else if (['C', 'MC'].includes(shapeType)) {
      c = (ho / 2) * Math.sqrt(Iy / Cw);
      html += `<p>For channels, c = ${ho_} / 2 &radic;(${Iy_} / ${Cw_}) = ${c.toFixed(2)}</p>`;
    }

    const calcTerm2 = (J * c) / (Sx * ho);
    const calcTerm2_ = `${J_}c / ${Sx_}${ho_}`;

    const Lr = 1.95 * rts * calcTerm1 * Math.sqrt(calcTerm2 + Math.sqrt(calcTerm2**2 + 6.76 * (1 / calcTerm1)**2));
    html += `<p>${Lr_} = 1.95 ${rts_} (${E_} / 0.7${Fy_}) &radic;(${calcTerm2_} + &radic;((${calcTerm2_})<sup>2</sup> + 6.76 (0.7${Fy_} / ${E_})<sup>2</sup>)) = ${Lr.toFixed(1)} in. = ${(Lr / 12).toFixed(1)} ft</p>`;

    if (Lb <= Lr) {
      // (b) when Lp < Lb ≤ Lr
      html += `<p>${Lp_} &lt; ${Lb_} &le; ${Lr_}</p>`;

      Mn = Cb * (Mp - (Mp - 0.7 * Fy * Sx) * (Lb - Lp) / (Lr - Lp));
      html += `<p>${Mn_} = ${Cb_} (${Mp_} - (${Mp_} - 0.7${Fy_}${Sx_}) (${Lb_} - ${Lp_}) / (${Lr_} - ${Lp_})) = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
      Mn = Math.min(Mn, Mp);
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else {
      // (c) when Lb > Lr
      html += `<p>${Lb_} &gt; ${Lr_}</p>`;

      const calcTerm3 = (Lb / rts)**2;
      const calcTerm3_ = `(${Lb_} / ${rts_})<sup>2</sup>`;

      const Fcr = (Cb * Math.PI**2 * E / calcTerm3) * Math.sqrt(1 + 0.078 * calcTerm2 * calcTerm3);
      html += `<p>Critical stress</p>
               <p>${Fcr_} = ${Cb_}&pi;<sup>2</sup>${E_} / ${calcTerm3_} &radic;(1 + 0.078 (${calcTerm2_}) ${calcTerm3_}) = ${Fcr.toFixed(2)} ksi</p>`;

      Mn = Fcr * Sx;
      html += `<p>${Mn_} = ${Fcr_} ${Sx_} = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
      Mn = Math.min(Mn, Mp);
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];
    }
  }
}

// F3 Doubly Symmetric I-Shaped Members with Compact Webs and Noncompact or Slender Flanges Bent about Their Major Axis

// F3.2 Compression Flange Local Buckling
function F3_2CompressionFlangeLocalBuckling(Mp, Fy, E, Sx, lambdaf, lambdaw, lambdapf, lambdarf, flangeClass) {
  let Mn = 0;
  let html = '';

  if (flangeClass === 'noncompact') {
    Mn = Mp - (Mp - 0.7 * Fy * Sx) * (lambdaf - lambdapf) / (lambdarf - lambdapf);
    html += `<p>For sections with noncompact flanges</p>
             <p>${Mn_} = ${Mp_} - (${Mp_} - 0.7${Fy_}${Sx_}) (${lambdaf_} - ${lambdapf_}) / (${lambdarf_} - ${lambdapf_}) = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else if (flangeClass === 'slender') {
    html += `<p>For sections with slender flanges</p>`;

    let kc = 4 / Math.sqrt(lambdaw);
    const kc_ = 'k<sub>c</sub>';
    html += `<p>Coefficient for slender unstiffened elements (0.35 &le; ${kc_} &le; 0.76)</p>
             <p>${kc_} = 4 / &radic;(${h_} / ${tw_}) = ${kc.toFixed(2)}</p>`;
    kc = Math.max(0.35, Math.min(kc, 0.76));
    html += `<p>${kc_} = ${kc.toFixed(2)}</p>`;

    Mn = 0.9 * E * kc * Sx / lambdaf**2;
    html += `<p>${Mn_} = 0.9 ${E_} ${kc_} ${Sx_} / ${lambdaf_}<sup>2</sup> = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else {
    return [Mn, html];
  }
}

// F4 Other I-Shaped Members with Compact or Noncompact Webs Bent about Their Major Axis

// F5 Doubly Symmetric and Singly Symmetric I-Shaped Members with Slender Webs Bent about Their Major Axis

// F6 I-Shaped Members and Channels Bent about Their Minor Axis

// F6.1 Yielding
function F6_1Yielding(Fy, Zy, Sy) {
  let Mp = Fy * Zy;
  let html = `<p>${Mp_} = ${Fy_} ${Zy_} = ${Mp.toFixed(2)} k-in &le; 1.6 ${Fy_} ${Sy_}</p>`;
  Mp = Math.min(Mp, 1.6 * Fy * Sy);
  html += `<p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
  return [Mp, html];
}

// F6.2 Flange Local Buckling
function F6_2FlangeLocalBuckling(Mp, Fy, E, Sy, lambdaf, lambdapf, lambdarf, flangeClass) {
  let Mn = 0;
  let html = '';

  if (flangeClass === 'compact') {
    html += `<p>For sections with compact flanges, flange local buckling does not apply</p>`;
    return [Mn, html];

  } else if (flangeClass === 'noncompact') {
    Mn = Mp - (Mp - 0.7 * Fy * Sy) * (lambdaf - lambdapf) / (lambdarf - lambdapf);
    html += `<p>For sections with noncompact flanges</p>
             <p>${Mn_} = ${Mp_} - (${Mp_} - 0.7${Fy_}${Sy_}) (${lambdaf_} - ${lambdapf_}) / (${lambdarf_} - ${lambdapf_}) = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else if (flangeClass === 'slender') {
    html += `<p>For sections with slender flanges</p>`;

    const Fcr = 0.69 * E / lambdaf**2;
    html += `<p>Critical stress</p>
             <p>${Fcr_} = 0.69 ${E_} / ${lambdaf_}<sup>2</sup> = ${Fcr.toFixed(2)} ksi</p>`;

    Mn = Fcr * Sy;
    html += `<p>${Mn_} = ${Fcr_} ${Sy_} = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else {
    return [Mn, html];
  }
}

// F7 Square and Rectangular HSS and Box Sections

// F7.1 Yielding
function F7_1Yielding(axis, Fy, Z) {
  let Z_ = axis === 'x' ? Zx_ : Zy_;

  const Mp = Fy * Z;
  const html = `<p>${Mp_} = ${Fy_} ${Z_} = ${Mp.toFixed(2)} k-in</p>
                <p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
  return [Mp, html];
}

// F7.2 Flange Local Buckling
function F7_2FlangeLocalBuckling(axis, Mp, Fy, E, H, bflange, tflange, I, S, flangeClass) {
  let Mn = 0;
  let html = '';

  let H_ = axis === 'x' ? Ht_ : B_;
  let bflange_ = axis === 'x' ? b_ : h_;
  const tflange_ = tdes_;
  let I_ = axis === 'x' ? Ix_ : Iy_;
  let S_ = axis === 'x' ? Sx_ : Sy_;
  let bflangeeff_ = axis === 'x' ? be_ : he_;
  let bflangeineff_ = axis === 'x' ? `b<sub>ineff</sub>` : `h<sub>ineff</sub>`;
  let Ie_ = axis === 'x' ? Ixe_ : Iye_;
  let Se_ = axis === 'x' ? Sxe_ : Sye_;

  if (flangeClass === 'compact') {
    html += `<p>For sections with compact flanges, flange local buckling does not apply</p>`;
    return [Mn, html];

  } else {
    const calcTerm1 = bflange / tflange;
    const calcTerm1_ = `${bflange_} / ${tflange_}`;

    const calcTerm2 = Math.sqrt(E / Fy);
    const calcTerm2_ = `&radic;(${E_} / ${Fy_})`;

    if (flangeClass === 'noncompact') {
      Mn = Mp - (Mp - Fy * S) * (3.57 * calcTerm1 * (1/calcTerm2) - 4.0);
      html += `<p>For sections with noncompact flanges</p>
               <p>${Mn_} = ${Mp_} - (${Mp_} - ${Fy_}${S_}) (3.57 ${calcTerm1_} &radic;(${Fy_} / ${E_}) - 4.0) = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
      Mn = Math.min(Mn, Mp);
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else if (flangeClass === 'slender') {
      html += `<p>For sections with slender flanges</p>
               <p>Effective width of the compression flange</p>`;
      const bflangeeff = 1.92 * tflange * calcTerm2 * (1 - 0.38 / calcTerm1 * calcTerm2);
      html += `<p>${bflangeeff_} = 1.92 ${tflange_} ${calcTerm2_} (1 - 0.38 / (${calcTerm1_}) ${calcTerm2_}) = ${bflangeeff.toFixed(2)} in. &le; ${bflange_}</p>`;

      let Se = 0;
      if (bflangeeff >= bflange) {
        Se = S;
        html += `<p>${bflangeeff_} = ${bflange_} = ${bflange} in.</p>
                 <p>${Se_} = ${S_} = ${S} in.<sup>3</sup></p>`;
        
      } else {
        html += `<p>${bflangeeff_} = ${bflangeeff.toFixed(2)} in.</p>`;
        // Simple and conservative approach to calculate effective I and S
        // removing ineffective width from top and bottom flanges
        const bflangeineff = bflange - bflangeeff;
        html += `<p>Ineffective width of the compression flange</p>
                 <p>${bflangeineff_} = ${bflange_} - ${bflangeeff_} = ${bflangeineff.toFixed(2)} in.</p>
                 <p>Use <span title="exact calculation is to only remove ineffective width from the compression flange">simplified approach</span> to calculate ${Se_} (remove ineffective width symmetrically from both tension and compression flanges)</p>`;

        const Ie = I - 2 * (bflangeineff * tflange**3 / 12 + bflangeineff * tflange * ((H - tflange) / 2)**2);
        html += `<p>${Ie_} = ${I_} - 2 (${bflangeineff_} ${tflange_}<sup>3</sup> / 12 + ${bflangeineff_} ${tflange_} ((${H_} - ${tflange_}) / 2)<sup>2</sup>) = ${Ie.toFixed(2)} in.<sup>4</sup></p>`;
        Se = Ie / (H / 2);
        html += `<p>${Se_} = ${Ie_} / (${H_} / 2) = ${Se.toFixed(2)} in.<sup>3</sup></p>`;
      }

      Mn = Fy * Se;
      html += `<p>${Mn_} = ${Fy_} ${Se_} = ${Mn.toFixed(2)} k-in</p>
               <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else {
      return [Mn, html];
    }
  }
}

// F7.3 Web Local Buckling
function F7_3WebLocalBuckling(axis, Mp, Fy, E, bweb, bflange, tweb, tflange, S, webClass) {
  let Mn = 0;
  let html = '';

  let bweb_ = axis === 'x' ? h_ : b_;
  let bflange_ = axis === 'x' ? b_ : h_;
  const tweb_ = tdes_;
  const tflange_ = tdes_;
  let S_ = axis === 'x' ? Sx_ : Sy_;

  if (webClass === 'compact') {
    html += `<p>For sections with compact webs, web local buckling does not apply</p>`;
    return [Mn, html];

  } else {
    const calcTerm1 = bweb / tweb;
    const calcTerm1_ = `${bweb_} / ${tweb_}`;

    const calcTerm2 = Math.sqrt(Fy / E);
    const calcTerm2_ = `&radic;(${Fy_} / ${E_})`;

    if (webClass === 'noncompact') {
      Mn = Mp - (Mp - Fy * S) * (0.305 * calcTerm1 * calcTerm2 - 0.738);
      html += `<p>For sections with noncompact webs</p>
               <p>${Mn_} = ${Mp_} - (${Mp_} - ${Fy_}${S_}) (0.305 ${calcTerm1_} ${calcTerm2_} - 0.738) = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
      Mn = Math.min(Mn, Mp);
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else if (webClass === 'slender') {
      html += `<p>For sections with slender webs</p>
               <p>Bending strength reduction factor</p>`;

      const aw = 2 * bweb * tweb / (bflange * tflange);
      html += `<p>${aw_} = 2${bweb_}${tweb_} / (${bflange_}${tflange_}) = ${aw.toFixed(2)}</p>`;

      // bending strength reduction factor
      let Rpg = 1 - aw / (1200 + 300 * aw) * (calcTerm1 - 5.7 * (1/calcTerm2));
      html += `<p>${Rpg_} = 1 - ${aw_} / (1200 + 300${aw_}) (${calcTerm1_} - 5.7&radic;(${E_} / ${Fy_})) = ${Rpg.toFixed(2)} &le; 1.0</p>`;

      // Rpg less than or equal to 1.0
      Rpg = Math.min(Rpg, 1.0);
      html += `<p>${Rpg_} = ${Rpg.toFixed(2)}</p>`;

      // (1) compression flange yielding
      const Mn_1 = Rpg * Fy * S;
      html += `<p>Compression flange yielding</p>
               <p>${Mn_} = ${Rpg_} ${Fy_} ${S_} = ${Mn_1.toFixed(2)} k-in</p>`;

      // (2) compression flange local buckling
      const kc = 4.0;
      const Fcr = 0.9 * E * kc / (bflange / tflange)**2;

      const Mn_2 = Rpg * Fcr * S;
      html += `<p>Compression flange local buckling</p>
               <p>${kc_} = ${kc.toFixed(1)}</p>
               <p>${Fcr_} = 0.9 ${E_} ${kc_} / (${bflange_} / ${tflange_})<sup>2</sup> = ${Fcr.toFixed(2)} ksi</p>
               <p>${Mn_} = ${Rpg_} ${Fcr_} ${S_} = ${Mn_2.toFixed(2)} k-in</p>`;

      if (Mn_1 <= Mn_2) {
        Mn = Mn_1;
        html += `<p>Compression flange yielding governs</p>`;
      } else {
        Mn = Mn_2;
        html += `<p>Compression flange local buckling governs</p>`;
      }
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else {
      return [Mn, html];
    }
  }
}

// F7.4 Lateral-Torsional Buckling
function F7_4LateralTorsionalBuckling(axis, shapeType, Mp, Fy, E, Ag, Sx, ry, J, Lb, Cb) {
  let Mn = 0;
  let html = '';

  if (axis === 'x') {
    if (shapeType === 'HSS Rect.') {
      const calcTerm1 = Math.sqrt(J * Ag);
      const calcTerm1_ = `&radic;(${J_}${A_})`;

      // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
      const Lp = 0.13 * E * ry * calcTerm1 / Mp;
      html += `<p>Limiting laterally unbraced length for the limit state of yielding</p>
               <p>${Lp_} = 0.13 ${E_} ${ry_} ${calcTerm1_} / ${Mp_} = ${Lp.toFixed(1)} in. = ${(Lp / 12).toFixed(1)} ft</p>`;

      if (Lb <= Lp) {
        // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
        html += `<p>${Lb_} &le; ${Lp_}, lateral-torsional buckling does not apply</p>`;
        return [Mn, html];

      } else {
        // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
        const Lr = 2 * E * ry * calcTerm1 / (0.7 * Fy * Sx);
        html += `<p>Limiting laterally unbraced length for the limit state of inelastic lateral-torsional buckling</p>
                 <p>${Lr_} = 2 ${E_} ${ry_} ${calcTerm1_} / (0.7${Fy_}${Sx_}) = ${Lr.toFixed(1)} in. = ${(Lr / 12).toFixed(1)} ft</p>`;

        if (Lb <= Lr) {
          // (b) when Lp < Lb ≤ Lr
          html += `<p>${Lp_} &lt; ${Lb_} &le; ${Lr_}</p>`;

          Mn = Cb * (Mp - (Mp - 0.7 * Fy * Sx) * (Lb - Lp) / (Lr - Lp));
          html += `<p>${Mn_} = ${Cb_} (${Mp_} - (${Mp_} - 0.7${Fy_}${Sx_}) (${Lb_} - ${Lp_}) / (${Lr_} - ${Lp_})) = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
          Mn = Math.min(Mn, Mp);
          html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
          return [Mn, html];

        } else {
          // (c) when Lb > Lr
          html += `<p>${Lb_} &gt; ${Lr_}</p>`;

          Mn = 2 * E * Cb * calcTerm1 / (Lb / ry);
          html += `<p>${Mn_} = 2 ${E_} ${Cb_} ${calcTerm1_} / (${Lb_} / ${ry_}) = ${Mn.toFixed(2)} k-in &le; ${Mp_}</p>`;
          Mn = Math.min(Mn, Mp);
          html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
          return [Mn, html];
        }
      }

    } else if (shapeType === 'HSS Square') {
      // LTB does not apply to square sections
      html += `<p>Lateral-torsional buckling does not apply to square sections</p>`;
      return [Mn, html];

    } else {
      return [Mn, html];
    }

  } else if (axis === 'y') {
    // LTB does not apply to sections bending about their minor axis
    html += `<p>Lateral-torsional buckling does not apply to sections bending about their minor axis</p>`;
    return [Mn, html];

  } else {
    return [Mn, html];
  }
}

// F8 Round HSS

// F8.1 Yielding
function F8_1Yielding(axis, Fy, Z) {
  let Z_ = axis === 'x' ? Zx_ : Zy_;

  const Mp = Fy * Z;
  const html = `<p>${Mp_} = ${Fy_} ${Z_} = ${Mp.toFixed(2)} k-in</p>
                <p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
  return [Mp, html];
}

// F8.2 Local Buckling
function F8_2LocalBuckling(axis, Fy, E, S, lambda, wallClass) {
  let Mn = 0;
  let html = '';

  let S_ = axis === 'x' ? Sx_ : Sy_;

  if (wallClass === 'compact') {
    html += `<p>For sections with compact walls, local buckling does not apply</p>`;
    return [Mn, html];

  } else if (wallClass === 'noncompact') {
    Mn = (0.021 * E / lambda + Fy) * S;
    html += `<p>For sections with noncompact walls</p>
             <p>${Mn_} = (0.021 ${E_} / ${lambda_} + ${Fy_}) ${S_} = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else if (wallClass === 'slender') {
    const Fcr = 0.33 * E / lambda;
    html += `<p>For sections with slender walls</p>
             <p>${Fcr_} = 0.33 ${E_} / ${lambda_} = ${Fcr.toFixed(2)} ksi</p>`;
    Mn = Fcr * S;
    html += `<p>${Mn_} = ${Fcr_} ${S_} = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else {
    return [Mn, html];
  }
}

// F9 Tees and Double Angles Loaded in the Plane of Symmetry

// F9.1 Yielding
function F9_1Yielding(shapeType, Fy, Zx, Sx) {
  let Mp_pos = 0;
  let Mp_neg = 0;
  let html_pos = '';
  let html_neg = '';

  [Mp_pos, html_pos] = F9_1YieldingSagging(shapeType, Fy, Zx, Sx);
  [Mp_neg, html_neg] = F9_1YieldingHogging(shapeType, Fy, Sx);
  return [Mp_pos, Mp_neg, html_pos + html_neg];
}
// F9.1 (a) for tee stems and web legs in tension, sagging
function F9_1YieldingSagging(shapeType, Fy, Zx, Sx) {
  let Mp = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in tension (sagging)</strong></p>`;
  } else if (['2L'].includes(shapeType)) {
    html += `<p><strong>For double angles with web legs in tension (sagging)</strong></p>`;
  }

  const My = Fy * Sx;
  html += `<p>Yield moment</p>
           <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>`;

  Mp = Fy * Zx;
  html += `<p>${Mp_} = ${Fy_} ${Zx_} = ${Mp.toFixed(2)} k-in &le; 1.6 ${My_}</p>`;
  Mp = Math.min(Mp, 1.6 * My);
  html += `<p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
  return [Mp, html];
}
// F9.1 (b) for tee stems in compression, hogging
//      (c) for double angles with web legs in compression, hogging
function F9_1YieldingHogging(shapeType, Fy, Sx) {
  let Mp = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in compression (hogging)</strong></p>`;
  } else if (['2L'].includes(shapeType)) {
    html += `<p><strong>For double angles with web legs in compression (hogging)</strong></p>`;
  }

  const My = Fy * Sx;
  html += `<p>Yield moment</p>
           <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>`;

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    Mp = My;
    html += `<p>${Mp_} = ${My_} = ${Mp.toFixed(2)} k-in</p>
             <p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
    return [Mp, html];

  } else if (['2L'].includes(shapeType)) {
    Mp = 1.5 * My;
    html += `<p>${Mp_} = 1.5 ${My_} = ${Mp.toFixed(2)} k-in</p>
             <p>${Mp_} = ${Mp.toFixed(1)} k-in</p>`;
    return [Mp, html];

  } else {
    return [Mp, html];
  }
}

// F9.2 Lateral-Torsional Buckling
function F9_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, d, Sx, Iy, ry, J, Lb) {
  let Mn_pos = 0;
  let Mn_neg = 0;
  let html_pos = '';
  let html_neg = '';

  [Mn_pos, html_pos] = F9_2LateralTorsionalBucklingSagging(shapeType, Mp, Fy, E, d, Sx, Iy, ry, J, Lb);
  [Mn_neg, html_neg] = F9_2LateralTorsionalBucklingHogging(shapeType, Fy, E, d, Sx, Iy, J, Lb);
  return [Mn_pos, Mn_neg, html_pos + html_neg];
}
// F9.2 (a) for tee stems and web legs in tension, sagging
function F9_2LateralTorsionalBucklingSagging(shapeType, Mp, Fy, E, d, Sx, Iy, ry, J, Lb) {
  let Mn = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in tension (sagging)</strong></p>`;
  } else if (['2L'].includes(shapeType)) {
    html += `<p><strong>For double angles with web legs in tension (sagging)</strong></p>`;
  }

  // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
  const Lp = 1.76 * ry * Math.sqrt(E / Fy);
  html += `<p>Limiting laterally unbraced length for the limit state of yielding</p>
           <p>${Lp_} = 1.76 ${ry_} &radic;(${E_} / ${Fy_}) = ${Lp.toFixed(1)} in. = ${(Lp / 12).toFixed(1)} ft</p>`;

  if (Lb <= Lp) {
    // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
    html += `<p>${Lb_} &le; ${Lp_}, lateral-torsional buckling does not apply</p>`;
    return [Mn, html];

  } else {
    // let J = 0;
    // if (['WT', 'MT', 'ST'].includes(shapeType)) {
    //   J = J;
    // } else if (['2L'].includes(shapeType)) {
    //   J = 0;  // helper function is needed here to find J for 2L
    // }

    // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
    const Lr = 1.95 * (E / Fy) * Math.sqrt(Iy * J) / Sx * Math.sqrt(2.36 * (Fy / E) * d * Sx / J + 1);
    html += `<p>Limiting laterally unbraced length for the limit state of inelastic lateral-torsional buckling</p>
             <p>${Lr_} = 1.95 (${E_} / ${Fy_}) &radic;(${Iy_} ${J_}) / ${Sx_} &radic;(2.36 (${Fy_} / ${E_}) ${d_}${Sx_} / ${J_} + 1) = ${Lr.toFixed(1)} in. = ${(Lr / 12).toFixed(1)} ft</p>`;

    if (Lb <= Lr) {
      // (b) when Lp < Lb ≤ Lr
      html += `<p>${Lp_} &lt; ${Lb_} &le; ${Lr_}</p>`;

      const My = Fy * Sx;
      html += `<p>Yield moment</p>
               <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>`;

      Mn = Mp - (Mp - My) * (Lb - Lp) / (Lr - Lp);
      html += `<p>${Mn_} = ${Mp_} - (${Mp_} - ${My_}) (${Lb_} - ${Lp_}) / (${Lr_} - ${Lp_}) = ${Mn.toFixed(2)} k-in</p>
               <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];

    } else {
      // (c) when Lb > Lr
      html += `<p>${Lb_} &gt; ${Lr_}</p>`;

      const B = 2.3 * (d / Lb) * Math.sqrt(Iy / J);
      html += `<p>${B_} = 2.3 (${d_} / ${Lb_}) &radic;(${Iy_} / ${J_}) = ${B.toFixed(2)}</p>`;

      const Mcr = 1.95 * E / Lb * Math.sqrt(Iy * J) * (B + Math.sqrt(1 + B**2));
      html += `<p>${Mcr_} = 1.95 ${E_} / ${Lb_} &radic;(${Iy_} ${J_}) (${B_} + &radic;(1 + ${B_}<sup>2</sup>)) = ${Mcr.toFixed(2)} k-in</p>`;
      Mn = Mcr;
      html += `<p>${Mn_} = ${Mcr_} = ${Mn.toFixed(2)} k-in</p>
               <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];
    }
  }
}
// F9.2 (b) for stems and web legs in compression anywhere along the unbraced length, hogging
// F9.2 (b) does NOT have explicit criteria for whether LTB applies
function F9_2LateralTorsionalBucklingHogging(shapeType, Fy, E, d, Sx, Iy, J, Lb) {
  let Mn = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in compression (hogging)</strong></p>`;
  } else if (['2L'].includes(shapeType)) {
    html += `<p><strong>For double angles with web legs in compression (hogging)</strong></p>`;
  }

  if (Lb > 0) {
    const My = Fy * Sx;
    html += `<p>Yield moment</p>
             <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>`;

    // let J = 0;
    // if (['WT', 'MT', 'ST'].includes(shapeType)) {
    //   J = J_;
    // } else if (['2L'].includes(shapeType)) {
    //   J = 0;  // helper function is needed here to find J for 2L
    // }

    const B = -2.3 * (d / Lb) * Math.sqrt(Iy / J);
    html += `<p>${B_} = -2.3 (${d_} / ${Lb_}) &radic;(${Iy_} / ${J_}) = ${B.toFixed(2)}</p>`;
    const Mcr = 1.95 * E / Lb * Math.sqrt(Iy * J) * (B + Math.sqrt(1 + B**2));
    html += `<p>${Mcr_} = 1.95 ${E_} / ${Lb_} &radic;(${Iy_} ${J_}) (${B_} + &radic;(1 + ${B_}<sup>2</sup>)) = ${Mcr.toFixed(2)} k-in</p>`;
    
    if (['WT', 'MT', 'ST'].includes(shapeType)) {
      Mn = Mcr;
      html += `<p>${Mn_} = ${Mcr_} = ${Mn.toFixed(2)} k-in &le; ${My_}</p>`;
      Mn = Math.min(Mn, My);
      html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
      return [Mn, html];
    
    // } else if (['2L'].includes(shapeType)) {
    //   if (My / Mcr <= 1.0) {
    //     const Mn = (1.92 - 1.17 * Math.sqrt(My / Mcr)) * My;
    //     if (Mn <= 1.5 * My) {
    //       return Mn;
    //     } else {
    //       return 1.5 * My;
    //     }
    //   } else {
    //     return (0.92 - 0.17 * Mcr / My) * Mcr;
    //   }

    } else {
      return [Mn, html];
    }

  } else {
    html += `<p>For sections with continuous bracing, lateral-torsional buckling does not apply</p>`;
    return [Mn, html];
  }
}

// F9.3 Flange Local Buckling of Tees and Double-Angle Legs
function F9_3FlangeLocalBuckling(shapeType, Mp, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flangeClass) {
  let Mn_pos = 0;
  let Mn_neg = 0;
  let html_pos = '';
  let html_neg = '';

  [Mn_pos, html_pos] = F9_3FlangeLocalBucklingSagging(shapeType, Mp, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flangeClass);
  return [Mn_pos, Mn_neg, html_pos + html_neg];
}
// F9.3 only applies for tee stems and web legs in tension (sagging)
function F9_3FlangeLocalBucklingSagging(shapeType, Mp, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flangeClass) {
  let Mn = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in tension (sagging)</strong></p>`;

    if (flangeClass === 'compact') {
      html += `<p>For sections with compact flanges, flange local buckling does not apply</p>`;
      return [Mn, html];

    } else {
      // elastic section modulus referred to compression flange, in.3 (mm3)
      const Sxc = Ix / y;

      if (flangeClass === 'noncompact') {
        html += `<p>For sections with noncompact flanges</p>
                 <p>Elastic section modulus referred to compression flange</p>
                 <p>${Sxc_} = ${Ix_} / ${y_} = ${Sxc.toFixed(2)} in.<sup>3</sup></p>`;

        const My = Fy * Sx;
        html += `<p>Yield moment</p>
                 <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>`;

        Mn = Mp - (Mp - 0.7 * Fy * Sxc) * (lambdaf - lambdapf) / (lambdarf - lambdapf);
        html += `<p>${Mn_} = ${Mp_} - (${Mp_} - 0.7 ${Fy_} ${Sxc_}) (${lambdaf_} - ${lambdapf_}) / (${lambdarf_} - ${lambdapf_}) = ${Mn.toFixed(2)} k-in &le; 1.6 ${My_}</p>`;
        Mn = Math.min(Mn, 1.6 * My);
        html += `<p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
        return [Mn, html];

      } else if (flangeClass === 'slender') {
        html += `<p>For sections with slender flanges</p>
                 <p>Elastic section modulus referred to compression flange</p>
                 <p>${Sxc_} = ${Ix_} / ${y_} = ${Sxc.toFixed(2)} in.<sup>3</sup></p>`;

        Mn = 0.7 * E * Sxc / lambdaf**2;
        html += `<p>${Mn_} = 0.7 ${E_} ${Sxc_} / ${lambdaf_}<sup>2</sup> = ${Mn.toFixed(2)} k-in</p>
                 <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
        return [Mn, html];

      } else {
        return [Mn, html];
      }
    }
  } else if (['2L'].includes(shapeType)) {
    return [Mn, html];                               // call function F10_3

  } else {
    return [Mn, html];
  }
}

// F9.4 Local Buckling of Tee Stems and Double-Angle Web Legs in Flexural Compression
function F9_4WebLocalBuckling(shapeType, Fy, E, Sx, lambdaw, webClass) {
  let Mn_pos = 0;
  let Mn_neg = 0;
  let html_pos = '';
  let html_neg = '';

  [Mn_neg, html_neg] = F9_4WebLocalBucklingHogging(shapeType, Fy, E, Sx, lambdaw, webClass);
  return [Mn_pos, Mn_neg, html_pos + html_neg];
}
// F9.4 only applies for tee stems and web legs in compression (hogging)
function F9_4WebLocalBucklingHogging(shapeType, Fy, E, Sx, lambdaw, webClass) {
  let Mn = 0;
  let html = '';

  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    html += `<p><strong>For tee stems in compression (hogging)</strong></p>`;

    const calcTerm1 = Math.sqrt(E / Fy);
    const calcTerm1_ = `&radic;(${E_} / ${Fy_})`;

    let Fcr = 0;
    if (webClass === 'compact') {
      // (1) when lambdaw ≤ 0.84 sqrt(E / Fy), compact
      html += `<p>For sections with compact stems</p>`;
      Fcr = Fy;
      html += `<p>${Fcr_} = ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;

    } else if (webClass === 'noncompact') {
      // (2) when 0.84 sqrt(E / Fy) < lambdaw ≤ 1.52 sqrt(E / Fy), noncompact
      html += `<p>For sections with noncompact stems</p>`;
      Fcr = (1.43 - 0.515 * lambdaw / calcTerm1) * Fy;
      html += `<p>${Fcr_} = (1.43 - 0.515 ${lambdaw_} &radic;(${Fy_} / ${E_})) ${Fy_} = ${Fcr.toFixed(2)} ksi</p>`;

    } else if (webClass === 'slender') {
      // (3) when lambdaw > 1.52 sqrt(E / Fy), slender
      html += `<p>For sections with slender stems</p>`;
      Fcr = 1.52 * E / lambdaw**2;
      html += `<p>${Fcr_} = 1.52 ${E_} / ${lambdaw_}<sup>2</sup> = ${Fcr.toFixed(2)} ksi</p>`;
    }

    Mn = Fcr * Sx;
    html += `<p>${Mn_} = ${Fcr_} ${Sx_} = ${Mn.toFixed(2)} k-in</p>
             <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
    return [Mn, html];

  } else if (['2L'].includes(shapeType)) {
    return [Mn, html];                               // call function F10_3

  } else {
    return [Mn, html];
  }
}

// F10 Single Angles​

// F10.1 Yielding
function F10_1Yielding(Fy, Sx) {
  const My = Fy * Sx;
  const Mn = 1.5 * My;
  const html = `<p>Yield moment</p>
                <p>${My_} = ${Fy_} ${Sx_} = ${My.toFixed(2)} k-in</p>
                <p>${Mn_} = 1.5 ${My_} = ${Mn.toFixed(2)} k-in</p>
                <p>${Mn_} = ${Mn.toFixed(1)} k-in</p>`;
  return [Mn, html];
}

// F11 Rectangular Bars and Rounds

// F12 Unsymmetrical Shapes


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
// flexure calc variable notation
const Lb_ = 'L<sub>b</sub>';
const Lp_ = 'L<sub>p</sub>';
const Lr_ = 'L<sub>r</sub>';
const Cb_ = 'C<sub>b</sub>';
const Fcr_ = 'F<sub>cr</sub>';
const lambda_ = '&lambda;';
const lambdaf_ = '&lambda;<sub>f</sub>';
const lambdapf_ = '&lambda;<sub>pf</sub>';
const lambdarf_ = '&lambda;<sub>rf</sub>';
const lambdaw_ = '&lambda;<sub>w</sub>';
const lambdapw_ = '&lambda;<sub>pw</sub>';
const lambdarw_ = '&lambda;<sub>rw</sub>';
const be_ = 'b<sub>e</sub>';
const he_ = 'h<sub>e</sub>';
const Ixe_ = 'I<sub>x,e</sub>';
const Iye_ = 'I<sub>y,e</sub>';
const Sxe_ = 'S<sub>x,e</sub>';
const Sye_ = 'S<sub>y,e</sub>';
const aw_ = 'a<sub>w</sub>';
const Rpg_ = 'R<sub>pg</sub>';
const kc_ = 'k<sub>c</sub>';
const Sxc_ = 'S<sub>xc</sub>';
const My_ = 'M<sub>y</sub>';
const Mcr_ = 'M<sub>cr</sub>';
const Mp_ = 'M<sub>p</sub>';
const Mn_ = 'M<sub>n</sub>';