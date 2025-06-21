/**
 * Test script for Swiss Ephemeris planetary positions calculation
 */

import * as sweph from 'sweph';
import { SE_CONSTANTS } from './constants';
import { initSwissEphemeris, calculatePlanetaryPositions } from './sweph-poc';

// Enable more verbose error handling
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

console.log('\n==== Starting Swiss Ephemeris Positions Test... ====');

try {
  // Initialize Swiss Ephemeris
  console.log('Initializing Swiss Ephemeris...');
  let initialized = false;
  try {
    initialized = initSwissEphemeris();
    console.log('Swiss Ephemeris initialized:', initialized);
  } catch (initError) {
    console.error('Error initializing Swiss Ephemeris:', initError);
    throw initError;
  }
  
  if (!initialized) {
    console.error('Failed to initialize Swiss Ephemeris');
    process.exit(1);
  }
  
  // Log the Swiss Ephemeris version
  console.log('Swiss Ephemeris version:', sweph.version());
  
  // Test planetary positions calculation
  console.log('\nTesting planetary positions calculation...');
  const now = new Date();
  console.log('\nCalculating planetary positions for:', now.toString());
  
  try {
    console.log('Calling calculatePlanetaryPositions with:', {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    });
    
    const positions = calculatePlanetaryPositions(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    
    console.log('\nPlanetary positions:');
    positions.forEach(position => {
      console.log(`${position.planet}: ${position.longitude.toFixed(2)}° (${position.zodiacSign} ${position.degreesInSign}°), Nakshatra: ${position.nakshatra}`);
    });
    console.log(JSON.stringify(positions, null, 2));
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
  }
  
  console.log('\n==== Test script completed successfully ====');
} catch (error) {
  console.error('Error in Swiss Ephemeris test:', error instanceof Error ? error.message : String(error));
  console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
  process.exit(1);
}
