/**
 * HomeScreen Component
 * Main screen displaying current weather and forecast
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
import { ErrorScreen, LoadingScreen, SearchBar, WeatherCard } from "../components";
import { useLocation, useWeather } from "../hooks";
import { getCurrentWeatherByCity } from "../services/weatherService";
import { borderRadius, colors, spacing, typography } from "../theme";
import type { CurrentWeather } from "../types/weather";
import { capitalizeWords, formatDate, getWeatherGradient } from "../utils";

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
	const conditionLabel = capitalizeWords(currentWeather.weather[0].main);

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
						<View style={styles.headerBadge}>
							<Ionicons name="sparkles" size={14} color={colors.text.light} />
							<Text style={styles.headerBadgeText}>{conditionLabel}</Text>
						</View>
					</View>

					{/* Search Bar */}
					<SearchBar onSearch={handleCitySearch} placeholder="Search for a city..." />

					{/* Search Result Badge */}
					{isShowingSearchResult && (
						<View style={styles.searchBadge}>
							<Ionicons name="search" size={14} color={colors.text.light} />
							<Text style={styles.searchBadgeText}>Search Result</Text>
						</View>
					)}

					{/* Show current location button when displaying search result */}
					{isShowingSearchResult && (
						<TouchableOpacity style={styles.locationButton} onPress={handleClearSearch}>
							<Ionicons name="locate" size={18} color={colors.text.light} />
							<Text style={styles.locationButtonText}>Back to Current Location</Text>
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
		padding: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing["2xl"],
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
	headerBadgeText: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.label,
		color: colors.text.light,
	},
	searchBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		alignSelf: "flex-start",
		marginBottom: spacing.sm,
		backgroundColor: "rgba(15, 26, 38, 0.35)",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.full,
	},
	searchBadgeText: {
		fontSize: typography.sizes.xs,
		fontFamily: typography.fonts.label,
		color: colors.text.muted,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	locationButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.surface,
		borderRadius: borderRadius.full,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		gap: spacing.sm,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	locationButtonText: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.label,
		color: colors.text.light,
		textTransform: "uppercase",
		letterSpacing: 0.8,
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
