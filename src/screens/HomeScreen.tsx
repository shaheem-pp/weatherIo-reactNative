/**
 * HomeScreen Component
 * Main screen displaying current weather with city picker
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
	RefreshControl,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CityPicker, ErrorScreen, LoadingScreen, WeatherCard } from "../components";
import type { City } from "../constants/cities";
import { CITIES } from "../constants/cities";
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

	// Handle city selection from picker
	const handleCitySelect = async (city: City) => {
		try {
			setSearchLoading(true);
			setSearchError(null);
			const weather = await getCurrentWeatherByCity(city.name);
			setSearchedWeather(weather);
		} catch (error) {
			setSearchError(error instanceof Error ? error.message : "Failed to load city weather");
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
			// Re-fetch the same city
			handleCitySelect({
				name: searchedWeather.name,
				country: searchedWeather.sys.country,
				lat: searchedWeather.coord.lat,
				lon: searchedWeather.coord.lon,
				display: `${searchedWeather.name}, ${searchedWeather.sys.country}`,
			});
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
				<View pointerEvents="none" style={styles.glowTop} />
				<View pointerEvents="none" style={styles.glowBottom} />
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
					<View style={styles.header}>
						<View>
							<Text style={styles.title}>Weatherio</Text>
							<Text style={styles.subtitle}>{formatDate(currentWeather.dt)}</Text>
						</View>
					</View>

					{/* City Picker */}
					<CityPicker cities={CITIES} onSelectCity={handleCitySelect} />

					{/* Clear Button - Show when displaying search result */}
					{isShowingSearchResult && (
						<TouchableOpacity
							style={styles.clearButton}
							onPress={handleClearSearch}
							activeOpacity={0.7}
						>
							<Ionicons name="close-circle" size={20} color={colors.text.light} />
							<Text style={styles.clearButtonText}>Clear & Return to Current Location</Text>
						</TouchableOpacity>
					)}

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
		flexGrow: 1,
		padding: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.lg,
	},
	title: {
		fontSize: typography.sizes["3xl"],
		fontFamily: typography.fonts.display,
		color: colors.text.light,
	},
	subtitle: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
		marginTop: spacing.xs,
	},
	headerBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: colors.glassStrong,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.full,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	clearButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderRadius: borderRadius.full,
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
	clearButtonText: {
		fontSize: typography.sizes.sm,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
	},
	glowTop: {
		position: "absolute",
		right: -120,
		top: -80,
		width: 260,
		height: 260,
		borderRadius: 130,
		backgroundColor: colors.glow,
	},
	glowBottom: {
		position: "absolute",
		left: -140,
		bottom: -120,
		width: 280,
		height: 280,
		borderRadius: 140,
		backgroundColor: colors.glowStrong,
	},
});
