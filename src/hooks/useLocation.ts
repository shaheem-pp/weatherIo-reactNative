/**
 * useLocation Hook
 * Custom hook for managing location permissions and fetching coordinates
 */

import * as Location from "expo-location";
import { useEffect, useState } from "react";
import type { Coordinates } from "../types/weather";

interface LocationState {
	coordinates: Coordinates | null;
	loading: boolean;
	error: string | null;
}

export const useLocation = () => {
	const [state, setState] = useState<LocationState>({
		coordinates: null,
		loading: true,
		error: null,
	});

	const requestLocation = async () => {
		try {
			setState(prev => ({ ...prev, loading: true, error: null }));

			// Request location permissions
			const { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== "granted") {
				throw new Error("Location permission not granted");
			}

			// Get current position
			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			setState({
				coordinates: {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				},
				loading: false,
				error: null,
			});
		} catch (error) {
			setState({
				coordinates: null,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to get location",
			});
		}
	};

	useEffect(() => {
		requestLocation();
	}, []);

	return {
		...state,
		refetch: requestLocation,
	};
};
