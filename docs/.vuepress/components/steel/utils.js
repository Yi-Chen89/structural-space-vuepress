import aiscShapeDataV15US from '../../public/data/steel/aisc-shapes-database-v15.0_us.json';
import aiscShapeDataV15Metric from '../../public/data/steel/aisc-shapes-database-v15.0_metric.json';
import aiscShapeASTMSpecV15Match from '../../public/data/steel/aisc-shapes-astm-specifications-v15_match.json';
import aiscShapeASTMSpecV15Prop from '../../public/data/steel/aisc-shapes-astm-specifications-v15_property.json';


// import aiscShapeTypeDescription from '../../public/data/steel/aisc-shape-type-description.json';


export function shapeListFecher(unit) {
  // find dataset
  const dataset = datasetFinder(unit);

  if (dataset) {
    return Object.keys(dataset);
  } else {
    return null;
  }
}


export function shapeDataFetcher(unit, shape) {
  // find dataset
  const dataset = datasetFinder(unit);

  // fetch data
  if (dataset && shape in dataset) {
    return dataset[shape];
  } else {
    return null;
  }
}


export function shapeTypeFetcher(unit, shape) {
  // fetch data
  const shapeData = shapeDataFetcher(unit, shape)

  if (shapeData && 'Type' in shapeData) {
    const shapeTyoe = shapeData['Type'];
    if (shapeTyoe === 'HSS') {
      const countX = shape.split('X').length - 1;
      if (countX === 2) {
        return 'HSS Rect.';
      } else if (countX === 1) {
        return 'HSS Round';
      } else {
        return null;
      }
    } else {
      return shapeData['Type'];
    }
  } else {
    return null;
  }
}


export function shapeASTMSpecListFetcher(shapeType) {
  if (shapeType && shapeType in aiscShapeASTMSpecV15Match) {
    return aiscShapeASTMSpecV15Match[shapeType];
  } else {
    return null;
  }
}





export function astmSpecDesigFetcher(astmSpecKey) {
  // dataset
  const dataset = aiscShapeASTMSpecV15Prop;
  
  // fetch data
  if (dataset && astmSpecKey in dataset) {
    return dataset[astmSpecKey]['ASTM_Designation'];
  } else {
    return null;
  }
}


export function astmSpecPropFetcher(astmSpecKey) {
  // dataset
  const dataset = aiscShapeASTMSpecV15Prop;

  // fetch data
  if (dataset && astmSpecKey in dataset) {
    const data = dataset[astmSpecKey]
    return {
      'Fy': data['Fy'],
      'Fu': data['Fu'],
      'E': 29000,
    };
  } else {
    return null;
  }
}


export function shapeSlenderRatioFetcher(unit, shape, shapeType) {
  // fetch data
  const shapeData = shapeDataFetcher(unit, shape)

  if (['W', 'M', 'S', 'HP'].includes(shapeType)) {
    return {
      'bf/2tf': shapeData['bf/2tf'],
      'h/tw': shapeData['h/tw'],
    };
  } else if (['C', 'MC'].includes(shapeType)) {
    return {
      'b/t': shapeData['b/t'],
      'h/tw': shapeData['h/tw'],
    };
  } else if (['L', '2L'].includes(shapeType)) {
    return {
      'b/t': shapeData['b/t'],
    };
  } else if (['WT', 'MT', 'ST'].includes(shapeType)) {
    return {
      'bf/2tf': shapeData['bf/2tf'],
      'D/t': shapeData['D/t'],
    };
  } else if (['HSS Rect.'].includes(shapeType)) {
    return {
      'b/tdes': shapeData['b/tdes'],
      'h/tdes': shapeData['h/tdes'],
    };
  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    return {
      'D/t': shapeData['D/t'],
    };
  } else {
    return null;
  }
}


export function FlexureSlenderLimitRatioCalculator(shapeType, astmSpecProp) {
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







// export function shapeTypeDescriptionFetcher(shapeType) {
//   if (shapeType && shapeType in aiscShapeTypeDescription) {
//     return aiscShapeTypeDescription[shapeType];
//   } else {
//     return null;
//   }
// }



// helper function
function datasetFinder(unit) {
  // determine dataset based on unit
  // unit: 0 for US units, 1 for metric units
  if (unit === 0) {
    return aiscShapeDataV15US;
  } else if (unit === 1) {
    return aiscShapeDataV15Metric;
  } else {
    return null
  }
}