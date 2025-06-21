/**
 * Swiss Ephemeris Proof of Concept
 * 
 * This file demonstrates basic usage of the sweph library for astrological calculations
 * relevant to muhurat determination.
 */

import * as sweph from 'sweph';
import { SE_CONSTANTS } from './constants';

// Initialize Swiss Ephemeris with the path to ephemeris files
const initSwissEphemeris = () => {
  try {
    // Set the path to the ephemeris files
    sweph.set_ephe_path('./ephe');
    console.log('Swiss Ephemeris initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Swiss Ephemeris:', error);
    return false;
  }
};

// Calculate planetary positions for a given date and time
const calculatePlanetaryPositions = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number
) => {
  try {
    // Convert date and time to Julian day
    const julianDay = sweph.julday(year, month, day, hour + minute / 60 + second / 3600, SE_CONSTANTS.SE_GREG_CAL);
    
    // Define planets to calculate (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu/Ketu)
    const planets = [
      { id: SE_CONSTANTS.SE_SUN, name: 'Sun' },
      { id: SE_CONSTANTS.SE_MOON, name: 'Moon' },
      { id: SE_CONSTANTS.SE_MERCURY, name: 'Mercury' },
      { id: SE_CONSTANTS.SE_VENUS, name: 'Venus' },
      { id: SE_CONSTANTS.SE_MARS, name: 'Mars' },
      { id: SE_CONSTANTS.SE_JUPITER, name: 'Jupiter' },
      { id: SE_CONSTANTS.SE_SATURN, name: 'Saturn' },
      { id: SE_CONSTANTS.SE_MEAN_NODE, name: 'Rahu' } // North Node (Rahu)
    ];
    
    // Calculate positions
    const positions = planets.map(planet => {
      // Calculate planet position (longitude, latitude, distance, etc.)
      const result = sweph.calc_ut(julianDay, planet.id, SE_CONSTANTS.SE_FLG_SWIEPH);
      
      // Get the zodiac sign (0-11) and degrees within the sign
      // data[0] contains the longitude in degrees
      const longitude = result.data[0];
      const zodiacSign = Math.floor(longitude / 30);
      const degreesInSign = longitude % 30;
      
      // Get nakshatra (lunar mansion) - 27 nakshatras in 360 degrees
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
        nakshatra_num: nakshatra + 1, // 1-27 for display
      };
    });
    
    return positions;
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    return [];
  }
};

// Calculate tithi (lunar day) - the angular distance between Sun and Moon divided by 12 degrees
const calculateTithi = (sunLongitude: number, moonLongitude: number) => {
  let angle = moonLongitude - sunLongitude;
  if (angle < 0) angle += 360;
  
  const tithi = Math.floor(angle / 12) + 1; // 1-30
  
  // Tithi names
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', // 1-15 Shukla Paksha
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya' // 16-30 Krishna Paksha
  ];
  
  const paksha = tithi <= 15 ? 'Shukla' : 'Krishna';
  
  return {
    tithi,
    tithiName: tithiNames[tithi - 1],
    paksha
  };
};

