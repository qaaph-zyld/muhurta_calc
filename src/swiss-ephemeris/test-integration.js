/**
 * Test script for Swiss Ephemeris Service integration (JavaScript version)
 * 
 * This script tests the direct use of the sweph-calculator.js script
 * without going through the TypeScript service.
 */

const { spawn } = require('child_process');
const path = require('path');

// Helper function to log each step
function logStep(step, data) {
  console.log(`\n[TEST] ${step}`);
  if (data !== undefined) {
    try {
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Data:', data);
    }
  }
}

// Function to run the calculator script
async function runCalculation(command, args = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Path to the calculator script
      const scriptPath = path.resolve(__dirname, 'sweph-calculator.js');
      
      // Spawn a Node.js process to run the calculator script
      const child = spawn('node', [scriptPath, command, JSON.stringify(args)]);
      
      let stdoutData = '';
      let stderrData = '';
      
      // Collect stdout data
      child.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      // Collect stderr data
      child.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      // Handle process completion
      child.on('close', (code) => {
        if (code === 0) {
          try {
            // Parse the JSON result
            const result = JSON.parse(stdoutData);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse calculator output: ${error}`));
          }
        } else {
          reject(new Error(`Calculator process exited with code ${code}: ${stderrData}`));
        }
      });
      
      // Handle process error
      child.on('error', (error) => {
        reject(new Error(`Failed to start calculator process: ${error}`));
      });
    } catch (error) {
      reject(new Error(`Error running calculation: ${error}`));
    }
  });
}

// Main test function
async function runTest() {
  try {
    logStep('Starting Swiss Ephemeris direct integration test');
    
    // Test the calculator
    logStep('Testing calculator');
    const testResult = await runCalculation('test');
    logStep('Test result', testResult);
    
    // Get current date
    const now = new Date();
    logStep('Current date', now.toString());
    
    // Test planetary positions calculation
    logStep('Testing planetary positions calculation');
    const positions = await runCalculation('planetaryPositions', {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    });
    
    logStep('Planetary positions result', positions);
    
    // Test muhurta calculation
    logStep('Testing muhurta calculation for Mumbai (19.076°N, 72.8777°E)');
    const muhurta = await runCalculation('muhurta', {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      latitude: 19.076, // Mumbai latitude
      longitude: 72.8777 // Mumbai longitude
    });
    
    logStep('Muhurta calculation result', muhurta);
    
    logStep('Integration test completed successfully');
  } catch (error) {
    console.error('Error in integration test:', error);
  }
}

// Run the test
console.log('Starting direct integration test...');
runTest()
  .then(() => {
    console.log('Integration test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Integration test failed:', error);
    process.exit(1);
  });
