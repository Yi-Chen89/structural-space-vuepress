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

    let flangeSlenderRatio = null;
    let webSlenderRatio = null;

    let flange = null;
    let web = null;

    if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['bf/2tf'];
      webSlenderRatio = shapeSlenderRatio['h/tw'];
    } else if (['C', 'MC'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['b/t'];
      webSlenderRatio = shapeSlenderRatio['h/tw'];
    } else if (['L', '2L'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['b/t'];
    } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['bf/2tf'];
      webSlenderRatio = shapeSlenderRatio['D/t'];
    } else if (['HSS Rect.'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['b/tdes'];
      webSlenderRatio = shapeSlenderRatio['h/tdes'];
    } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
      flangeSlenderRatio = shapeSlenderRatio['D/t'];
    }

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




// helper function
function flexureElementClassifier(slenderRatio, compactLimitRatio, noncompactLimitRatio) {
  if (slenderRatio <= compactLimitRatio) {
    return 'compact';
  } else if (slenderRatio <= noncompactLimitRatio) {
    return 'noncompact';
  } else {
    return 'slender';
  }
}
