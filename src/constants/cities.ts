/**
 * Major Cities List
 * Precomputed from all-the-cities to keep runtime bundle RN-friendly
 */

import majorCities from "./majorCities.json";

export interface CityOption {
	name: string;
	country: string;
	display: string;
	search: string;
}

export const POPULAR_CITIES: CityOption[] = majorCities as CityOption[];
