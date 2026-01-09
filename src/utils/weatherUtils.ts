/**
 * Weather Utilities
 * Helper functions for weather-related operations
 */

import type { GradientKey } from "../theme";

/**
 * Formats temperature with degree symbol
 * @param temp - Temperature value
 * @returns Formatted temperature string (e.g., "25°")
 */
export const formatTemperature = (temp: number): string => {
	return `${Math.round(temp)}°`;
};

/**
 * Gets weather icon name based on OpenWeatherMap icon code
 * Uses Ionicons from @expo/vector-icons
 * @param iconCode - OpenWeatherMap icon code (e.g., "01d")
 * @returns Ionicon name
 */
export const getWeatherIcon = (iconCode: string): string => {
	const iconMap: Record<string, string> = {
		"01d": "sunny", // clear sky day
		"01n": "moon", // clear sky night
		"02d": "partly-sunny", // few clouds day
		"02n": "cloudy-night", // few clouds night
		"03d": "cloud", // scattered clouds
		"03n": "cloud",
		"04d": "cloudy", // broken clouds
		"04n": "cloudy",
		"09d": "rainy", // shower rain
		"09n": "rainy",
		"10d": "rainy", // rain day
		"10n": "rainy", // rain night
		"11d": "thunderstorm", // thunderstorm
		"11n": "thunderstorm",
		"13d": "snow", // snow
		"13n": "snow",
		"50d": "cloudy", // mist
		"50n": "cloudy",
	};

	return iconMap[iconCode] || "partly-sunny";
};

/**
 * Gets gradient colors based on weather condition
 * @param weatherMain - Main weather condition (e.g., "Clear", "Clouds", "Rain")
 * @returns Gradient key for theme colors
 */
export const getWeatherGradient = (weatherMain: string): GradientKey => {
	const condition = weatherMain.toLowerCase();

	if (condition.includes("clear")) return "clear";
	if (condition.includes("cloud")) return "clouds";
	if (condition.includes("rain")) return "rain";
	if (condition.includes("thunderstorm")) return "thunderstorm";
	if (condition.includes("snow")) return "snow";
	if (condition.includes("drizzle")) return "drizzle";
	if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
		return "mist";
	}

	return "clear"; // default
};

/**
 * Capitalizes first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string): string => {
	return text
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

/**
 * Gets wind direction from degrees
 * @param degrees - Wind direction in degrees
 * @returns Wind direction (e.g., "N", "NE", "E")
 */
export const getWindDirection = (degrees: number): string => {
	const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	const index = Math.round(degrees / 45) % 8;
	return directions[index];
};

/**
 * Formats wind speed with unit
 * @param speed - Wind speed in m/s
 * @returns Formatted wind speed in km/h as integer (e.g., "19 km/h")
 */
export const formatWindSpeed = (speed: number): string => {
	const kmh = Math.round(speed * 3.6);
	return `${kmh} km/h`;
};

/**
 * Formats humidity with percentage
 * @param humidity - Humidity value
 * @returns Formatted humidity (e.g., "65%")
 */
export const formatHumidity = (humidity: number): string => {
	return `${humidity}%`;
};

/**
 * Formats pressure with unit
 * @param pressure - Pressure in hPa
 * @returns Formatted pressure (e.g., "1013 hPa")
 */
export const formatPressure = (pressure: number): string => {
	return `${pressure} hPa`;
};

/**
 * Groups 3-hour forecast items into daily forecasts
 * @param forecastItems - Array of 3-hour forecast items
 * @returns Array of daily forecasts
 */
export const groupForecastByDay = (forecastItems: any[]): any[] => {
	const dailyMap = new Map<string, any>();

	forecastItems.forEach(item => {
		const date = item.dt_txt.split(" ")[0]; // Get date part (YYYY-MM-DD)

		if (!dailyMap.has(date)) {
			dailyMap.set(date, {
				date,
				dt: item.dt,
				temp_min: item.main.temp_min,
				temp_max: item.main.temp_max,
				weather: item.weather,
				pop: item.pop,
				items: [item],
			});
		} else {
			const existing = dailyMap.get(date);
			existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
			existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
			existing.pop = Math.max(existing.pop, item.pop);
			existing.items.push(item);
		}
	});

	return Array.from(dailyMap.values());
};
