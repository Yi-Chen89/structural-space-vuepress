// A360 Chapter F

export function majorFlexureCalculator(shapeData, shapeType, astmSpecProp, shapeSlenderRatio, shapeTypeSlenderLimitRatio, slenderClass, Lb, Cb) {
  if (shapeData && shapeType && astmSpecProp && shapeSlenderRatio && shapeTypeSlenderLimitRatio && slenderClass && Cb) {
    const { Fy, E } = astmSpecProp;
    const { flange, web } = slenderClass;

    let result = {
      'Mn_2_1': {'isApplicable': false, 'value': 0},
      'Mn_2_2': {'isApplicable': false, 'value': 0},
      'Mn_3_2': {'isApplicable': false, 'value': 0},
      'Mn_7_1': {'isApplicable': false, 'value': 0},
      'Mn_7_2': {'isApplicable': false, 'value': 0},
      'Mn_7_3': {'isApplicable': false, 'value': 0},
      'Mn_7_4': {'isApplicable': false, 'value': 0},
      'Mn_8_1': {'isApplicable': false, 'value': 0},
      'Mn_8_2': {'isApplicable': false, 'value': 0},
      'Mn_9_1+': {'isApplicable': false, 'value': 0},
      'Mn_9_1-': {'isApplicable': false, 'value': 0},
      'Mn_9_2+': {'isApplicable': false, 'value': 0},
      'Mn_9_2-': {'isApplicable': false, 'value': 0},
      'Mn_9_3+': {'isApplicable': false, 'value': 0},
      'Mn_9_4-': {'isApplicable': false, 'value': 0},
      'Mn_10_1': {'isApplicable': false, 'value': 0},
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType) && flange === 'compact' && web === 'compact') {
      // F2
      // limit state: Y, LTB
      
      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;

      // F2.1 Yielding
      result['Mn_2_1']['isApplicable'] = true;
      const Mp = F2_1Yielding(Fy, Zx);
      result['Mn_2_1']['value'] = Mp;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2']['isApplicable'] = true;
      result['Mn_2_2']['value'] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);

    } else if (['W', 'M', 'S', 'HP'].includes(shapeType) && ['noncompact', 'slender'].includes(flange) && web === 'compact') {
      // F3
      // limit state: LTB, FLB

      const { Zx, Sx, Iy, ry, J, Cw, rts, ho } = shapeData;
      const { 'bf/2tf': lambdaf, 'h/tw': lambdaw } = shapeSlenderRatio;
      const { lambdapf, lambdarf } = shapeTypeSlenderLimitRatio;
      
      // F2.1 Yielding
      result['Mn_2_1']['isApplicable'] = true;
      const Mp = F2_1Yielding(Fy, Zx);
      result['Mn_2_1']['value'] = Mp;

      // F2.2 Lateral-Torsional Buckling
      result['Mn_2_2']['isApplicable'] = true;
      result['Mn_2_2']['value'] = F2_2LateralTorsionalBuckling(shapeType, Mp, Fy, E, Sx, Iy, ry, J, Cw, rts, ho, Lb, Cb);

      // F3.2 Compression Flange Local Buckling
      result['Mn_3_2']['isApplicable'] = true;
      result['Mn_3_2']['value'] = F3_2CompressionFlangeLocalBuckling(Mp, Fy, E, Sx, lambdaf, lambdaw, lambdapf, lambdarf, flange);

    } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
      // F7
      // limit state: Y, FLB, WLB, LTB

      const { A, Ht, h, b, tdes, Ix, Zx, Sx, ry, J } = shapeData;

      // F7.1 Yielding
      result['Mn_7_1']['isApplicable'] = true;
      const Mp = F7_1Yielding(Fy, Zx);
      result['Mn_7_1']['value'] = Mp;

      // F7.2 Flange Local Buckling
      result['Mn_7_2']['isApplicable'] = true;
      result['Mn_7_2']['value'] = F7_2FlangeLocalBuckling(Mp, Fy, E, Ht, b, tdes, Ix, Sx, flange);

      // F7.3 Web Local Buckling
      result['Mn_7_3']['isApplicable'] = true;
      result['Mn_7_3']['value'] = F7_3WebLocalBuckling(Mp, Fy, E, h, b, tdes, tdes, Sx, web);

      // F7.4 Lateral-Torsional Buckling
      // F7.4 does not apply to square sections
      if (shapeType === 'HSS Rect.') {
        result['Mn_7_4']['isApplicable'] = true;
        result['Mn_7_4']['value'] = F7_4LateralTorsionalBuckling(Mp, Fy, E, A, Sx, ry, J, Lb, Cb);
      }

    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      // F8
      // limit state: Y, LB
      // F8 only applies to round HSS with D/t < 0.45E/Fy

      const { 'D/t': lambda } = shapeSlenderRatio;

      if (lambda < 0.45 * E * Fy) {
        const { Zx, Sx } = shapeData;

        // F8.1 Yielding
        result['Mn_8_1']['isApplicable'] = true;
        const Mp = F8_1Yielding(Fy, Zx);
        result['Mn_8_1']['value'] = Mp;

        // F8.2 Local Buckling
        result['Mn_8_2']['isApplicable'] = true;
        result['Mn_8_2']['value'] = F8_2LocalBuckling(Fy, E, Sx, lambda, flange);
      }

    } else if (['WT', 'MT', 'ST', '2L'].includes(shapeType)) {
      // F9
      // limit state: Y, LTB, FLB, WLB

      const { d, y, Ix, Zx, Sx, Iy, ry, J } = shapeData;
      const { 'bf/2tf': lambdaf, 'D/t': lambdaw } = shapeSlenderRatio;
      const { lambdapf, lambdarf } = shapeTypeSlenderLimitRatio;

      // F9.1 Yielding
      // F9.1 (a) for tee stems and web legs in tension, sagging
      result['Mn_9_1+']['isApplicable'] = true;
      const Mp_pos = F9_1YieldingSagging(Fy, Zx, Sx);
      result['Mn_9_1+']['value'] = Mp_pos;
      // F9.1 (b) for tee stems in compression, hogging
      //      (c) for double angles with web legs in compression, hogging
      result['Mn_9_1-']['isApplicable'] = true;
      const Mp_neg = F9_1YieldingHogging(shapeType, Fy, Sx);
      result['Mn_9_1-']['value'] = Mp_neg;

      // F9.2 Lateral-Torsional Buckling
      // F9.2 (a) for tee stems and web legs in tension, sagging
      result['Mn_9_2+']['isApplicable'] = true;
      result['Mn_9_2+']['value'] = F9_2LateralTorsionalBucklingSagging(shapeType, Mp_pos, Fy, E, d, Sx, Iy, ry, J, Lb);
      // F9.2 (b) for stems and web legs in compression anywhere along the unbraced length, hogging
      result['Mn_9_2-']['isApplicable'] = true;
      result['Mn_9_2-']['value'] = F9_2LateralTorsionalBucklingHogging(shapeType, Fy, E, d, Sx, Iy, J, Lb);

      // F9.3 Flange Local Buckling of Tees and Double-Angle Legs
      // only sagging
      result['Mn_9_3+']['isApplicable'] = true;
      result['Mn_9_3+']['value'] = F9_3FlangeLocalBuckling(shapeType, Mp_pos, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flange);

      // F9.4 Local Buckling of Tee Stems and Double-Angle Web Legs in Flexural Compression
      // only hogging
      result['Mn_9_4-']['isApplicable'] = true;
      result['Mn_9_4-']['value'] = F9_4WebLocalBuckling(shapeType, Fy, E, Sx, lambdaw);

    } else if (['L'].includes(shapeType)) {
      // F10
      // limit state: Y, LTB, LLB

      const { Sx } = shapeData;

      // F10.1 Yielding
      result['Mn_10_1']['isApplicable'] = true;
      const Mp = F10_1Yielding(Fy, Sx);
      result['Mn_10_1']['value'] = Mp;
    }
    return result;
  } else {
    return null;
  }
}

