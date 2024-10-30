export function criticalResultProcessor(result, category) {
  if (result && category) {
    const resultAsList = Object.entries(result);

    if (['compression', 'shear'].includes(category)) {
      // filter out objects where isApplicable is false or value is 0
      const filteredResultAsList = resultAsList.filter(([, item]) => item['isApplicable'] && item['designValue']);
    
      if (filteredResultAsList.length > 0) {
        let criticalKey = null;
        let criticalResult = 0;
        
        filteredResultAsList.forEach(([key, item]) => {
          const value = item['designValue'];
          
          if (value !== 0 && (criticalResult === 0 || value < criticalResult)) {
            criticalKey = key;
            criticalResult = value;
          }
        });
        return [criticalKey, criticalResult];
  
      } else {
        return null;
      }

    } else if (['flexure'].includes(category)) {
      // filter out objects where isApplicable is false or all values are 0
      const filteredResultAsList = resultAsList.filter(([, item]) => item['isApplicable'] && item['values'].some(value => value !== 0));

      if (filteredResultAsList.length > 0) {
        const criticalKeys = [null, null];
        const criticalResults = [0, 0];
  
        filteredResultAsList.forEach(([key, item]) => {
          const values = item['values'];
  
          values.forEach((value, index) => {
            const currentCriticalResult = criticalResults[index];
  
            if (value !== 0 && (currentCriticalResult === 0 || value < currentCriticalResult)) {
              criticalKeys[index] = key;
              criticalResults[index] = value;
            }
          });
        });
        return [criticalKeys, criticalResults];
  
      } else {
        return null;
      }
    }
  } else {
    return null;
  }
}