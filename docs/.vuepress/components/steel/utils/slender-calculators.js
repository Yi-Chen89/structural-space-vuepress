// A360 Chapter B

export function axialSlenderClassifier(shapeType, astmSpecProp, shapeSlenderRatio) {
  // A360-16 B4 Table B4.1a
  if (shapeType && astmSpecProp && shapeSlenderRatio) {
    const result = {
      'flange': {
        'isApplicable': false,
        'notation': null,
        'ratio': {'notation': null, 'value': 0, 'html': null},
        'limit': {'notation': null, 'value': 0, 'html': null},
        'class': null,
      },
      'web': {
        'isApplicable': false,
        'notation': null,
        'ratio': {'notation': null, 'value': 0, 'html': null},
        'limit': {'notation': null, 'value': 0, 'html': null},
        'class': null,
      }
    };

    const ratio = slenderRatioParser(shapeType, shapeSlenderRatio);
    ['flange', 'web'].forEach(key => {
      result[key]['isApplicable'] = ratio[key]['isApplicable'];
      result[key]['notation'] = ratio[key]['notation'];
      result[key]['ratio']['notation'] = ratio[key]['ratio']['notation'];
      result[key]['ratio']['value'] = ratio[key]['ratio']['value'];
      result[key]['ratio']['html'] = ratio[key]['ratio']['html'];
    });
    const lambdaf = result['flange']['ratio']['value'];
    const lambdaw = result['web']['ratio']['value'];

    const limit = axialSlenderLimitRatioCalculator(shapeType, astmSpecProp);
    ['flange', 'web'].forEach(key => {
      result[key]['limit']['notation'] = limit[key]['limit']['notation'];
      result[key]['limit']['value'] = limit[key]['limit']['value'];
      result[key]['limit']['html'] = limit[key]['limit']['html'];
    });
    const lambdarf = result['flange']['limit']['value'];
    const lambdarw = result['web']['limit']['value'];

    if (result['flange']['isApplicable']) {
      result['flange']['class'] = axialElementClassifier(lambdaf, lambdarf);
    }
    if (result['web']['isApplicable']) {
      result['web']['class'] = axialElementClassifier(lambdaw, lambdarw);
    }
  
    return result;

  } else {
    return null;
  }
}

export function flexureSlenderClassifier(shapeType, astmSpecProp, shapeSlenderRatio) {
  // A360-16 B4 Table B4.1b
  if (shapeType && astmSpecProp && shapeSlenderRatio) {
    const result = {
      'flange': {
        'isApplicable': false,
        'notation': null,
        'ratio': {'notation': null, 'value': 0, 'html': null},
        'limit': {'compact': {'notation': null, 'value': 0, 'html': null}, 'noncompact': {'notation': null, 'value': 0, 'html': null}},
        'class': [null, null],
      },
      'web': {
        'isApplicable': false,
        'notation': null,
        'ratio': {'notation': null, 'value': 0, 'html': null},
        'limit': {'compact': {'notation': null, 'value': 0, 'html': null}, 'noncompact': {'notation': null, 'value': 0, 'html': null}},
        'class': [null, null],
      }
    };

    const ratio = slenderRatioParser(shapeType, shapeSlenderRatio);
    ['flange', 'web'].forEach(key => {
      result[key]['isApplicable'] = ratio[key]['isApplicable'];
      result[key]['notation'] = ratio[key]['notation'];
      result[key]['ratio']['notation'] = ratio[key]['ratio']['notation'];
      result[key]['ratio']['value'] = ratio[key]['ratio']['value'];
      result[key]['ratio']['html'] = ratio[key]['ratio']['html'];
    });
    const lambdaf = result['flange']['ratio']['value'];
    const lambdaw = result['web']['ratio']['value'];

    const limit = flexureSlenderLimitRatioCalculator(shapeType, astmSpecProp);
    ['flange', 'web'].forEach(key => {
      result[key]['limit']['compact']['notation'] = limit[key]['limit']['compact']['notation'];
      result[key]['limit']['compact']['value'] = limit[key]['limit']['compact']['value'];
      result[key]['limit']['compact']['html'] = limit[key]['limit']['compact']['html'];
      result[key]['limit']['noncompact']['notation'] = limit[key]['limit']['noncompact']['notation'];
      result[key]['limit']['noncompact']['value'] = limit[key]['limit']['noncompact']['value'];
      result[key]['limit']['noncompact']['html'] = limit[key]['limit']['noncompact']['html'];
    });
    const lambdapf = result['flange']['limit']['compact']['value'];
    const lambdarf = result['flange']['limit']['noncompact']['value'];
    const lambdapw = result['web']['limit']['compact']['value'];
    const lambdarw = result['web']['limit']['noncompact']['value'];

    if (result['flange']['isApplicable']) {
      result['flange']['class'][0] = flexureElementClassifier(lambdaf, lambdapf, lambdarf);
      if (['HSS Rect.'].includes(shapeType)) {
        result['flange']['class'][1] = flexureElementClassifier(lambdaw, lambdapf, lambdarf);
      } else {
        result['flange']['class'][1] = flexureElementClassifier(lambdaf, lambdapf, lambdarf);
      }
    }
    if (result['web']['isApplicable']) {
      result['web']['class'][0] = flexureElementClassifier(lambdaw, lambdapw, lambdarw);
      if (['HSS Rect.'].includes(shapeType)) {
        result['web']['class'][1] = flexureElementClassifier(lambdaf, lambdapw, lambdarw);
      } else {
        result['web']['class'][1] = flexureElementClassifier(lambdaw, lambdapw, lambdarw);
      }
    }

    return result;

  } else {
    return null;
  }
}


