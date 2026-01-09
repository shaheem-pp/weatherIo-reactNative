/**
 * HomeScreen Component
 * Main screen displaying current weather and forecast
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { ErrorScreen, LoadingScreen, SearchBar, WeatherCard } from "../components";
import { useLocation, useWeather } from "../hooks";
import { getCurrentWeatherByCity } from "../services/weatherService";
import { borderRadius, colors, spacing, typography } from "../theme";
import type { CurrentWeather } from "../types/weather";
import { formatDate, getWeatherGradient } from "../utils";

export const HomeScreen: React.FC = () => {
	const [searchedWeather, setSearchedWeather] = useState<CurrentWeather | null>(null);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	// Fetch location
	const {
		coordinates,
		loading: locationLoading,
		error: locationError,
		refetch: refetchLocation,
	} = useLocation();

	// Fetch weather data for current location
	const {
		currentWeather: locationWeather,
		loading: weatherLoading,
		error: weatherError,
		refetch: refetchWeather,
	} = useWeather(coordinates);

	// Determine which weather to display
	const currentWeather = searchedWeather || locationWeather;
	const isShowingSearchResult = searchedWeather !== null;

	// Handle city search
	const handleCitySearch = async (cityName: string) => {
		try {
			setSearchLoading(true);
			setSearchError(null);
			const weather = await getCurrentWeatherByCity(cityName);
			setSearchedWeather(weather);
		} catch (error) {
			setSearchError(error instanceof Error ? error.message : "Failed to search city");
			setSearchedWeather(null);
		} finally {
			setSearchLoading(false);
		}
	};

	// Handle clear search and return to current location
	const handleClearSearch = () => {
		setSearchedWeather(null);
		setSearchError(null);
	};

	// Handle refresh
	const handleRefresh = () => {
		if (isShowingSearchResult && searchedWeather) {
			// Re-search the same city
			handleCitySearch(searchedWeather.name);
		} else if (coordinates) {
			refetchWeather();
		} else {
			refetchLocation();
		}
	};

	// Show loading screen
	if (
		(locationLoading && !searchedWeather) ||
		(weatherLoading && !currentWeather && !searchedWeather)
	) {
		return <LoadingScreen message="Getting your weather..." />;
	}

	// Show search loading
	if (searchLoading) {
		return <LoadingScreen message="Searching for city..." />;
	}

	// Show error screen for location/weather errors (only if not showing search result)
	if (!searchedWeather && (locationError || weatherError)) {
		return (
			<ErrorScreen
				message={locationError || weatherError || "Something went wrong"}
				onRetry={handleRefresh}
			/>
		);
	}

	// Show search error as overlay
	if (searchError && !searchedWeather) {
		return <ErrorScreen message={searchError} onRetry={() => setSearchError(null)} />;
	}

	// Show error if no data
	if (!currentWeather) {
		return <ErrorScreen message="Unable to load weather data" onRetry={handleRefresh} />;
	}

	// Get gradient based on weather condition
	const gradientColors = colors.gradients[getWeatherGradient(currentWeather.weather[0].main)];

	return (
		<LinearGradient colors={gradientColors} style={styles.container}>
			<StatusBar barStyle="light-content" />
			<SafeAreaView style={styles.safeArea}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={weatherLoading || searchLoading}
							onRefresh={handleRefresh}
							tintColor={colors.text.light}
						/>
					}
				>
					{/* Search Bar */}
					<SearchBar onSearch={handleCitySearch} placeholder="Search for a city..." />

					{/* Show current location button when displaying search result */}
					{isShowingSearchResult && (
						<TouchableOpacity style={styles.locationButton} onPress={handleClearSearch}>
							<Ionicons name="location" size={18} color={colors.text.light} />
							<Text style={styles.locationButtonText}>Back to Current Location</Text>
						</TouchableOpacity>
					)}

					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.dateText}>{formatDate(currentWeather.dt)}</Text>
						{isShowingSearchResult && (
							<View style={styles.searchBadge}>
								<Ionicons name="search" size={14} color={colors.text.light} />
								<Text style={styles.searchBadgeText}>Search Result</Text>
							</View>
						)}
					</View>

					{/* Current Weather Card */}
					<WeatherCard weather={currentWeather} />
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.lg,
		paddingTop: spacing.md,
	},
	locationButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: borderRadius.lg,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		gap: spacing.sm,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	locationButtonText: {
		fontSize: typography.sizes.base,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
	},
	header: {
		marginBottom: spacing.xl,
		marginTop: spacing.sm,
		alignItems: "center",
	},
	dateText: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
		textAlign: "center",
		opacity: 0.95,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	searchBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.full,
		marginTop: spacing.sm,
	},
	searchBadgeText: {
		fontSize: typography.sizes.sm,
		fontWeight: typography.weights.medium,
		color: colors.text.light,
		opacity: 0.95,
	},
});
