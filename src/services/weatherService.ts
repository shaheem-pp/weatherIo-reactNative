/**
 * Weather Service
 * Handles all API calls to OpenWeatherMap
 */

import axios from "axios";
import { API_CONFIG, APP_CONFIG, ENDPOINTS } from "../constants/config";
import type { Coordinates, CurrentWeather, ForecastResponse } from "../types/weather";

/**
 * Base axios instance with default configuration
 */
const apiClient = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	timeout: 10000,
	params: {
		appid: API_CONFIG.API_KEY,
		units: API_CONFIG.UNITS,
		lang: API_CONFIG.LANG,
	},
});

/**
 * Fetches current weather data for given coordinates
 * @param coordinates - Latitude and longitude
 * @returns Promise with current weather data
 */
export const getCurrentWeather = async (coordinates: Coordinates): Promise<CurrentWeather> => {
	try {
		const response = await apiClient.get<CurrentWeather>(ENDPOINTS.CURRENT_WEATHER, {
			params: {
				lat: coordinates.latitude,
				lon: coordinates.longitude,
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(`Failed to fetch current weather: ${error.message}`);
		}
		throw error;
	}
};

/**
 * Fetches current weather data by city name
 * @param cityName - City name to search for
 * @returns Promise with current weather data
 */
export const getCurrentWeatherByCity = async (cityName: string): Promise<CurrentWeather> => {
	try {
		const response = await apiClient.get<CurrentWeather>(ENDPOINTS.CURRENT_WEATHER, {
			params: {
				q: cityName,
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				throw new Error("City not found. Please check the spelling and try again.");
			}
			throw new Error(`Failed to fetch weather: ${error.message}`);
		}
		throw error;
	}
};

/**
 * Fetches 5-day weather forecast for given coordinates
 * @param coordinates - Latitude and longitude
 * @returns Promise with forecast data
 */
export const getForecast = async (coordinates: Coordinates): Promise<ForecastResponse> => {
	try {
		const response = await apiClient.get<ForecastResponse>(ENDPOINTS.FORECAST_5_DAY, {
			params: {
				lat: coordinates.latitude,
				lon: coordinates.longitude,
				cnt: APP_CONFIG.FORECAST_ITEMS,
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(`Failed to fetch forecast: ${error.message}`);
		}
		throw error;
	}
};

/**
 * Fetches both current weather and forecast data
 * @param coordinates - Latitude and longitude
 * @returns Promise with both current weather and forecast
 */
export const getWeatherData = async (coordinates: Coordinates) => {
	try {
		const [currentWeather, forecast] = await Promise.all([
			getCurrentWeather(coordinates),
			getForecast(coordinates),
		]);

		return {
			currentWeather,
			forecast,
		};
	} catch (error) {
		throw error;
	}
};
