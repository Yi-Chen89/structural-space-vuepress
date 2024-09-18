// A360 Chapter B

export function axialSlenderLimitRatioCalculator(shapeType, astmSpecProp) {
  // A360-16 B4 Table B4.1a
  if (shapeType && astmSpecProp) {
    const E = astmSpecProp['E'];
    const Fy = astmSpecProp['Fy'];
    const sqrtEonFy = Math.sqrt(E / Fy);
  
    // limiting slenderness for nonslender flange
    let lambdarf = 0;
  
    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
      // Table B4.1a Case 1
      lambdarf = 0.56 * sqrtEonFy;
    } else if (['L'].includes(shapeType)) {
      // Table B4.1a Case 3
      lambdarf = 0.45 * sqrtEonFy;
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // Table B4.1a Case 6
      lambdarf = 1.40 * sqrtEonFy;
    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // Table B4.1a Case 9
      lambdarf = 0.11 * (E / Fy);
    }
  
    // limiting slenderness for nonslender web
    let lambdarw = 0;
  
    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
      // Table B4.1a Case 5
      lambdarw = 1.49 * sqrtEonFy;
    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      // Table B4.1a Case 4
      lambdarw = 0.75 * sqrtEonFy;
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // Table B4.1a Case 6
      lambdarw = 1.40 * sqrtEonFy;
    }
  
    return {
      'lambdarf': lambdarf,
      'lambdarw': lambdarw,
    };
  } else {
    return null;
  }
}


export function axialSlenderClassifier(shapeType, shapeSlenderRatio, shapeTypeAxialSlenderLimitRatio) {
  // A360-16 B4 Table B4.1a
  if (shapeType && shapeSlenderRatio && shapeTypeAxialSlenderLimitRatio) {
    const flangeNonslenderLimitRatio = shapeTypeAxialSlenderLimitRatio['lambdarf'];
    const webNonslenderLimitRatio = shapeTypeAxialSlenderLimitRatio['lambdarw'];
  
    let flangeSlenderRatio = 0;
    let webSlenderRatio = 0;
  
    let flange = null;
    let web = null;

    [flangeSlenderRatio, webSlenderRatio] = slenderRatioFetcher(shapeType, shapeSlenderRatio);
  
    if (flangeSlenderRatio) {
      flange = axialElementClassifier(flangeSlenderRatio, flangeNonslenderLimitRatio);
    }
    if (webSlenderRatio) {
      web = axialElementClassifier(webSlenderRatio, webNonslenderLimitRatio);
    }
  
    return {
      'flange': flange,
      'web': web,
    };
  } else {
    return null;
  }
}


export function flexureSlenderLimitRatioCalculator(shapeType, astmSpecProp) {
  // A360-16 B4 Table B4.1b
  if (shapeType && astmSpecProp) {
    const E = astmSpecProp['E'];
    const Fy = astmSpecProp['Fy'];
    const sqrtEonFy = Math.sqrt(E / Fy);

    // limiting slenderness for compact flange
    let lambdapf = 0;
    // limiting slenderness for noncompact flange
    let lambdarf = 0;

    if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
      // Table B4.1b Case 10
      lambdapf = 0.38 * sqrtEonFy;
      lambdarf = 1.0 * sqrtEonFy;
    } else if (['L'].includes(shapeType)) {
      // Table B4.1b Case 12
      lambdapf = 0.54 * sqrtEonFy;
      lambdarf = 0.91 * sqrtEonFy;
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // Table B4.1b Case 17
      lambdapf = 1.12 * sqrtEonFy;
      lambdarf = 1.40 * sqrtEonFy;
    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // Table B4.1b Case 20
      lambdapf = 0.07 * (E / Fy);
      lambdarf = 0.31 * (E / Fy);
    }

    // limiting slenderness for compact web
    let lambdapw = 0;
    // limiting slenderness for noncompact web
    let lambdarw = 0;

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
      // Table B4.1b Case 15
      lambdapw = 3.76 * sqrtEonFy;
      lambdarw = 5.70 * sqrtEonFy;
    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      // Table B4.1b Case 14
      lambdapw = 0.84 * sqrtEonFy;
      lambdarw = 1.52 * sqrtEonFy;
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // Table B4.1b Case 19
      lambdapw = 2.42 * sqrtEonFy;
      lambdarw = 5.70 * sqrtEonFy;
    }

    return {
      'lambdapf': lambdapf,
      'lambdarf': lambdarf,
      'lambdapw': lambdapw,
      'lambdarw': lambdarw,
    };
  } else {
    return null;
  }
}


