/**
 * Simple test script for Swiss Ephemeris
 */

import * as sweph from 'sweph';
import { SE_CONSTANTS } from './constants';

console.log('Starting simple Swiss Ephemeris test...');

// Set the path to the ephemeris files
try {
  sweph.set_ephe_path('./ephe');
  console.log('Swiss Ephemeris path set successfully');
  
  // Get Swiss Ephemeris version
  const version = sweph.version();
  console.log('Swiss Ephemeris version:', version);
  
  // Calculate Julian day for current date
  const now = new Date();
  const jd = sweph.julday(
    now.getFullYear(),
    now.getMonth() + 1, // JavaScript months are 0-indexed
    now.getDate(),
    now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600,
    SE_CONSTANTS.SE_GREG_CAL
  );
  console.log('Current Julian Day:', jd);
  
  // Calculate Sun position
  const result = sweph.calc_ut(jd, SE_CONSTANTS.SE_SUN, SE_CONSTANTS.SE_FLG_SWIEPH);
  console.log('Sun calculation result:', result);
  console.log('Sun longitude:', result.data[0]);
  
  // Close Swiss Ephemeris
  sweph.close();
  console.log('Test completed successfully');
} catch (error) {
  console.error('Error in Swiss Ephemeris test:', error);
}
