/**
 * Test script for Swiss Ephemeris Proof of Concept
 */

import * as sweph from 'sweph';
import { SE_CONSTANTS } from './constants';
import { initSwissEphemeris, calculatePlanetaryPositions, calculateMuhurta } from './sweph-poc';

// Enable more verbose error handling
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

console.log('\n==== Starting Swiss Ephemeris test... ====');

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
  
  // Test muhurta calculation for today at a specific location
  // Using Mumbai, India coordinates as an example
  const latitude = 19.076;
  const longitude = 72.8777;
  
  console.log('\nTesting muhurta calculation...');
  console.log(`Location: Mumbai, India (Lat: ${latitude}, Long: ${longitude})`);
  // Calculate muhurta for current date in Mumbai
  console.log('\nCalculating muhurta for Mumbai (19.076°N, 72.8777°E)...');
  try {
    console.log('Calling calculateMuhurta with:', {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      latitude: 19.076,
      longitude: 72.8777
    });
    
    const muhurta = calculateMuhurta(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      19.076, // Mumbai latitude
      72.8777 // Mumbai longitude
    );
    
    if (muhurta.success) {
      console.log(`\nMuhurta calculation for ${muhurta.date}:`);
      
      // Format time from hour decimal to HH:MM
      const formatTime = (hour: number) => {
        const h = Math.floor(hour);
        const m = Math.floor((hour - h) * 60);
        return `${h}:${m.toString().padStart(2, '0')}`;
      };
      
      if (muhurta.sunrise && muhurta.sunset) {
        console.log(`Sunrise: ${formatTime(muhurta.sunrise.hour)}`);
        console.log(`Sunset: ${formatTime(muhurta.sunset.hour)}`);
        console.log(`Day length: ${muhurta.dayLength} hours`);
      }
      
      console.log('\nMuhurtas:');
      if (muhurta.muhurtas) {
        muhurta.muhurtas.forEach(m => {
          console.log(`${m.number}. ${m.name}: ${m.startTime} - ${m.endTime} (${m.quality})`);
        });
      }
    } else {
      console.error('Failed to calculate muhurta:', muhurta.message);
    }
    console.log(JSON.stringify(muhurta, null, 2));
  } catch (error) {
    console.error('Error calculating muhurtas:', error);
  }
  
  console.log('\nTest completed successfully');
} catch (error) {
  console.error('Error in Swiss Ephemeris test:', error instanceof Error ? error.message : String(error));
  console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
  process.exit(1);
}

console.log('\n==== Test script completed successfully ====');
