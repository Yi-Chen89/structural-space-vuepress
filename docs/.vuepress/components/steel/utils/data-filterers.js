import aiscShapeDataCategory from '/src/data/steel/aisc-shapes-data-category.json';


export function shapeWeightFilterer(shapeData, shapeType) {
  const keys = filterKeysFinder(shapeType, 'weight');
  
  return dictFilterer(shapeData, keys);
}

export function shapeWeightRenderDataFilterer(shapeData, shapeType) {
  const infoDict = infoDictFinder(shapeType, 'weight')
  const valueDict = shapeWeightFilterer(shapeData, shapeType);

  for (let key in valueDict) {
    if (infoDict[key]) {
      infoDict[key]["value"] = valueDict[key];
    }
  }

  return infoDict;
}

export function shapeDimensionFilterer(shapeData, shapeType) {
  const keys = filterKeysFinder(shapeType, 'dimension');

  return dictFilterer(shapeData, keys);
}

export function shapeDimensionRenderDataFilterer(shapeData, shapeType) {
  const infoDict = infoDictFinder(shapeType, 'dimension')
  const valueDict = shapeDimensionFilterer(shapeData, shapeType);

  for (let key in valueDict) {
    if (infoDict[key]) {
      infoDict[key]["value"] = valueDict[key];
    }
  }

  return infoDict;
}

export function shapeSlenderRatioFilterer(shapeData, shapeType) {
  const keys = filterKeysFinder(shapeType, 'slenderness_ratio');

  return dictFilterer(shapeData, keys);
}

export function shapeSlenderRatioRenderDataFilterer(shapeData, shapeType) {
  const infoDict = infoDictFinder(shapeType, 'slenderness_ratio')
  const valueDict = shapeSlenderRatioFilterer(shapeData, shapeType);

  for (let key in valueDict) {
    if (infoDict[key]) {
      infoDict[key]["value"] = valueDict[key];
    }
  }

  return infoDict;
}

export function shapePropertyFilterer(shapeData, shapeType) {
  const keys = filterKeysFinder(shapeType, 'property');

  return dictFilterer(shapeData, keys);
}

export function shapePropertyRenderDataFilterer(shapeData, shapeType) {
  const infoDict = infoDictFinder(shapeType, 'property')
  const valueDict = shapePropertyFilterer(shapeData, shapeType);

  for (let key in valueDict) {
    if (infoDict[key]) {
      infoDict[key]["value"] = valueDict[key];
    }
  }

  return infoDict;
}

export function resultRenderDataFilterer(result) {
  if (result) {
    return Object.fromEntries(
      Object.entries(result).filter(([key, value]) => value['isApplicable'])
    );
  } else {
    return null;
  }
}


// Helper Function

function filterKeysFinder(shapeType, category) {
  // dataset
  const dataset = aiscShapeDataCategory;

  if (dataset && category in dataset) {
    const dict = dataset[category];

    if (category === 'weight') {
      return Object.keys(dict);
    }

    if (shapeType in dict) {
      return Object.keys(dict[shapeType]);
    }

    return null;
  } else {
    return null;
  }
}

function dictFilterer(dict, keysToKeep) {
  if (dict && keysToKeep) {
    const filteredDict = {};
    keysToKeep.forEach(key => {
      if (key in dict) {
        filteredDict[key] = dict[key];
      }
    });
    return filteredDict; 
  } else {
    return null;
  }
}

function infoDictFinder(shapeType, category) {
  // dataset
  const dataset = aiscShapeDataCategory;

  if (dataset && category in dataset) {
    const dict = dataset[category];

    if (category === 'weight') {
      return JSON.parse(JSON.stringify(dict));
    }

    if (shapeType in dict) {
      return JSON.parse(JSON.stringify(dict[shapeType]));
    }

    return null;
  } else {
    return null;
  }
}