export function flexureSlenderClassifier(shapeType, shapeSlenderRatio, shapeTypeFlexureSlenderLimitRatio) {
  // A360-16 B4 Table B4.1b
  if (shapeType && shapeSlenderRatio && shapeTypeFlexureSlenderLimitRatio) {
    const flangeCompactLimitRatio = shapeTypeFlexureSlenderLimitRatio['lambdapf'];
    const flangeNoncompactLimitRatio = shapeTypeFlexureSlenderLimitRatio['lambdarf'];
    const webCompactLimitRatio = shapeTypeFlexureSlenderLimitRatio['lambdapw'];
    const webNoncompactLimitRatio = shapeTypeFlexureSlenderLimitRatio['lambdarw'];

    let flangeSlenderRatio = 0;
    let webSlenderRatio = 0;

    let flange = null;
    let web = null;

    [flangeSlenderRatio, webSlenderRatio] = slenderRatioFetcher(shapeType, shapeSlenderRatio);

    if (flangeSlenderRatio) {
      flange = flexureElementClassifier(flangeSlenderRatio, flangeCompactLimitRatio, flangeNoncompactLimitRatio);
    }
    if (webSlenderRatio) {
      web = flexureElementClassifier(webSlenderRatio, webCompactLimitRatio, webNoncompactLimitRatio);
    }

    return {
      'flange': flange,
      'web': web,
    };
  } else {
    return null;
  }
}


// A360 Chapter F
export function majorFlexureCalculator(shapeData, shapeType, astmSpecProp, shapeSlenderRatio, shapeTypeSlenderLimitRatio, slenderClass, Lb, Cb) {
  if (shapeData && shapeType && astmSpecProp && shapeSlenderRatio && shapeTypeSlenderLimitRatio && slenderClass && Cb) {
    const { flange, web } = slenderClass;

    let result = {
      'Mn_2_1': 0,
      'Mn_2_2': 0,
      'Mn_3_2': 0,
      'Mn_7_1': 0,
      'Mn_7_2': 0,
      'Mn_7_3': 0,
      'Mn_7_4': 0,
      'Mn_8_1': 0,
      'Mn_8_2': 0,
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType) && flange === 'compact' && web === 'compact') {
      // F2
      // limit state: Y, LTB
      
      const { Fy, E } = astmSpecProp;
      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;

      // F2.1 Yielding
      const Mp = F2_1Yielding(Fy, Zx);
      result['Mn_2_1'] = Mp;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2'] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);
    } else if (['W', 'M', 'S', 'HP'].includes(shapeType) && ['noncompact', 'slender'].includes(flange) && web === 'compact') {
      // F3
      // limit state: LTB, FLB

      const { Fy, E } = astmSpecProp;
      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;
      const { 'bf/2tf': lambdaf, 'h/tw': lambdaw } = shapeSlenderRatio;
      const { lambdapf, lambdarf } = shapeTypeSlenderLimitRatio;
      
      // F2.1 Yielding
      const Mp = F2_1Yielding(Fy, Zx);
      result['Mn_2_1'] = Mp;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2'] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);

      // F3.2 Compression Flange Local Buckling
      result['Mn_3_2'] = F3_2CompressionFlangeLocalBuckling(Mp, Fy, E, Sx, lambdaf, lambdaw, lambdapf, lambdarf, flange);
    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // F7
      // limit state: Y, FLB, WLB, LTB

      const { Fy, E } = astmSpecProp;
      const { A, Ht, h, b, tdes, Ix, Zx, Sx, ry, J } = shapeData;

      // F7.1 Yielding
      const Mp = F7_1Yielding(Fy, Zx);
      result['Mn_7_1'] = Mp;

      // F7.2 Flange Local Buckling
      result['Mn_7_2'] = F7_2FlangeLocalBuckling(Mp, Fy, E, Ht, b, tdes, Ix, Sx, flange);

      // F7.3 Web Local Buckling
      result['Mn_7_3'] = F7_3WebLocalBuckling(Mp, Fy, E, h, b, tdes, tdes, Sx, web);

      // F7.4 Lateral-Torsional Buckling
      // F7.4 does not apply to square sections
      if (shapeType === 'HSS Rect.') {
        result['Mn_7_4'] = F7_4LateralTorsionalBuckling(Mp, Fy, E, A, Sx, ry, J, Lb, Cb);
      }
    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // F8
      // limit state: Y, LB
      // F8 only applies to round HSS with D/t < 0.45E/Fy

      const { Fy, E } = astmSpecProp;
      const { 'D/t': lambda } = shapeSlenderRatio;

      if (lambda < 0.45 * E * Fy) {
        const { Zx, Sx } = shapeData;

        // F8.1 Yielding
        const Mp = F8_1Yielding(Fy, Zx);
        result['Mn_8_1'] = Mp;

        // F8.2 Local Buckling
        result['Mn_8_2'] = F8_2LocalBuckling(Fy, E, Sx, lambda, flange);
      }
    }
    return result;
  } else {
    return null;
  }
}


