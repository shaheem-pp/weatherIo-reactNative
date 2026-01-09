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
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" />
			<LinearGradient colors={gradientColors} style={styles.container}>
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
			</LinearGradient>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.lg,
	},
	header: {
		marginBottom: spacing.lg,
	},
	dateText: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.medium,
		color: colors.text.light,
		textAlign: "center",
	},
});