// Helper Function

function slenderRatioParser(shapeType, shapeSlenderRatio) {
  const result = {
    'flange': {
      'isApplicable': false,
      'notation': null,
      'ratio': {'notation': null, 'value': 0, 'html': null},
    },
    'web': {
      'isApplicable': false,
      'notation': null,
      'ratio': {'notation': null, 'value': 0, 'html': null},
    }
  };

  let lambdaf = 0;
  let lambdaw = 0;

  if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['bf/2tf'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Flange';
    result['flange']['ratio']['notation'] = `${lambdaf_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${bf_} / 2 ${tf_} = ${lambdaf.toFixed(2)}`;

    lambdaw = shapeSlenderRatio['h/tw'];
    result['web']['isApplicable'] = true;
    result['web']['notation'] = 'Web';
    result['web']['ratio']['notation'] = `${lambdaw_}`;
    result['web']['ratio']['value'] = lambdaw;
    result['web']['ratio']['html'] = `${h_} / ${tw_} = ${lambdaw.toFixed(2)}`;

  } else if (['C', 'MC'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['b/t'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Flange';
    result['flange']['ratio']['notation'] = `${lambdaf_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${b_} / ${t_} = ${lambdaf.toFixed(2)}`;

    lambdaw = shapeSlenderRatio['h/tw'];
    result['web']['isApplicable'] = true;
    result['web']['notation'] = 'Web';
    result['web']['ratio']['notation'] = `${lambdaw_}`;
    result['web']['ratio']['value'] = lambdaw;
    result['web']['ratio']['html'] = `${h_} / ${tw_} = ${lambdaw.toFixed(2)}`;

  } else if (['L', '2L'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['b/t'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Leg';
    result['flange']['ratio']['notation'] = `${lambda_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${b_} / ${t_} = ${lambdaf.toFixed(2)}`;

  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['bf/2tf'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Flange';
    result['flange']['ratio']['notation'] = `${lambdaf_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${bf_} / 2 ${tf_} = ${lambdaf.toFixed(2)}`;

    lambdaw = shapeSlenderRatio['D/t'];
    result['web']['isApplicable'] = true;
    result['web']['notation'] = 'Stem';
    result['web']['ratio']['notation'] = `${lambdaw_}`;
    result['web']['ratio']['value'] = lambdaw;
    result['web']['ratio']['html'] = `${d_} / ${t_} = ${lambdaw.toFixed(2)}`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['b/tdes'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Flange';
    result['flange']['ratio']['notation'] = `${lambdaf_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${b_} / ${tdes_} = ${lambdaf.toFixed(2)}`;

    lambdaw = shapeSlenderRatio['h/tdes'];
    result['web']['isApplicable'] = true;
    result['web']['notation'] = 'Web';
    result['web']['ratio']['notation'] = `${lambdaw_}`;
    result['web']['ratio']['value'] = lambdaw;
    result['web']['ratio']['html'] = `${h_} / ${tdes_} = ${lambdaw.toFixed(2)}`;

  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    lambdaf = shapeSlenderRatio['D/t'];
    result['flange']['isApplicable'] = true;
    result['flange']['notation'] = 'Wall';
    result['flange']['ratio']['notation'] = `${lambda_}`;
    result['flange']['ratio']['value'] = lambdaf;
    result['flange']['ratio']['html'] = `${OD_} / ${tdes_} = ${lambdaf.toFixed(2)}`;
  }

  return result;
}

function axialSlenderLimitRatioCalculator(shapeType, astmSpecProp) {
  const result = {
    'flange': {
      'limit': {'notation': null, 'value': 0, 'html': null},
    },
    'web': {
      'limit': {'notation': null, 'value': 0, 'html': null},
    },
  };

  // A360-16 B4 Table B4.1a
  const { E, Fy } = astmSpecProp;

  const calcTerm1 = Math.sqrt(E / Fy);
  const calcTerm1_ = `&radic;(${E_} / ${Fy_})`;

  // limiting slenderness for nonslender flange
  let lambdarf = 0;

  if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
    // Table B4.1a Case 1
    lambdarf = 0.56 * calcTerm1;
    result['flange']['limit']['notation'] = `${lambdarf_}`;
    result['flange']['limit']['value'] = lambdarf;
    result['flange']['limit']['html'] = `0.56 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['L'].includes(shapeType)) {
    // Table B4.1a Case 3
    lambdarf = 0.45 * calcTerm1;
    result['flange']['limit']['notation'] = `${lambdar_}`;
    result['flange']['limit']['value'] = lambdarf;
    result['flange']['limit']['html'] = `0.45 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    // Table B4.1a Case 6
    lambdarf = 1.40 * calcTerm1;
    result['flange']['limit']['notation'] = `${lambdarf_}`;
    result['flange']['limit']['value'] = lambdarf;
    result['flange']['limit']['html'] = `1.40 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    // Table B4.1a Case 9
    lambdarf = 0.11 * (E / Fy);
    result['flange']['limit']['notation'] = `${lambdar_}`;
    result['flange']['limit']['value'] = lambdarf;
    result['flange']['limit']['html'] = `0.11 (${E_} / ${Fy_}) = ${lambdarf.toFixed(2)}`;
  }

  // limiting slenderness for nonslender web
  let lambdarw = 0;

  if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
    // Table B4.1a Case 5
    lambdarw = 1.49 * calcTerm1;
    result['web']['limit']['notation'] = `${lambdarw_}`;
    result['web']['limit']['value'] = lambdarw;
    result['web']['limit']['html'] = `1.49 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;

  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    // Table B4.1a Case 4
    lambdarw = 0.75 * calcTerm1;
    result['web']['limit']['notation'] = `${lambdarw_}`;
    result['web']['limit']['value'] = lambdarw;
    result['web']['limit']['html'] = `0.75 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    // Table B4.1a Case 6
    lambdarw = 1.40 * calcTerm1;
    result['web']['limit']['notation'] = `${lambdarw_}`;
    result['web']['limit']['value'] = lambdarw;
    result['web']['limit']['html'] = `1.40 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;
  }

  return result;
}

function flexureSlenderLimitRatioCalculator(shapeType, astmSpecProp) {
  const result = {
    'flange': {
      'limit': {
        'compact': {'notation': null, 'value': 0, 'html': null},
        'noncompact': {'notation': null, 'value': 0, 'html': null},
      },
    },
    'web': {
      'limit': {
        'compact': {'notation': null, 'value': 0, 'html': null},
        'noncompact': {'notation': null, 'value': 0, 'html': null},
      },
    },
  };

  // A360-16 B4 Table B4.1b
  const { E, Fy } = astmSpecProp;

  const calcTerm1 = Math.sqrt(E / Fy);
  const calcTerm1_ = `&radic;(${E_} / ${Fy_})`;

  // limiting slenderness for compact flange
  let lambdapf = 0;
  // limiting slenderness for noncompact flange
  let lambdarf = 0;

  if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
    // Table B4.1b Case 10
    lambdapf = 0.38 * calcTerm1;
    result['flange']['limit']['compact']['notation'] = `${lambdapf_}`;
    result['flange']['limit']['compact']['value'] = lambdapf;
    result['flange']['limit']['compact']['html'] = `0.38 ${calcTerm1_} = ${lambdapf.toFixed(2)}`;

    lambdarf = 1.0 * calcTerm1;
    result['flange']['limit']['noncompact']['notation'] = `${lambdarf_}`;
    result['flange']['limit']['noncompact']['value'] = lambdarf;
    result['flange']['limit']['noncompact']['html'] = `1.0 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['L'].includes(shapeType)) {
    // Table B4.1b Case 12
    lambdapf = 0.54 * calcTerm1;
    result['flange']['limit']['compact']['notation'] = `${lambdap_}`;
    result['flange']['limit']['compact']['value'] = lambdapf;
    result['flange']['limit']['compact']['html'] = `0.54 ${calcTerm1_} = ${lambdapf.toFixed(2)}`;

    lambdarf = 0.91 * calcTerm1;
    result['flange']['limit']['noncompact']['notation'] = `${lambdar_}`;
    result['flange']['limit']['noncompact']['value'] = lambdarf;
    result['flange']['limit']['noncompact']['html'] = `0.91 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    // Table B4.1b Case 17
    lambdapf = 1.12 * calcTerm1;
    result['flange']['limit']['compact']['notation'] = `${lambdapf_}`;
    result['flange']['limit']['compact']['value'] = lambdapf;
    result['flange']['limit']['compact']['html'] = `1.12 ${calcTerm1_} = ${lambdapf.toFixed(2)}`;

    lambdarf = 1.40 * calcTerm1;
    result['flange']['limit']['noncompact']['notation'] = `${lambdarf_}`;
    result['flange']['limit']['noncompact']['value'] = lambdarf;
    result['flange']['limit']['noncompact']['html'] = `1.40 ${calcTerm1_} = ${lambdarf.toFixed(2)}`;

  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    // Table B4.1b Case 20
    lambdapf = 0.07 * (E / Fy);
    result['flange']['limit']['compact']['notation'] = `${lambdap_}`;
    result['flange']['limit']['compact']['value'] = lambdapf;
    result['flange']['limit']['compact']['html'] = `0.07 (${E_} / ${Fy_}) = ${lambdapf.toFixed(2)}`;

    lambdarf = 0.31 * (E / Fy);
    result['flange']['limit']['noncompact']['notation'] = `${lambdar_}`;
    result['flange']['limit']['noncompact']['value'] = lambdarf;
    result['flange']['limit']['noncompact']['html'] = `0.31 (${E_} / ${Fy_}) = ${lambdarf.toFixed(2)}`;
  }

  // limiting slenderness for compact web
  let lambdapw = 0;
  // limiting slenderness for noncompact web
  let lambdarw = 0;

  if (['W', 'M', 'S', 'HP', 'C', 'MC'].includes(shapeType)) {
    // Table B4.1b Case 15
    lambdapw = 3.76 * calcTerm1;
    result['web']['limit']['compact']['notation'] = `${lambdapw_}`;
    result['web']['limit']['compact']['value'] = lambdapw;
    result['web']['limit']['compact']['html'] = `3.76 ${calcTerm1_} = ${lambdapw.toFixed(2)}`;

    lambdarw = 5.70 * calcTerm1;
    result['web']['limit']['noncompact']['notation'] = `${lambdarw_}`;
    result['web']['limit']['noncompact']['value'] = lambdarw;
    result['web']['limit']['noncompact']['html'] = `5.70 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;

  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    // Table B4.1b Case 14
    lambdapw = 0.84 * calcTerm1;
    result['web']['limit']['compact']['notation'] = `${lambdapw_}`;
    result['web']['limit']['compact']['value'] = lambdapw;
    result['web']['limit']['compact']['html'] = `0.84 ${calcTerm1_} = ${lambdapw.toFixed(2)}`;

    lambdarw = 1.52 * calcTerm1;
    result['web']['limit']['noncompact']['notation'] = `${lambdarw_}`;
    result['web']['limit']['noncompact']['value'] = lambdarw;
    result['web']['limit']['noncompact']['html'] = `1.52 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;

  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    // Table B4.1b Case 19
    lambdapw = 2.42 * calcTerm1;
    result['web']['limit']['compact']['notation'] = `${lambdapw_}`;
    result['web']['limit']['compact']['value'] = lambdapw;
    result['web']['limit']['compact']['html'] = `2.42 ${calcTerm1_} = ${lambdapw.toFixed(2)}`;

    lambdarw = 5.70 * calcTerm1;
    result['web']['limit']['noncompact']['notation'] = `${lambdarw_}`;
    result['web']['limit']['noncompact']['value'] = lambdarw;
    result['web']['limit']['noncompact']['html'] = `5.70 ${calcTerm1_} = ${lambdarw.toFixed(2)}`;
  }

  return result;
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


// material notation
const Fy_ = 'F<sub>y</sub>';
const E_ = 'E';
// database variable notation
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

const lambda_ = '&lambda;';
const lambdap_ = '&lambda;<sub>p</sub>';
const lambdar_ = '&lambda;<sub>r</sub>';
const lambdaf_ = '&lambda;<sub>f</sub>';
const lambdapf_ = '&lambda;<sub>pf</sub>';
const lambdarf_ = '&lambda;<sub>rf</sub>';
const lambdaw_ = '&lambda;<sub>w</sub>';
const lambdapw_ = '&lambda;<sub>pw</sub>';
const lambdarw_ = '&lambda;<sub>rw</sub>';