/**
 * Type definitions for sweph library
 * This is a simplified version of the type definitions for the Swiss Ephemeris library
 */

declare module 'sweph' {
  // Constants
  export const SUN: number;
  export const MOON: number;
  export const MERCURY: number;
  export const VENUS: number;
  export const MARS: number;
  export const JUPITER: number;
  export const SATURN: number;
  export const URANUS: number;
  export const NEPTUNE: number;
  export const PLUTO: number;
  export const MEAN_NODE: number;
  export const TRUE_NODE: number;
  export const MEAN_APOG: number;
  export const OSCU_APOG: number;
  export const EARTH: number;
  export const CHIRON: number;
  export const PHOLUS: number;
  export const CERES: number;
  export const PALLAS: number;
  export const JUNO: number;
  export const VESTA: number;
  
  // Calendar types
  export const GREG_CAL: number;
  export const JUL_CAL: number;
  
  // Calculation flags
  export const FLG_JPLEPH: number;
  export const FLG_SWIEPH: number;
  export const FLG_MOSEPH: number;
  export const FLG_SPEED: number;
  export const FLG_EQUATORIAL: number;
  export const FLG_XYZ: number;
  export const FLG_RADIANS: number;
  export const FLG_BARYCTR: number;
  export const FLG_TOPOCTR: number;
  export const FLG_SIDEREAL: number;
  export const FLG_ICRS: number;
  export const FLG_HELCTR: number;
  export const FLG_TRUEPOS: number;
  export const FLG_J2000: number;
  export const FLG_NOABERR: number;
  export const FLG_NOGDEFL: number;
  export const FLG_NONUT: number;
  export const FLG_ORBEL: number;
  export const FLG_TROPICAL: number;
  
  // Rise, set, and transit constants
  export const CALC_RISE: number;
  // Functions
  export function version(): string;
  export function set_ephe_path(path: string): void;
  export function set_topo(latitude: number, longitude: number, altitude: number): void;
  
  export function julday(year: number, month: number, day: number, hour: number, calendar: number): number;
  export function revjul(julianDay: number, calendar: number): { year: number, month: number, day: number, hour: number };
  
  export interface CalcResult {
    flag: number;
    error: string;
    data: number[];
    longitude?: number;
    latitude?: number;
    distance?: number;
    longitudeSpeed?: number;
    latitudeSpeed?: number;
    distanceSpeed?: number;
  }
  
  export function calc_ut(julianDay: number, planet: number, flags: number): CalcResult;
  
  export interface RiseTransResult {
    flag: number;
    error: string;
    tret: number[];
  }
  
  export function rise_trans(
    julianDay: number,
    planet: number,
    riseSetFlag: number,
    geoPosition: { lon: number, lat: number },
    atPress?: number,
    atTemp?: number,
    rsmi?: number,
    rgeo?: number
  ): RiseTransResult;
  
  export function houses(
    tjd_ut: number,
    lat: number,
    lon: number,
    hsys: string
  ): {
    cusps: number[];
    ascmc: number[];
    serr: string;
  };
  
  export function house_pos(
    armc: number,
    lat: number,
    eps: number,
    hsys: string,
    lon: number,
    lat2: number
  ): number;
  
  export function get_ayanamsa_ut(tjd_ut: number): number;
  export function version(): string;
}
