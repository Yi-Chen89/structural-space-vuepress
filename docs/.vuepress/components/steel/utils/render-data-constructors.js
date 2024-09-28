import resultRenderMetadata from '../../../public/data/steel/result-render-metadata-v15.json';


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