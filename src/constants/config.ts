/**
 * Application Constants
 * Centralized configuration and constant values
 */

/**
 * OpenWeatherMap API Configuration
 */
export const API_CONFIG = {
	BASE_URL: "https://api.openweathermap.org/data/2.5",
	API_KEY: process.env.EXPO_PUBLIC_WEATHER_API_KEY || "",
	UNITS: "metric", // Use metric units (Celsius, m/s)
	LANG: "en",
};

/**
 * API Endpoints
 */
export const ENDPOINTS = {
	CURRENT_WEATHER: "/weather",
	FORECAST_5_DAY: "/forecast",
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
	FORECAST_ITEMS: 40, // Number of forecast items to fetch (5 days, 8 per day)
	LOCATION_UPDATE_INTERVAL: 600000, // Update location every 10 minutes (in milliseconds)
};
