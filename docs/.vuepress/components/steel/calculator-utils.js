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
    } else if (['HSS Rect.'].includes(shapeType)) {
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
    } else if (['HSS Rect.'].includes(shapeType)) {
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
    } else if (['HSS Rect.'].includes(shapeType)) {
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
    } else if (['HSS Rect.'].includes(shapeType)) {
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
export function majorFlexureCalculator(shapeData, shapeType, astmSpecProp, slenderClass, Cb, Lb) {
  if (shapeData && shapeType && astmSpecProp && slenderClass && Cb) {
    const { flange, web } = slenderClass;

    let result = {
      'Mn_2_1': 0,
    };

    if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType) && flange === 'compact' && web === 'compact') {
      // F2
      // limit state: Y, LTB
      
      const { Fy } = astmSpecProp;
      const { Zx } = shapeData;



      // F2.1 Yielding
      result['Mn_2_1'] = F2_1Yielding(Fy, Zx);


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
  } else if (['HSS Rect.'].includes(shapeType)) {
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
function F2_2LateralTorsionalBuckling() {
  return null;
}