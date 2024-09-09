import aiscDataV15US from '../../public/data/steel/aisc-shapes-database-v15.0_us.json';
import aiscDataV15Metric from '../../public/data/steel/aisc-shapes-database-v15.0_metric.json';


export function test(x) {
    return aiscDataV15US[x];
}