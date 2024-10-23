export function criticalResultProcessor(result) {
    if (result) {
      const resultAsList = Object.entries(result);
  
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
  
    } else {
      return null;
    }
  }