// Calculate yoga - the sum of Sun and Moon longitudes divided by 13.333 degrees
const calculateYoga = (sunLongitude: number, moonLongitude: number) => {
  let sum = sunLongitude + moonLongitude;
  if (sum >= 360) sum -= 360;
  
  const yoga = Math.floor(sum / (360/27)) + 1; // 1-27
  
  // Yoga names
  const yogaNames = [
    'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  
  return {
    yoga,
    yogaName: yogaNames[yoga - 1]
  };
};

// Interface for Muhurta object
interface Muhurta {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  quality: string;
  tithi: string;
  yoga: string;
  nakshatra: string;
}

// Interface for Tithi object
interface Tithi {
  tithi: number;
  tithiName: string;
  paksha: string;
}

// Interface for Yoga object
interface Yoga {
  yoga: number;
  yogaName: string;
}

// Calculate muhurta for a given date and location
const calculateMuhurta = (
  year: number,
  month: number,
  day: number,
  latitude: number,
  longitude: number
) => {
  try {
    // We assume Swiss Ephemeris is already initialized by the caller
    // No need to initialize here as it should be done once at the application level
    
    // Set geographic location
    sweph.set_topo(latitude, longitude, 0); // latitude, longitude, altitude
    
    // Calculate sunrise and sunset times
    const julianDay = sweph.julday(year, month, day, 0, SE_CONSTANTS.SE_GREG_CAL);
    
    // Calculate sunrise and sunset times using a different approach
    // Since rise_trans is causing issues, we'll use approximate values for now
    
    // For locations in the tropics, sunrise is approximately 6 AM and sunset is approximately 6 PM
    // This is a simplified approach until we can fix the rise_trans function
    console.log('Using approximate sunrise/sunset times for now');  
    
    // Calculate approximate sunrise (6 AM) and sunset (6 PM) Julian days
    const sunriseJD = julianDay + (6/24);  // 6 AM
    const sunsetJD = julianDay + (18/24);  // 6 PM
    
    console.log('Approximate sunrise JD:', sunriseJD);
    console.log('Approximate sunset JD:', sunsetJD);
    
    // Calculate day length in hours
    const dayLength = (sunsetJD - sunriseJD) * 24;
    
    // In Vedic astrology, a day is divided into 15 muhurtas (from sunrise to sunset)
    const muhurtaDuration = dayLength / 15; // duration of each muhurta in hours
    
    // Calculate muhurtas for the day
    const muhurtas: Muhurta[] = [];
    for (let i = 0; i < 15; i++) {
      const startTime = sunriseJD + (i * muhurtaDuration) / 24;
      const endTime = sunriseJD + ((i + 1) * muhurtaDuration) / 24;
      
      // Convert Julian day to date and time
      const startDate = sweph.revjul(startTime, SE_CONSTANTS.SE_GREG_CAL);
      const endDate = sweph.revjul(endTime, SE_CONSTANTS.SE_GREG_CAL);
      
      // Format times
      const formatTime = (date: any) => {
        const hour = Math.floor(date.hour);
        const minute = Math.floor((date.hour - hour) * 60);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      };
      
      // Calculate planetary positions at the middle of the muhurta
      const midTime = (startTime + endTime) / 2;
      const midDate = sweph.revjul(midTime, SE_CONSTANTS.SE_GREG_CAL);
      const positions = calculatePlanetaryPositions(
        midDate.year, midDate.month, midDate.day, 
        midDate.hour, Math.floor((midDate.hour - Math.floor(midDate.hour)) * 60), 0
      );
      
      // Find Sun and Moon positions
      const sun = positions.find(p => p.planet === 'Sun');
      const moon = positions.find(p => p.planet === 'Moon');
      
      // Calculate tithi and yoga if Sun and Moon positions are available
      let tithi: Tithi | null = null;
      let yoga: Yoga | null = null;
      
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
        tithi: tithi ? `${tithi.tithiName} (${tithi.paksha})` : 'Unknown',
        yoga: yoga ? yoga.yogaName : 'Unknown',
        nakshatra: moon ? moon.nakshatra : 'Unknown'
      } as Muhurta);
    }
    
    return {
      success: true,
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      sunrise: sweph.revjul(sunriseJD, SE_CONSTANTS.SE_GREG_CAL),
      sunset: sweph.revjul(sunsetJD, SE_CONSTANTS.SE_GREG_CAL),
      dayLength: dayLength.toFixed(2),
      muhurtas
    };
  } catch (error: unknown) {
    console.error('Error calculating muhurta:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Error: ${errorMessage}` };
  }
  // We don't close Swiss Ephemeris here as it should be closed by the caller when done with all calculations
};

// Export functions for use in the main application
export {
  initSwissEphemeris,
  calculatePlanetaryPositions,
  calculateTithi,
  calculateYoga,
  calculateMuhurta
};
