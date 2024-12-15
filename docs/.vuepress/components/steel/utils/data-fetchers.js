import aiscShapeDataV15US from '/src/data/steel/aisc-shapes-database-v15.0_us.json';
import aiscShapeDataV15Metric from '/src/data/steel/aisc-shapes-database-v15.0_metric.json';
import aiscShapeTypeV15 from '/src/data/steel/aisc-shape-type-v15.json';
import aiscShapeASTMSpecV15Match from '/src/data/steel/aisc-shapes-astm-specifications-v15_match.json';
import aiscShapeASTMSpecV15Prop from '/src/data/steel/aisc-shapes-astm-specifications-v15_property.json';

// import aiscShapeTypeDescription from '/src/data/steel/aisc-shape-type-description.json';


export function descShapeTypeListFetcher() {
  // dataset
  const dataset = aiscShapeTypeV15;

  if (dataset) {
    return Object.keys(dataset);
  } else {
    return null;
  }
}

export function shapeListFetcher(unit, descShapeType) {
  // find dataset
  const dataset = datasetFinder(unit);

  // find shape type list
  const shapeTypeList = shapeTypeListFecher(descShapeType);
  
  if (dataset) {
    return Object.keys(dataset).filter(key => {
      const shapeType = shapeTypeFetcher(unit, key);
      return shapeTypeList.includes(shapeType);
    });
  } else {
    return null;
  }
}

export function shapeDataFetcher(unit, shape) {
  // find dataset
  const dataset = datasetFinder(unit);

  if (dataset && shape in dataset) {
    return dataset[shape];
  } else {
    return null;
  }
}

export function shapeTypeFetcher(unit, shape) {
  // fetch data
  const shapeData = shapeDataFetcher(unit, shape)

  let shapeTypeResult = null;
  if (shapeData && 'Type' in shapeData) {
    const shapeType = shapeData['Type'];

    if (shapeType === 'HSS') {
      const countX = shape.split('X').length - 1;

      if (countX === 2) {
        const { Ht, B } = shapeData;
        shapeTypeResult = Ht !== B ? 'HSS Rect.' : 'HSS Square';
      } else if (countX === 1) {
        shapeTypeResult = 'HSS Round';
      }

    } else if (shapeType === 'L') {
      const { d, b } = shapeData;
      shapeTypeResult = d === b ? 'L Equal' : 'L Unequal';
      
    } else {
      shapeTypeResult = shapeType;
    }
  }
  
  return shapeTypeResult;
}

export function shapeASTMSpecListFetcher(shapeType) {
  // dataset
  const dataset = aiscShapeASTMSpecV15Match;

  if (shapeType && shapeType in dataset) {
    return dataset[shapeType];
  } else {
    return null;
  }
}

export function astmSpecDesigFetcher(astmSpecKey) {
  // dataset
  const dataset = aiscShapeASTMSpecV15Prop;
  
  if (dataset && astmSpecKey in dataset) {
    return dataset[astmSpecKey]['ASTM_Designation'];
  } else {
    return null;
  }
}

export function astmSpecPropFetcher(astmSpecKey) {
  // dataset
  const dataset = aiscShapeASTMSpecV15Prop;

  if (dataset && astmSpecKey in dataset) {
    const data = dataset[astmSpecKey]
    return {
      'Fy': data['Fy'],  // Specified minimum yield stress, ksi (MPa)
      'Fu': data['Fu'],  // Specified minimum tensile strength, ksi (MPa)
      'E': 29000,  // Modulus of elasticity of steel = 29,000 ksi (200 000 MPa)
      'G': 11200,  // Shear modulus of elasticity of steel = 11,200 ksi (77 200 MPa)
    };
  } else {
    return null;
  }
}

export function astmSpecPropRenderDataFetcher(astmSpecKey) {
  const infoDict = {
    "Fy": {
      "notation": "F<sub>y</sub>",
      "unit": "ksi",
      "description": "specified minimum yield stress"
    },
    "Fu": {
      "notation": "F<sub>u</sub>",
      "unit": "ksi",
      "description": "specified minimum tensile strength"
    },
    "E": {
      "notation": "E",
      "unit": "ksi",
      "description": "modulus of elasticity of steel"
    },
    "G": {
      "notation": "G",
      "unit": "ksi",
      "description": "shear modulus of elasticity of steel"
    }
  };
  const valueDict = astmSpecPropFetcher(astmSpecKey);

  for (let key in valueDict) {
    if (infoDict[key]) {
      infoDict[key]["value"] = valueDict[key];
    }
  }

  return infoDict;
}

// export function shapeTypeDescriptionFetcher(shapeType) {
//   if (shapeType && shapeType in aiscShapeTypeDescription) {
//     return aiscShapeTypeDescription[shapeType];
//   } else {
//     return null;
//   }
// }


// Helper Function

function datasetFinder(unit) {
  // determine dataset based on unit
  // unit: 0 for US units, 1 for metric units
  if (unit === 0) {
    return aiscShapeDataV15US;
  } else if (unit === 1) {
    return aiscShapeDataV15Metric;
  } else {
    return null;
  }
}

function shapeTypeListFecher(descShapeType) {
  // dataset
  const dataset = aiscShapeTypeV15;

  if (descShapeType && descShapeType in dataset) {
    return dataset[descShapeType];
  } else {
    return null;
  }
}