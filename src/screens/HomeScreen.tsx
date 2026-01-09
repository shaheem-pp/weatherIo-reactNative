/**
 * HomeScreen Component
 * Main screen displaying current weather and forecast
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { ErrorScreen, LoadingScreen, WeatherCard } from "../components";
import { useLocation, useWeather } from "../hooks";
import { colors, spacing, typography } from "../theme";
import { formatDate, getWeatherGradient } from "../utils";

export const HomeScreen: React.FC = () => {
	// Fetch location
	const {
		coordinates,
		loading: locationLoading,
		error: locationError,
		refetch: refetchLocation,
	} = useLocation();

	// Fetch weather data
	const {
		currentWeather,
		loading: weatherLoading,
		error: weatherError,
		refetch: refetchWeather,
	} = useWeather(coordinates);

	// Handle refresh
	const handleRefresh = () => {
		if (coordinates) {
			refetchWeather();
		} else {
			refetchLocation();
		}
	};

	// Show loading screen
	if (locationLoading || (weatherLoading && !currentWeather)) {
		return <LoadingScreen message="Getting your weather..." />;
	}

	// Show error screen
	if (locationError || weatherError) {
		return (
			<ErrorScreen
				message={locationError || weatherError || "Something went wrong"}
				onRetry={handleRefresh}
			/>
		);
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
							refreshing={weatherLoading}
							onRefresh={handleRefresh}
							tintColor={colors.text.light}
						/>
					}
				>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.dateText}>{formatDate(currentWeather.dt)}</Text>
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
	header: {
		marginBottom: spacing.xl,
		marginTop: spacing.sm,
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
});
