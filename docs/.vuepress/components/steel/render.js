



// Helper Function

function dictFilterer(dict, keyList) {
  // create new dict with only keys in keyList
  const filteredDict = {};
  keyList.forEach(key => {
    if (dict.includes(key)) {
      filteredDict[key] = dict[key];
    }
  });
  
  return filteredDict;
}