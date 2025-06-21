/**
 * Test script for Swiss Ephemeris initialization only
 */

import * as sweph from 'sweph';
import { SE_CONSTANTS } from './constants';
import { initSwissEphemeris } from './sweph-poc';

console.log('\n==== Starting Swiss Ephemeris Init Test... ====');

try {
  // Initialize Swiss Ephemeris
  console.log('Initializing Swiss Ephemeris...');
  const initialized = initSwissEphemeris();
  console.log('Swiss Ephemeris initialized:', initialized);
  
  // Log the Swiss Ephemeris version
  console.log('Swiss Ephemeris version:', sweph.version());
  
  // Calculate Julian day for current date
  const now = new Date();
  const jd = sweph.julday(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600,
    SE_CONSTANTS.SE_GREG_CAL
  );
  console.log('Current Julian Day:', jd);
  
  // Calculate Sun position directly
  const result = sweph.calc_ut(jd, SE_CONSTANTS.SE_SUN, SE_CONSTANTS.SE_FLG_SWIEPH);
  console.log('Sun calculation result:', result);
  console.log('Sun longitude:', result.data[0]);
  
  // Close Swiss Ephemeris
  sweph.close();
  console.log('\n==== Test script completed successfully ====');
} catch (error) {
  console.error('Error in Swiss Ephemeris test:', error);
  process.exit(1);
}
