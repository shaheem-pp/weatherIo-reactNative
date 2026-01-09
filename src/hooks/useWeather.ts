/**
 * useWeather Hook
 * Custom hook for fetching and managing weather data
 */

import { useEffect, useState } from "react";
import { getWeatherData } from "../services/weatherService";
import type { Coordinates, CurrentWeather, ForecastResponse } from "../types/weather";

interface WeatherState {
	currentWeather: CurrentWeather | null;
	forecast: ForecastResponse | null;
	loading: boolean;
	error: string | null;
}

export const useWeather = (coordinates: Coordinates | null) => {
	const [state, setState] = useState<WeatherState>({
		currentWeather: null,
		forecast: null,
		loading: false,
		error: null,
	});

	const fetchWeather = async () => {
		if (!coordinates) return;

		try {
			setState(prev => ({ ...prev, loading: true, error: null }));

			const data = await getWeatherData(coordinates);

			setState({
				currentWeather: data.currentWeather,
				forecast: data.forecast,
				loading: false,
				error: null,
			});
		} catch (error) {
			setState({
				currentWeather: null,
				forecast: null,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to fetch weather data",
			});
		}
	};

	const refetch = () => {
		fetchWeather();
	};

	useEffect(() => {
		if (coordinates) {
			fetchWeather();
		}
	}, [coordinates?.latitude, coordinates?.longitude]);

	return {
		...state,
		refetch,
	};
};
