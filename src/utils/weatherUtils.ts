/**
 * Weather Utility Functions
 * Helper functions for weather data processing
 */

import type { ForecastDay, ForecastItem } from "../types/weather";

/**
 * Get weather icon URL from icon code
 */
export const getWeatherIconUrl = (iconCode: string, size: "2x" | "4x" = "2x"): string => {
	return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

/**
 * Check if it's currently night time based on current time and sunrise/sunset
 */
export const isNightTime = (currentTime: number, sunrise: number, sunset: number): boolean => {
	return currentTime < sunrise || currentTime > sunset;
};

/**
 * Group forecast items by day
 */
export const groupForecastByDay = (forecastList: ForecastItem[]): ForecastDay[] => {
	const days: { [key: string]: ForecastItem[] } = {};

	// Group forecast items by date
	forecastList.forEach(item => {
		const date = new Date(item.dt * 1000).toLocaleDateString();
		if (!days[date]) {
			days[date] = [];
		}
		days[date].push(item);
	});

	// Calculate min/max for each day and create ForecastDay objects
	const forecastDays: ForecastDay[] = Object.entries(days).map(([date, items]) => {
		const temps = items.map(item => item.main.temp);
		const temp_min = Math.min(...temps);
		const temp_max = Math.max(...temps);

		// Use the weather condition that appears most frequently during the day
		const weatherCounts: { [key: string]: number } = {};
		items.forEach(item => {
			const weather = item.weather[0].main;
			weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
		});
		const dominantWeather = Object.keys(weatherCounts).reduce((a, b) =>
			weatherCounts[a] > weatherCounts[b] ? a : b
		);

		const weatherItem = items.find(item => item.weather[0].main === dominantWeather)!;

		// Calculate average precipitation probability
		const avgPop = items.reduce((sum, item) => sum + item.pop, 0) / items.length;

		return {
			date,
			dt: items[0].dt,
			temp_min,
			temp_max,
			weather: weatherItem.weather,
			pop: avgPop,
		};
	});

	return forecastDays;
};

/**
 * Get hourly forecast (next 24 hours)
 */
export const getHourlyForecast = (
	forecastList: ForecastItem[],
	count: number = 8
): ForecastItem[] => {
	return forecastList.slice(0, count);
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number): string => {
	const directions = [
		"N",
		"NNE",
		"NE",
		"ENE",
		"E",
		"ESE",
		"SE",
		"SSE",
		"S",
		"SSW",
		"SW",
		"WSW",
		"W",
		"WNW",
		"NW",
		"NNW",
	];
	const index = Math.round(degrees / 22.5) % 16;
	return directions[index];
};

/**
 * Convert meters per second to kilometers per hour
 */
export const msToKmh = (ms: number): number => {
	return Math.round(ms * 3.6);
};

/**
 * Convert meters per second to miles per hour
 */
export const msToMph = (ms: number): number => {
	return Math.round(ms * 2.237);
};

/**
 * Get UV Index description
 */
export const getUVIndexDescription = (uvIndex: number): string => {
	if (uvIndex <= 2) return "Low";
	if (uvIndex <= 5) return "Moderate";
	if (uvIndex <= 7) return "High";
	if (uvIndex <= 10) return "Very High";
	return "Extreme";
};

/**
 * Get air quality description
 */
export const getAirQualityDescription = (aqi: number): string => {
	switch (aqi) {
		case 1:
			return "Good";
		case 2:
			return "Fair";
		case 3:
			return "Moderate";
		case 4:
			return "Poor";
		case 5:
			return "Very Poor";
		default:
			return "Unknown";
	}
};

/**
 * Format visibility in km
 */
export const formatVisibility = (meters: number): string => {
	const km = meters / 1000;
	return km >= 10 ? "10+ km" : `${km.toFixed(1)} km`;
};

/**
 * Get weather description with proper capitalization
 */
export const formatWeatherDescription = (description: string): string => {
	return description
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

/**
 * Get feels like description
 */
export const getFeelsLikeDescription = (actual: number, feelsLike: number): string => {
	const diff = Math.abs(actual - feelsLike);
	if (diff < 2) return "Similar to actual temperature";
	if (feelsLike > actual) return `Feels ${diff.toFixed(0)}° warmer`;
	return `Feels ${diff.toFixed(0)}° cooler`;
};
