/**
 * Test script for Swiss Ephemeris Service integration
 * 
 * This script tests the integration between TypeScript and JavaScript
 * for Swiss Ephemeris calculations.
 */

import { swissEphemerisService } from './sweph-service';

// Enable more verbose error handling
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Helper function to log each step
function logStep(step: string, data?: any) {
  console.log(`\n[TEST] ${step}`);
  if (data !== undefined) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Main test function
async function runTest() {
  try {
    logStep('Starting Swiss Ephemeris Service integration test');
    
    // Initialize the service
    logStep('Initializing Swiss Ephemeris Service');
    const initialized = await swissEphemerisService.initialize();
    
    if (!initialized) {
      logStep('Failed to initialize Swiss Ephemeris Service');
      return;
    }
    
    logStep('Swiss Ephemeris Service initialized successfully');
    
    // Get current date
    const now = new Date();
    logStep('Current date', now.toString());
    
    // Test planetary positions calculation
    logStep('Testing planetary positions calculation');
    const positions = await swissEphemerisService.calculatePlanetaryPositions(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
    
    logStep('Planetary positions result', positions);
    
    // Test muhurta calculation
    logStep('Testing muhurta calculation for Mumbai (19.076°N, 72.8777°E)');
    const muhurta = await swissEphemerisService.calculateMuhurta(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      19.076, // Mumbai latitude
      72.8777 // Mumbai longitude
    );
    
    logStep('Muhurta calculation result', muhurta);
    
    logStep('Integration test completed successfully');
  } catch (error) {
    console.error('Error in integration test:', error);
  }
}

// Run the test
console.log('Starting integration test...');
runTest()
  .then(() => {
    console.log('Integration test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Integration test failed:', error);
    process.exit(1);
  });
