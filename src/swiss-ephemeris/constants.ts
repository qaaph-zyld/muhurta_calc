/**
 * Swiss Ephemeris Constants
 * 
 * This file contains constants for the Swiss Ephemeris library.
 * These constants are not exported by the library and need to be defined manually.
 */

export const SE_CONSTANTS = {
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
  SE_MEAN_NODE: 10, // Rahu (North Node)
  SE_TRUE_NODE: 11,
  SE_MEAN_APOG: 12, // Ketu (South Node)
  SE_OSCU_APOG: 13,
  SE_EARTH: 14,
  SE_CHIRON: 15,
  SE_PHOLUS: 16,
  SE_CERES: 17,
  SE_PALLAS: 18,
  SE_JUNO: 19,
  SE_VESTA: 20,
  
  // Calculation flags
  SE_FLG_JPLEPH: 1,
  SE_FLG_SWIEPH: 2,
  SE_FLG_MOSEPH: 4,
  SE_FLG_SPEED: 256,
  SE_FLG_EQUATORIAL: 2048,
  SE_FLG_XYZ: 4096,
  SE_FLG_RADIANS: 8192,
  SE_FLG_BARYCTR: 16384,
  SE_FLG_TOPOCTR: 32768,
  SE_FLG_SIDEREAL: 65536,
  
  // Rise, set, and transit constants
  SE_CALC_RISE: 1,
  SE_CALC_SET: 2,
  SE_CALC_MTRANSIT: 4,
  SE_CALC_ITRANSIT: 8
};