// helper function
function slenderRatioFetcher(shapeType, shapeSlenderRatio) {
  if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
    return [shapeSlenderRatio['bf/2tf'], shapeSlenderRatio['h/tw']];
  } else if (['C', 'MC'].includes(shapeType)) {
    return [shapeSlenderRatio['b/t'], shapeSlenderRatio['h/tw']];
  } else if (['L', '2L'].includes(shapeType)) {
    return [shapeSlenderRatio['b/t'], 0];
  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    return [shapeSlenderRatio['bf/2tf'], shapeSlenderRatio['D/t']];
  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    return [shapeSlenderRatio['b/tdes'], shapeSlenderRatio['h/tdes']];
  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    return [shapeSlenderRatio['D/t'], 0];
  }
}

function axialElementClassifier(slenderRatio, nonslenderLimitRatio) {
  if (slenderRatio <= nonslenderLimitRatio) {
    return 'nonslender';
  } else {
    return 'slender';
  }
}

function flexureElementClassifier(slenderRatio, compactLimitRatio, noncompactLimitRatio) {
  if (slenderRatio <= compactLimitRatio) {
    return 'compact';
  } else if (slenderRatio <= noncompactLimitRatio) {
    return 'noncompact';
  } else {
    return 'slender';
  }
}


// A360 Chapter F Helper Function
// F2.1 Yielding
function F2_1Yielding(Fy, Zx) {
  return Fy * Zx;
}

// F2.2 Lateral-Torsional Buckling
function F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb) {
  // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
  const Lp = 1.76 * ry * Math.sqrt(E / Fy);

  let Lr = 0;

  if (Lb <= Lp) {
    // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
    return 0;
  } else {
    // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
    const calcTerm1 = E / (0.7 * Fy);

    let c = 0;
    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      c = 1;
    } else if (['C', 'MC'].includes(shapeType)) {
      c = (ho / 2) * Math.sqrt(Iy / Cw);
    }
    const calcTerm2 = (J * c) / (Sx * ho);

    Lr = 1.95 * rts * calcTerm1 * Math.sqrt(calcTerm2 + Math.sqrt(calcTerm2**2 + 6.76 * (1 / calcTerm1)**2));

    // Mn
    if (Lb <= Lr) {
      // (b) when Lp < Lb ≤ Lr
      return Cb * (Mp - (Mp - 0.7 * Fy * Sx) * (Lb - Lp) / (Lr - Lp));
    } else {
      // (c) when Lb > Lr
      const calcTerm3 = (Lb / rts)**2;
      const Fcr = (Cb * Math.PI**2 * E / calcTerm3) * Math.sqrt(1 + 0.078 * calcTerm2 * calcTerm3);
      return Fcr * Sx;
    }
  }
}

// F3.2 Compression Flange Local Buckling
function F3_2CompressionFlangeLocalBuckling(Mp, Fy, E, Sx, lambdaf, lambdaw, lambdapf, lambdarf, flangeClass) {
  if (flangeClass === 'noncompact') {
    return Mp - (Mp - 0.7 * Fy * Sx) * (lambdaf - lambdapf) / (lambdarf - lambdapf);
  } else if (flangeClass === 'slender') {
    let kc = 4 / Math.sqrt(lambdaw);
    kc = Math.max(0.35, Math.min(kc, 0.76));
    return 0.9 * E * kc * Sx / lambdaf**2;
  } else {
    return 0;
  }
}


