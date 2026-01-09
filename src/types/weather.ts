/**
 * TypeScript Interfaces for Weather Data
 * Defines types for API responses and weather data structures
 */

/**
 * Current Weather Response from OpenWeatherMap API
 */
export interface CurrentWeather {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type?: number;
		id?: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

/**
 * Forecast item from 5-day forecast API
 */
export interface ForecastItem {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	visibility: number;
	pop: number; // Probability of precipitation
	rain?: {
		"3h": number;
	};
	snow?: {
		"3h": number;
	};
	dt_txt: string;
}

/**
 * Grouped forecast by day
 */
export interface ForecastDay {
	date: string;
	dt: number;
	temp_min: number;
	temp_max: number;
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	pop: number;
}

/**
 * 5-day Forecast Response from OpenWeatherMap API
 */
export interface ForecastResponse {
	city: {
		id: number;
		name: string;
		coord: {
			lon: number;
			lat: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
	cod: string;
	message: number;
	cnt: number;
	list: ForecastItem[];
}

/**
 * Location Coordinates
 */
export interface Coordinates {
	latitude: number;
	longitude: number;
}
