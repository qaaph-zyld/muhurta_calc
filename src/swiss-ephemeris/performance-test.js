/**
 * Performance test script for Swiss Ephemeris calculations
 * This script measures the execution time of various calculations
 */

const { fork } = require('child_process');
const path = require('path');

// Test locations (latitude, longitude)
const testLocations = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 }
];

// Test dates (year, month, day)
const testDates = [
  { year: 2025, month: 6, day: 30 },
  { year: 2025, month: 12, day: 21 },
  { year: 2026, month: 3, day: 15 },
  { year: 2026, month: 9, day: 1 }
];

/**
 * Run a performance test for a specific calculation
 * @param {string} testName - Name of the test
 * @param {string} command - Command to execute
 * @param {Object} params - Parameters for the command
 * @returns {Promise<number>} - Execution time in milliseconds
 */
async function runTest(testName, command, params) {
  console.log(`\n[TEST] Running ${testName}...`);
  
  const startTime = process.hrtime.bigint();
  
  return new Promise((resolve, reject) => {
    const calculatorProcess = fork(
      path.join(__dirname, 'sweph-calculator.js'),
      [command, JSON.stringify(params)]
    );
    
    let output = '';
    
    calculatorProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    calculatorProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[ERROR] ${testName} exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
        return;
      }
      
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      console.log(`[TEST] ${testName} completed in ${executionTime.toFixed(2)} ms`);
      
      try {
        // Parse the JSON output
        const result = JSON.parse(output);
        if (!result.success) {
          reject(new Error(`Test failed: ${result.message || 'Unknown error'}`));
          return;
        }
        
        resolve(executionTime);
      } catch (error) {
        console.error(`[ERROR] Failed to parse output: ${error.message}`);
        console.error('Raw output:', output);
        reject(error);
      }
    });
    
    calculatorProcess.on('error', (error) => {
      console.error(`[ERROR] ${testName} failed:`, error);
      reject(error);
    });
    
    calculatorProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`[ERROR] ${testName} exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

/**
 * Run all performance tests
 */
async function runPerformanceTests() {
  console.log('\n===== SWISS EPHEMERIS PERFORMANCE TESTS =====\n');
  
  const results = {
    planetaryPositions: [],
    muhurtaCalculations: []
  };
  
  // Test planetary positions calculation
  for (const date of testDates) {
    try {
      // Add default hour, minute, second for planetary positions
      const params = {
        ...date,
        hour: 12,
        minute: 0,
        second: 0
      };
      
      const executionTime = await runTest(
        `Planetary positions for ${date.year}-${date.month}-${date.day}`,
        'planetaryPositions',
        params
      );
      results.planetaryPositions.push({
        date: `${date.year}-${date.month}-${date.day}`,
        executionTime
      });
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
  
  // Test muhurta calculation for different locations and dates
  for (const location of testLocations) {
    for (const date of testDates) {
      try {
        const params = {
          ...date,
          latitude: location.lat,
          longitude: location.lng
        };
        
        const executionTime = await runTest(
          `Muhurta calculation for ${location.name} on ${date.year}-${date.month}-${date.day}`,
          'muhurta',
          params
        );
        
        results.muhurtaCalculations.push({
          location: location.name,
          date: `${date.year}-${date.month}-${date.day}`,
          executionTime
        });
      } catch (error) {
        console.error('Test failed:', error);
      }
    }
  }
  
  // Print summary
  console.log('\n===== PERFORMANCE TEST SUMMARY =====\n');
  
  console.log('Planetary Positions Tests:');
  const avgPlanetaryTime = results.planetaryPositions.reduce((sum, item) => sum + item.executionTime, 0) / results.planetaryPositions.length;
  console.log(`Average execution time: ${avgPlanetaryTime.toFixed(2)} ms`);
  
  console.log('\nMuhurta Calculation Tests:');
  const avgMuhurtaTime = results.muhurtaCalculations.reduce((sum, item) => sum + item.executionTime, 0) / results.muhurtaCalculations.length;
  console.log(`Average execution time: ${avgMuhurtaTime.toFixed(2)} ms`);
  
  console.log('\n===== END OF PERFORMANCE TESTS =====\n');
}

// Run the tests
runPerformanceTests().catch(console.error);
