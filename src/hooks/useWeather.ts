/**
 * useWeather Hook
 * Custom hook for fetching and managing weather data
 */

import { useEffect, useState } from "react";
import { getCurrentWeather } from "../services/weatherService";
import type { Coordinates, CurrentWeather } from "../types/weather";

interface WeatherState {
	currentWeather: CurrentWeather | null;
	loading: boolean;
	error: string | null;
}

export const useWeather = (coordinates: Coordinates | null) => {
	const [state, setState] = useState<WeatherState>({
		currentWeather: null,
		loading: false,
		error: null,
	});

	const fetchWeather = async () => {
		if (!coordinates) return;

		try {
			setState(prev => ({ ...prev, loading: true, error: null }));

			const currentWeather = await getCurrentWeather(coordinates);

			setState({
				currentWeather,
				loading: false,
				error: null,
			});
		} catch (error) {
			setState({
				currentWeather: null,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to fetch weather data",
			});
		}
	};

	useEffect(() => {
		if (coordinates) {
			fetchWeather();
		}
	}, [coordinates]);

	return {
		...state,
		refetch: fetchWeather,
	};
};