export function criticalResultProcessor(result) {
  if (result) {
    const resultAsList = Object.entries(result);

    // filter out objects with value = 0 or isApplicable is false
    const filteredResultAsList = resultAsList.filter(([key, item]) => item['isApplicable'] && item['value'] !== 0);

    if (filteredResultAsList.length > 0) {
      const [key, item] = filteredResultAsList.reduce((smallest, current) =>
        current[1]['value'] < smallest[1]['value'] ? current : smallest
      );

      return { [key]: item };
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

// F3 Doubly Symmetric I-Shaped Members with Compact Webs and Noncompact or Slender Flanges Bent about Their Major Axis

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

// F4 Other I-Shaped Members with Compact or Noncompact Webs Bent about Their Major Axis

// F5 Doubly Symmetric and Singly Symmetric I-Shaped Members with Slender Webs Bent about Their Major Axis

// F6 I-Shaped Members and Channels Bent about Their Minor Axis

// F7 Square and Rectangular HSS and Box Sections

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

// F8 Round HSS

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

// F9 Tees and Double Angles Loaded in the Plane of Symmetry

// F9.1 Yielding
// F9.1 (a) for tee stems and web legs in tension, sagging
function F9_1YieldingSagging(Fy, Zx, Sx) {
  const My = Fy * Sx;
  const Mp = Fy * Zx;
  if (Mp <= 1.6 * My) {
    return Mp;
  } else {
    return 1.6 * My;
  }
}
// F9.1 (b) for tee stems in compression, hogging
//      (c) for double angles with web legs in compression, hogging
function F9_1YieldingHogging(shapeType, Fy, Sx) {
  const My = Fy * Sx;
  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    return My;
  } else if (['2L'].includes(shapeType)) {
    return 1.5 * My;
  } else {
    return 0;
  }
}

// F9.2 Lateral-Torsional Buckling
// F9.2 (a) for tee stems and web legs in tension, sagging
function F9_2LateralTorsionalBucklingSagging(shapeType, Mp, Fy, E, d, Sx, Iy, ry, J_, Lb) {
  // Lp: limiting laterally unbraced length for the limit state of yielding, in. (mm)
  const Lp = 1.76 * ry * Math.sqrt(E / Fy);

  if (Lb <= Lp) {
    // (a) when Lb ≤ Lp, limit state of lateral-torsional buckling does not apply
    return 0;
  } else {
    let J = 0;
    if (['WT', 'MT', 'ST'].includes(shapeType)) {
      J = J_;
    } else if (['2L'].includes(shapeType)) {
      J = 0;  // helper function is needed here to find J for 2L
    }

    // Lr: limiting unbraced length for the limit state of inelastic lateral-torsional buckling, in. (mm)
    const Lr = 1.95 * (E / Fy) * Math.sqrt(Iy * J) / Sx * Math.sqrt(2.36 * (Fy / E) * d * Sx / J + 1);

    const My = Fy * Sx;

    // Mn
    if (Lb <= Lr) {
      // (b) when Lp < Lb ≤ Lr
      return Mp - (Mp - My) * (Lb - Lp) / (Lr - Lp);
    } else {
      // (c) when Lb > Lr
      const B = 2.3 * (d / Lb) * Math.sqrt(Iy / J);
      const Mcr = 1.95 * E / Lb * Math.sqrt(Iy * J) * (B + Math.sqrt(1 + B**2));
      return Mcr;
    }
  }
}
// F9.2 (b) for stems and web legs in compression anywhere along the unbraced length, hogging
// F9.2 (b) does NOT have explicit criteria for whether LTB applies
function F9_2LateralTorsionalBucklingHogging(shapeType, Fy, E, d, Sx, Iy, J_, Lb) {
  if (Lb > 0) {
    const My = Fy * Sx;

    let J = 0;
    if (['WT', 'MT', 'ST'].includes(shapeType)) {
      J = J_;
    } else if (['2L'].includes(shapeType)) {
      J = 0;  // helper function is needed here to find J for 2L
    }

    const B = -2.3 * (d / Lb) * Math.sqrt(Iy / J);
    const Mcr = 1.95 * E / Lb * Math.sqrt(Iy * J) * (B + Math.sqrt(1 + B**2));
    
    if (['WT', 'MT', 'ST'].includes(shapeType)) {
      if (Mcr <= My) {
        return Mcr;
      } else {
        return My;
      }
    } else if (['2L'].includes(shapeType)) {
      if (My / Mcr <= 1.0) {
        const Mn = (1.92 - 1.17 * Math.sqrt(My / Mcr)) * My;
        if (Mn <= 1.5 * My) {
          return Mn;
        } else {
          return 1.5 * My;
        }
      } else {
        return (0.92 - 0.17 * Mcr / My) * Mcr;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

// F9.3 Flange Local Buckling of Tees and Double-Angle Legs
function F9_3FlangeLocalBuckling(shapeType, Mp, Fy, E, y, Ix, Sx, lambdaf, lambdapf, lambdarf, flangeClass) {
  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    if (flangeClass === 'compact') {
      return 0;
    } else {
      // elastic section modulus referred to compression flange, in.3 (mm3)
      const Sxc = Ix / y;

      if (flangeClass === 'noncompact') {
        const My = Fy * Sx;
        const Mn = Mp - (Mp - 0.7 * Fy * Sxc) * (lambdaf - lambdapf) / (lambdarf - lambdapf);
        if (Mn <= 1.6 * My) {
          return Mn;
        } else {
          return 1.6 * My;
        }
      } else if (flangeClass === 'slender') {
        return 0.7 * E * Sxc / lambdaf**2;
      } else {
        return 0;
      }
    }
  } else if (['2L'].includes(shapeType)) {
    return 0;                               // call function F10_3
  } else {
    return 0;
  }
}

// F9.4 Local Buckling of Tee Stems and Double-Angle Web Legs in Flexural Compression
function F9_4WebLocalBuckling(shapeType, Fy, E, Sx, lambdaw) {
  if (['WT', 'MT', 'ST'].includes(shapeType)) {
    const calcTerm1 = Math.sqrt(E / Fy);
    let Fcr = 0;
    if (lambdaw <= 0.84 * calcTerm1) {
      Fcr = Fy;
    } else if (lambdaw <= 1.52 * calcTerm1) {
      Fcr = (1.43 - 0.515 * lambdaw / calcTerm1) * Fy;
    } else {
      Fcr = 1.52 * E / lambdaw**2;
    }
    return Fcr * Sx;
  } else if (['2L'].includes(shapeType)) {
    return 0;                               // call function F10_3
  } else {
    return 0;
  }
}

// F10 Single Angles​

// F10.1 Yielding
function F10_1Yielding(Fy, Sx) {
  const My = Fy * Sx;
  return 1.5 * My;
}

// F11 Rectangular Bars and Rounds

// F12 Unsymmetrical Shapes