// F7.1 Yielding
function F7_1Yielding(Fy, Zx) {
  return Fy * Zx;
}

// F7.2 Flange Local Buckling
function F7_2FlangeLocalBuckling(Mp, Fy, E, H, b, tf, Ix, Sx, flangeClass) {
  if (flangeClass === 'compact') {
    return 0;
  } else {
    const calcTerm1 = b / tf;
    const calcTerm2 = Math.sqrt(Fy / E);

    if (flangeClass === 'noncompact') {
      return Mp - (Mp - Fy * Sx) * (3.57 * calcTerm1 * calcTerm2 - 4.0);
    } else if (flangeClass === 'slender') {
      const be = 1.92 * tf * (1/calcTerm2) * (1 - 0.38 / calcTerm1 * (1/calcTerm2));

      let Se = 0;
      if (be >= b) {
        Se = Sx;
      } else {
        // Simple and conservative approach to calculate effective I and S
        // removing ineffective width from top and bottom flanges
        const bineff = b - be;
        const Ieff = Ix - 2 * (bineff * tf**3 / 12 + bineff * tf * ((H - tf) / 2)**2);
        Se = Ieff / (H / 2);
      }
      return Fy * Se;
    } else {
      return 0;
    }
  }
}

// F7.3 Web Local Buckling
function F7_3WebLocalBuckling(Mp, Fy, E, h, b, tw, tf, Sx, webClass) {
  if (webClass === 'compact') {
    return 0;
  } else {
    const calcTerm1 = h / tw;
    const calcTerm2 = Math.sqrt(Fy / E);

    if (webClass === 'noncompact') {
      return Mp - (Mp - Fy * Sx) * (0.305 * calcTerm1 * calcTerm2 - 0.738);
    } else if (webClass === 'slender') {
      const aw = 2 * h * tw / (b * tf);

      // bending strength reduction factor
      let Rpg = 1 - aw / (1200 + 300 * aw) * (h / tw - 5.7 * (1/calcTerm2));
      // less than or equal to 1.0
      Rpg = Math.min(Rpg, 1.0);

      // (1) compression flange yielding
      const Mn_1 = Rpg * Fy * Sx;

      // (2) compression flange local buckling
      const kc = 4.0;
      const Fcr = 0.9 * E * kc / (b / tf)**2;

      let Mn_2 = 0;
      if (Fcr > Fy) {
        Mn_2 = Mn_1;
      } else {
        Mn_2 = Rpg * Fcr * Sx;
      }

      return Math.min(Mn_1, Mn_2);
    } else {
      return 0;
    }
  }
}

// F7.4 Lateral-Torsional Buckling
function F7_4LateralTorsionalBuckling(Mp, Fy, E, Ag, Sx, ry, J, Lb, Cb) {
  const calcTerm1 = Math.sqrt(J * Ag);

  // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
  const Lp = 0.13 * E * ry * calcTerm1 / Mp;

  if (Lb <= Lp) {
    // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
    return 0;
  } else {
    // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
    const Lr = 2 * E * ry * calcTerm1 / (0.7 * Fy * Sx);

    // Mn
    if (Lb <= Lr) {
      // (b) when Lp < Lb ≤ Lr
      return Cb * (Mp - (Mp - 0.7 * Fy * Sx) * (Lb - Lp) / (Lr - Lp));
    } else {
      // (c) when Lb > Lr
      return 2 * E * Cb * calcTerm1 / (Lb / ry);
    }
  }
}

// F8.1 Yielding
function F8_1Yielding(Fy, Zx) {
  return Fy * Zx;
}

// F8.2 Local Buckling
function F8_2LocalBuckling(Fy, E, Sx, lambda, wallClass) {
  if (wallClass === 'compact') {
    return 0;
  } else if (wallClass === 'noncompact') {
    return (0.021 * E / lambda + Fy) * Sx;
  } else if (wallClass === 'slender') {
    const Fcr = 0.33 * E / lambda;
    return Fcr * Sx;
  } else {
    return 0;
  }
}