/**
 * Debug test script for Swiss Ephemeris (JavaScript version)
 * This script includes detailed logging to trace execution
 */

const sweph = require('sweph');
const path = require('path');
const fs = require('fs');

// Define constants manually since they're not exported by the library
const SE_CONSTANTS = {
  // Calendar systems
  SE_GREG_CAL: 1,
  SE_JUL_CAL: 0,

  // Planets
  SE_SUN: 0,
  SE_MOON: 1,
  SE_MERCURY: 2,
  SE_VENUS: 3,
  SE_MARS: 4,
  SE_JUPITER: 5,
  SE_SATURN: 6,
  SE_URANUS: 7,
  SE_NEPTUNE: 8,
  SE_PLUTO: 9,
  SE_MEAN_NODE: 10,
  SE_TRUE_NODE: 11,

  // Calculation flags
  SE_FLG_SWIEPH: 2,
  SE_FLG_SPEED: 256,

  // Rise/set constants
  SE_CALC_RISE: 1,
  SE_CALC_SET: 2
};

// Helper function to log each step
function logStep(step, data) {
  console.log(`\n[DEBUG] ${step}`);
  if (data !== undefined) {
    try {
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Data:', data);
    }
  }
}

// Main test function
async function runTest() {
  try {
    logStep('Starting Swiss Ephemeris debug test');
    
    // Check if ephemeris directory exists
    const epheDir = path.resolve('./ephe');
    logStep(`Checking ephemeris directory: ${epheDir}`);
    
    if (fs.existsSync(epheDir)) {
      logStep('Ephemeris directory exists');
      
      // List files in the ephemeris directory
      const files = fs.readdirSync(epheDir);
      logStep(`Files in ephemeris directory (${files.length} files):`, files.slice(0, 10));
    } else {
      logStep('Ephemeris directory does not exist!');
      return;
    }
    
    // Initialize Swiss Ephemeris
    logStep('Setting ephemeris path');
    try {
      sweph.set_ephe_path('./ephe');
      logStep('Ephemeris path set successfully');
    } catch (error) {
      logStep('Error setting ephemeris path', error);
      return;
    }
    
    // Get Swiss Ephemeris version
    try {
      const version = sweph.version();
      logStep('Swiss Ephemeris version', version);
    } catch (error) {
      logStep('Error getting Swiss Ephemeris version', error);
      return;
    }
    
    // Calculate Julian day
    const now = new Date();
    logStep('Current date', now.toString());
    
    try {
      const jd = sweph.julday(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600,
        SE_CONSTANTS.SE_GREG_CAL
      );
      logStep('Julian day calculation', jd);
    } catch (error) {
      logStep('Error calculating Julian day', error);
      return;
    }
    
    // Calculate Sun position
    try {
      const jd = sweph.julday(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours() + now.getMinutes()/60 + now.getSeconds()/3600,
        SE_CONSTANTS.SE_GREG_CAL
      );
      
      logStep('Calculating Sun position');
      const result = sweph.calc_ut(jd, SE_CONSTANTS.SE_SUN, SE_CONSTANTS.SE_FLG_SWIEPH);
      logStep('Sun position result', result);
      
      if (result && result.data) {
        logStep('Sun longitude', result.data[0]);
      }
    } catch (error) {
      logStep('Error calculating Sun position', error);
      return;
    }
    
    // Try calculating sunrise/sunset
    try {
      const jd = sweph.julday(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        0,
        SE_CONSTANTS.SE_GREG_CAL
      );
      
      logStep('Calculating sunrise');
      const geoPos = { lon: 72.8777, lat: 19.076 }; // Mumbai
      
      const sunrise = sweph.rise_trans(
        jd,
        SE_CONSTANTS.SE_SUN,
        SE_CONSTANTS.SE_CALC_RISE,
        geoPos,
        0, 0, 0, 0
      );
      
      logStep('Sunrise result', sunrise);
      
      if (sunrise && sunrise.tret && sunrise.tret.length > 0) {
        const riseJd = sunrise.tret[0];
        const riseDate = sweph.revjul(riseJd, SE_CONSTANTS.SE_GREG_CAL);
        logStep('Sunrise time', riseDate);
      }
    } catch (error) {
      logStep('Error calculating sunrise', error);
    }
    
    // Close Swiss Ephemeris
    try {
      sweph.close();
      logStep('Swiss Ephemeris closed successfully');
    } catch (error) {
      logStep('Error closing Swiss Ephemeris', error);
    }
    
    logStep('Debug test completed successfully');
  } catch (error) {
    console.error('Error in debug test:', error);
  }
}

// Run the test
console.log('Starting debug test...');
runTest()
  .then(() => {
    console.log('Debug test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Debug test failed:', error);
    process.exit(1);
  });
