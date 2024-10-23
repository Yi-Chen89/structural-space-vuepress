import resultRenderMetadata from '/src/data/steel/result-render-metadata-v15.json';


export function resultRenderDataConstructor(result, category) {
  const resultMetadata = resultRenderMetadata;

  if (result && category && category in resultMetadata) {
    const filteredResult = Object.fromEntries(
      Object.entries(result).filter(([key, value]) => value['isApplicable'])
    );
    
    for (let key in filteredResult) {
      Object.assign(filteredResult[key], resultMetadata[category][key]);
    }
    
    return filteredResult;
  } else {
    return null;
  }
}

export function criticalResultRenderDataConstructor(criticalResult, category) {
  const resultMetadata = resultRenderMetadata;

  if (criticalResult && category && category in resultMetadata) {
    const results = [];

    if (category === 'compression') {
      const criticalKey = criticalResult[0];
      const criticalValue = criticalResult[1];

      const metadata = resultMetadata[category][criticalKey];

      results.push({
        'value': criticalValue,
        'section': metadata['section'],
        'notation': metadata['notation'],
        'unit': metadata['unit'],
      });

    } else if (category === 'flexure') {
      const momentSign = ['Sagging', 'Hogging'];
      
      const criticalKeys = criticalResult[0];
      const criticalValues = criticalResult[1];

      criticalKeys.forEach((value, index) => {
        if (criticalKeys[index]) {
          const metadata = resultMetadata[category][criticalKeys[index]];

          results.push({
            'value': criticalValues[index],
            'section': metadata['section'],
            'notation': metadata['notation'],
            'unit': metadata['unit'],
            'sign': momentSign[index],
          });
        }
      });

      if (results.length === 1) {
        results[0]['sign'] = '';
      }
    }
    return results;

  } else {
    return null;
  }
}