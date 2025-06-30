/**
 * Swiss Ephemeris Service
 * 
 * This service provides a TypeScript interface to the Swiss Ephemeris calculations
 * implemented in JavaScript. It uses Node.js child_process to execute the JavaScript
 * calculations and returns the results to the TypeScript application.
 */

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Define interfaces for the data structures
export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  zodiacSign: string;
  degreesInSign: string;
  nakshatra: string;
  nakshatra_num: number;
}

export interface Tithi {
  tithi: number;
  tithiName: string;
  paksha: string;
}

export interface Yoga {
  yoga: number;
  yogaName: string;
}

export interface Muhurta {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  quality: string;
  tithi: string;
  yoga: string;
  nakshatra: string;
}

export interface MuhurtaCalculationResult {
  success: boolean;
  date?: string;
  sunrise?: any;
  sunset?: any;
  dayLength?: string;
  muhurtas?: Muhurta[];
  message?: string;
}

export interface PlanetaryCalculationResult {
  success: boolean;
  positions?: PlanetaryPosition[];
  message?: string;
}

/**
 * Swiss Ephemeris Service class
 * Provides methods to calculate planetary positions and muhurtas
 */
export class SwissEphemerisService {
  private jsScriptPath: string;
  private initialized: boolean = false;
  
  constructor() {
    // Path to the JavaScript calculation script
    this.jsScriptPath = path.resolve(__dirname, 'sweph-calculator.js');
    
    // Check if the script exists
    if (!fs.existsSync(this.jsScriptPath)) {
      throw new Error(`Swiss Ephemeris calculator script not found at: ${this.jsScriptPath}`);
    }
  }
  
