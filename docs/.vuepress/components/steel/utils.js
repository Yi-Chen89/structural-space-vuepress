import aiscDataV15US from '../../public/data/steel/aisc-shapes-database-v15.0_us.json';
import aiscDataV15Metric from '../../public/data/steel/aisc-shapes-database-v15.0_metric.json';


export function sectionListFecher(unit) {
  // find dataset
  const data = datasetFinder(unit);

  if (data) {
    return Object.keys(data);
  } else {
    return null;
  }
}


export function dataFetcher(unit, section) {
  // find dataset
  const data = datasetFinder(unit);

  // fetch data
  if (data && section in data) {
    return data[section];
  } else {
    return null;
  }
}


// helper function
function datasetFinder(unit) {
  // determine dataset based on unit
  // unit: 0 for US units, 1 for metric units
  if (unit === 0) {
    return aiscDataV15US;
  } else if (unit === 1) {
    return aiscDataV15Metric;
  } else {
    return null
  }
}