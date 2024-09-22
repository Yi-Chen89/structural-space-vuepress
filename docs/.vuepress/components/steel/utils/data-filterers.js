export function shapeWeightFilterer(shapeData) {
  const keys = ['W'];

  return dictFilterer(shapeData, keys);
}

export function shapeDimensionFilterer(shapeData, shapeType) {
  let keys = null;
  if (['W', 'M', 'S', 'HP', 'C', 'MC', 'WT', 'MT', 'ST'].includes(shapeType)) {
    keys = ['d', 'bf', 'tw', 'tf'];
  } else if (['HSS Rect.', 'HSS Square'].includes(shapeType)) {
    keys = ['Ht', 'B', 'tdes'];
  } else if (['HSS Round', 'PIPE'].includes(shapeType)) {
    keys = ['OD', 'tdes'];
  } else if (['L', '2L'].includes(shapeType)) {
    keys = ['d', 'b', 't'];
  } else {
    keys = [];
  }

  return dictFilterer(shapeData, keys);
}


// Helper Function

function dictFilterer(dict, keysToKeep) {
  // create new dict with only keys in keyList
  const filteredDict = {};
  keysToKeep.forEach(key => {
    if (key in dict) {
      filteredDict[key] = dict[key];
    }
  });
  
  return filteredDict;
}