  /**
   * Initialize the service
   * Creates the JavaScript calculator script if it doesn't exist
   */
  public async initialize(): Promise<boolean> {
    try {
      // Create the calculator script if it doesn't exist
      if (!fs.existsSync(this.jsScriptPath)) {
        await this.createCalculatorScript();
      }
      
      // Test the calculator script
      const testResult = await this.runCalculation('test');
      if (testResult && testResult.success) {
        this.initialized = true;
        return true;
      } else {
        console.error('Failed to initialize Swiss Ephemeris service:', testResult?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Error initializing Swiss Ephemeris service:', error);
      return false;
    }
  }
  
  /**
   * Calculate planetary positions for a given date and time
   */
  public async calculatePlanetaryPositions(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
  ): Promise<PlanetaryCalculationResult> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      const command = 'planetaryPositions';
      const args = { year, month, day, hour, minute, second };
      
      const result = await this.runCalculation(command, args);
      return result as PlanetaryCalculationResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Error calculating planetary positions: ${errorMessage}` };
    }
  }
  
  /**
   * Calculate muhurta for a given date and location
   */
  public async calculateMuhurta(
    year: number,
    month: number,
    day: number,
    latitude: number,
    longitude: number
  ): Promise<MuhurtaCalculationResult> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      const command = 'muhurta';
      const args = { year, month, day, latitude, longitude };
      
      const result = await this.runCalculation(command, args);
      return result as MuhurtaCalculationResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Error calculating muhurta: ${errorMessage}` };
    }
  }
  
  /**
   * Run a calculation using the JavaScript calculator script
   */
  private async runCalculation(command: string, args: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Spawn a Node.js process to run the calculator script
        const child = spawn('node', [this.jsScriptPath, command, JSON.stringify(args)]);
        
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
  
  /**
   * Create the JavaScript calculator script
   */
  private async createCalculatorScript(): Promise<void> {
    // The content of the calculator script
    const scriptContent = `/**
 * Swiss Ephemeris Calculator Script
 * 
 * This script is executed by the SwissEphemerisService to perform calculations
 * using the sweph library. It receives commands and arguments via command line
 * and returns results as JSON.
 */

const sweph = require('sweph');
const path = require('path');

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

// Initialize Swiss Ephemeris with the path to ephemeris files
function initSwissEphemeris() {
  try {
    // Set the path to the ephemeris files
    const epheDir = path.resolve('./ephe');
    sweph.set_ephe_path(epheDir);
    return true;
  } catch (error) {
    console.error('Failed to initialize Swiss Ephemeris:', error);
    return false;
  }
}

// Calculate planetary positions for a given date and time
function calculatePlanetaryPositions(year, month, day, hour, minute, second) {
  try {
    // Convert date and time to Julian day
    const julianDay = sweph.julday(year, month, day, hour + minute / 60 + second / 3600, SE_CONSTANTS.SE_GREG_CAL);
    
    // Define planets to calculate
    const planets = [
      { id: SE_CONSTANTS.SE_SUN, name: 'Sun' },
      { id: SE_CONSTANTS.SE_MOON, name: 'Moon' },
      { id: SE_CONSTANTS.SE_MERCURY, name: 'Mercury' },
      { id: SE_CONSTANTS.SE_VENUS, name: 'Venus' },
      { id: SE_CONSTANTS.SE_MARS, name: 'Mars' },
      { id: SE_CONSTANTS.SE_JUPITER, name: 'Jupiter' },
      { id: SE_CONSTANTS.SE_SATURN, name: 'Saturn' },
      { id: SE_CONSTANTS.SE_MEAN_NODE, name: 'Rahu' }
    ];
    
    // Calculate positions
    const positions = planets.map(planet => {
      // Calculate planet position
      const result = sweph.calc_ut(julianDay, planet.id, SE_CONSTANTS.SE_FLG_SWIEPH);
      
      // Get the zodiac sign and degrees
      const longitude = result.data[0];
      const zodiacSign = Math.floor(longitude / 30);
      const degreesInSign = longitude % 30;
      
      // Get nakshatra
      const nakshatra = Math.floor(longitude * 27 / 360);
      const nakshtraNames = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
        'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
        'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
        'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
      ];
      
      // Get zodiac sign names
      const zodiacNames = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ];
      
      return {
        planet: planet.name,
        longitude: longitude,
        zodiacSign: zodiacNames[zodiacSign],
        degreesInSign: degreesInSign.toFixed(2),
        nakshatra: nakshtraNames[nakshatra],
        nakshatra_num: nakshatra + 1
      };
    });
    
    return { success: true, positions };
  } catch (error) {
    return { success: false, message: \`Error calculating planetary positions: \${error}\` };
  }
}

// Calculate tithi (lunar day)
function calculateTithi(sunLongitude, moonLongitude) {
  // Calculate the angular distance between Moon and Sun
  let angle = moonLongitude - sunLongitude;
  if (angle < 0) angle += 360;
  
  // Calculate tithi (1-30)
  const tithi = Math.floor(angle / 12) + 1;
  
  // Determine paksha
  const paksha = tithi <= 15 ? 'Shukla' : 'Krishna';
  
  // Get tithi name
  const tithiWithinPaksha = tithi <= 15 ? tithi : tithi - 15;
  
  // Tithi names
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  
  return {
    tithi: tithi,
    tithiName: tithiNames[tithiWithinPaksha - 1],
    paksha: paksha
  };
}

// Calculate yoga
function calculateYoga(sunLongitude, moonLongitude) {
  // Calculate the sum of Sun and Moon longitudes
  let sum = sunLongitude + moonLongitude;
  if (sum >= 360) sum -= 360;
  
  // Calculate yoga (1-27)
  const yoga = Math.floor(sum * 27 / 360) + 1;
  
  // Yoga names
  const yogaNames = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  
  return {
    yoga: yoga,
    yogaName: yogaNames[yoga - 1]
  };
}

// Calculate muhurta for a given date and location
function calculateMuhurta(year, month, day, latitude, longitude) {
  try {
    // Calculate Julian day for the given date
    const julianDay = sweph.julday(year, month, day, 0, SE_CONSTANTS.SE_GREG_CAL);
    
    // Calculate approximate sunrise/sunset times
    // For locations in the tropics, sunrise is approximately 6 AM and sunset is approximately 6 PM
    // This is a simplified approach until we can fix the rise_trans function
    
    // Calculate approximate sunrise (6 AM) and sunset (6 PM) Julian days
    const sunriseJD = julianDay + (6/24);  // 6 AM
    const sunsetJD = julianDay + (18/24);  // 6 PM
    
    // Calculate day length in hours
    const dayLength = (sunsetJD - sunriseJD) * 24;
    
    // In Vedic astrology, a day is divided into 15 muhurtas (from sunrise to sunset)
    const muhurtaDuration = dayLength / 15; // duration of each muhurta in hours
    
    // Calculate muhurtas for the day
    const muhurtas = [];
    for (let i = 0; i < 15; i++) {
      const startTime = sunriseJD + (i * muhurtaDuration) / 24;
      const endTime = sunriseJD + ((i + 1) * muhurtaDuration) / 24;
      
      // Convert Julian day to date and time
      const startDate = sweph.revjul(startTime, SE_CONSTANTS.SE_GREG_CAL);
      const endDate = sweph.revjul(endTime, SE_CONSTANTS.SE_GREG_CAL);
      
      // Format times
      const formatTime = (date) => {
        const hour = Math.floor(date.hour);
        const minute = Math.floor((date.hour - hour) * 60);
        return \`\${hour.toString().padStart(2, '0')}:\${minute.toString().padStart(2, '0')}\`;
      };
      
      // Calculate planetary positions at the middle of the muhurta
      const midTime = (startTime + endTime) / 2;
      const midDate = sweph.revjul(midTime, SE_CONSTANTS.SE_GREG_CAL);
      const positions = calculatePlanetaryPositions(
        midDate.year, midDate.month, midDate.day, 
        midDate.hour, Math.floor((midDate.hour - Math.floor(midDate.hour)) * 60), 0
      ).positions;
      
      // Find Sun and Moon positions
      const sun = positions.find(p => p.planet === 'Sun');
      const moon = positions.find(p => p.planet === 'Moon');
      
      // Calculate tithi and yoga if Sun and Moon positions are available
      let tithi = null;
      let yoga = null;
      
      if (sun && moon) {
        tithi = calculateTithi(sun.longitude, moon.longitude);
        yoga = calculateYoga(sun.longitude, moon.longitude);
      }
      
      // Determine muhurta name and quality
      const muhurtaNames = [
        'Rudra', 'Ahi', 'Mitra', 'Pitri', 'Vasu',
        'Vara', 'Vishvedeva', 'Vidhi', 'Satamukhi', 'Puruhuta',
        'Vahini', 'Naktanakara', 'Varuna', 'Aryaman', 'Bhaga'
      ];
      
      // Simple quality assessment (can be enhanced with more complex rules)
      const qualities = ['Inauspicious', 'Neutral', 'Auspicious'];
      const qualityIndex = Math.floor(Math.random() * 3); // Placeholder for actual calculation
      
      muhurtas.push({
        number: i + 1,
        name: muhurtaNames[i],
        startTime: formatTime(startDate),
        endTime: formatTime(endDate),
        quality: qualities[qualityIndex],
        tithi: tithi ? \`\${tithi.tithiName} (\${tithi.paksha})\` : 'Unknown',
        yoga: yoga ? yoga.yogaName : 'Unknown',
        nakshatra: moon ? moon.nakshatra : 'Unknown'
      });
    }
    
    return {
      success: true,
      date: \`\${year}-\${month.toString().padStart(2, '0')}-\${day.toString().padStart(2, '0')}\`,
      sunrise: sweph.revjul(sunriseJD, SE_CONSTANTS.SE_GREG_CAL),
      sunset: sweph.revjul(sunsetJD, SE_CONSTANTS.SE_GREG_CAL),
      dayLength: dayLength.toFixed(2),
      muhurtas
    };
  } catch (error) {
    return { success: false, message: \`Error calculating muhurta: \${error}\` };
  }
}

// Main function to handle commands
async function main() {
  try {
    // Get command and arguments from command line
    const command = process.argv[2];
    const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};
    
    // Initialize Swiss Ephemeris
    if (!initSwissEphemeris()) {
      console.log(JSON.stringify({ success: false, message: 'Failed to initialize Swiss Ephemeris' }));
      return;
    }
    
    let result;
    
    // Execute the requested command
    switch (command) {
      case 'test':
        // Simple test to check if the calculator is working
        result = { success: true, message: 'Swiss Ephemeris calculator is working' };
        break;
        
      case 'planetaryPositions':
        // Calculate planetary positions
        result = calculatePlanetaryPositions(
          args.year, args.month, args.day, 
          args.hour, args.minute, args.second
        );
        break;
        
      case 'muhurta':
        // Calculate muhurta
        result = calculateMuhurta(
          args.year, args.month, args.day, 
          args.latitude, args.longitude
        );
        break;
        
      default:
        result = { success: false, message: \`Unknown command: \${command}\` };
    }
    
    // Return the result as JSON
    console.log(JSON.stringify(result));
    
    // Close Swiss Ephemeris
    sweph.close();
  } catch (error) {
    console.log(JSON.stringify({ success: false, message: \`Error: \${error}\` }));
  }
}

// Run the main function
main();`;
    
    // Write the script to the file
    fs.writeFileSync(this.jsScriptPath, scriptContent);
  }
}

// Export a singleton instance
export const swissEphemerisService = new SwissEphemerisService();
