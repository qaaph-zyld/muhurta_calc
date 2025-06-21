/**
 * Basic test for Swiss Ephemeris library
 */

try {
  console.log('Attempting to import sweph...');
  const sweph = require('sweph');
  console.log('Successfully imported sweph');
  console.log('sweph version:', sweph.version());
  
  // Define constants manually since they're not exported by the library
  // These values are based on the Swiss Ephemeris documentation
  const SE_CONSTANTS = {
    // Calendar systems
    SE_JUL_CAL: 0,
    SE_GREG_CAL: 1,
    
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
    SE_FLG_JPLEPH: 1,
    SE_FLG_SWIEPH: 2,
    SE_FLG_MOSEPH: 4,
    SE_FLG_SPEED: 256
  };
  
  // Test basic functionality
  console.log('\nTesting basic functionality:');
  
  // Set ephemeris path
  console.log('Setting ephemeris path...');
  sweph.set_ephe_path('./ephe');
  
  // Get current Julian day
  const now = new Date();
  console.log('Current date:', now.toString());
  
  // Log our manually defined constants
  console.log('Using manually defined constants');
  
  // Use SE_GREG_CAL (1) for the Gregorian calendar
  const jd = sweph.julday(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours() + now.getMinutes()/60,
    SE_CONSTANTS.SE_GREG_CAL
  );
  
  console.log('Julian day:', jd);
  
  // Calculate Sun position
  console.log('\nCalculating Sun position...');
  try {
    const result = sweph.calc_ut(jd, SE_CONSTANTS.SE_SUN, SE_CONSTANTS.SE_FLG_SWIEPH);
    console.log('Sun position:', result);
  } catch (error) {
    console.error('Error calculating Sun position:', error);
  }
  
  console.log('\nTest completed successfully');
} catch (error) {
  console.error('Error in basic test:', error);
}
