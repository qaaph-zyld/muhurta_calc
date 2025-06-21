/**
 * Test script for Swiss Ephemeris that will be run through ts-node
 * This is a JavaScript file that will be executed with ts-node
 */

// Direct console output to ensure we see something
console.log('Starting ts-js-test.js...');

// Import the sweph library
const sweph = require('sweph');

// Define constants manually
const SE_CONSTANTS = {
  SE_GREG_CAL: 1,
  SE_JUL_CAL: 0,
  SE_SUN: 0,
  SE_FLG_SWIEPH: 2
};

// Wrap everything in try-catch to catch any errors
try {
  console.log('Setting ephemeris path...');
  sweph.set_ephe_path('./ephe');
  
  console.log('Getting Swiss Ephemeris version...');
  const version = sweph.version();
  console.log('Swiss Ephemeris version:', version);
  
  console.log('Calculating Julian day...');
  const now = new Date();
  const jd = sweph.julday(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600,
    SE_CONSTANTS.SE_GREG_CAL
  );
  console.log('Julian day:', jd);
  
  console.log('Calculating Sun position...');
  const result = sweph.calc_ut(jd, SE_CONSTANTS.SE_SUN, SE_CONSTANTS.SE_FLG_SWIEPH);
  console.log('Sun position result:', result);
  console.log('Sun longitude:', result.data[0]);
  
  console.log('Closing Swiss Ephemeris...');
  sweph.close();
  
  console.log('Test completed successfully!');
} catch (error) {
  console.error('Error in test:', error);
}

// Final output to confirm script execution completed
console.log('End of ts-js-test.js');
