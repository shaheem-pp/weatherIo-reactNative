/**
 * Home Screen
 * Main weather display screen with all weather information
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	CurrentWeatherCard,
	DailyForecast,
	ErrorScreen,
	HourlyForecast,
	LoadingScreen,
	WeatherDetails,
} from "../components";
import { useLocation, useWeather } from "../hooks";
import { getWeatherTheme } from "../theme";
import { spacing } from "../theme/spacing";
import { getHourlyForecast, groupForecastByDay, isNightTime } from "../utils";

export const HomeScreen: React.FC = () => {
	const { coordinates, loading: locationLoading, error: locationError } = useLocation();
	const {
		currentWeather,
		forecast,
		loading: weatherLoading,
		error: weatherError,
		refetch,
	} = useWeather(coordinates);

	// Determine if it's night time
	const isNight = useMemo(() => {
		if (!currentWeather) return false;
		return isNightTime(currentWeather.dt, currentWeather.sys.sunrise, currentWeather.sys.sunset);
	}, [currentWeather]);

	// Get theme based on weather conditions
	const theme = useMemo(() => {
		if (!currentWeather) return getWeatherTheme("Clear", false);
		return getWeatherTheme(currentWeather.weather[0].main, isNight);
	}, [currentWeather, isNight]);

	// Process forecast data
	const hourlyForecast = useMemo(() => {
		if (!forecast) return [];
		return getHourlyForecast(forecast.list, 8);
	}, [forecast]);

	const dailyForecast = useMemo(() => {
		if (!forecast) return [];
		return groupForecastByDay(forecast.list).slice(0, 5);
	}, [forecast]);

	// Loading state
	if (locationLoading || weatherLoading) {
		return (
			<LoadingScreen
				message={locationLoading ? "Getting your location..." : "Loading weather data..."}
			/>
		);
	}

	// Error state
	if (locationError || weatherError) {
		return (
			<ErrorScreen
				message={locationError || weatherError || "Something went wrong"}
				onRetry={refetch}
			/>
		);
	}

	// No data state
	if (!currentWeather || !forecast) {
		return <LoadingScreen message="Preparing weather data..." />;
	}

	return (
		<View style={styles.container}>
			<StatusBar style={isNight ? "light" : "auto"} />
			<LinearGradient colors={theme.gradient} style={styles.gradient}>
				<SafeAreaView style={styles.safeArea} edges={["top"]}>
					{/* Header */}
					<View style={styles.header}>
						<TouchableOpacity style={styles.iconButton}>
							<Ionicons name="location-outline" size={24} color={theme.text} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.iconButton}>
							<Ionicons name="menu-outline" size={24} color={theme.text} />
						</TouchableOpacity>
					</View>

					{/* Scrollable Content */}
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={weatherLoading}
								onRefresh={refetch}
								tintColor={theme.text}
								colors={[theme.text]}
							/>
						}
					>
						{/* Current Weather */}
						<CurrentWeatherCard weather={currentWeather} textColor={theme.text} />

						{/* Hourly Forecast */}
						{hourlyForecast.length > 0 && (
							<HourlyForecast forecast={hourlyForecast} textColor={theme.text} />
						)}

						{/* Daily Forecast */}
						{dailyForecast.length > 0 && (
							<DailyForecast forecast={dailyForecast} textColor={theme.text} />
						)}

						{/* Weather Details */}
						<WeatherDetails weather={currentWeather} textColor={theme.text} />

						{/* Sun Times */}
						<View style={styles.sunTimesContainer}>
							<View style={styles.sunTimeCard}>
								<Ionicons name="sunny-outline" size={24} color={theme.text} />
								<View>
									<Text style={[styles.sunTimeLabel, { color: theme.textSecondary }]}>Sunrise</Text>
									<Text style={[styles.sunTimeValue, { color: theme.text }]}>
										{new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
										})}
									</Text>
								</View>
							</View>
							<View style={styles.sunTimeCard}>
								<Ionicons name="moon-outline" size={24} color={theme.text} />
								<View>
									<Text style={[styles.sunTimeLabel, { color: theme.textSecondary }]}>Sunset</Text>
									<Text style={[styles.sunTimeValue, { color: theme.text }]}>
										{new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
										})}
									</Text>
								</View>
							</View>
						</View>

						{/* Footer */}
						<View style={styles.footer}>
							<Text style={[styles.footerText, { color: theme.textSecondary }]}>
								Last updated: {new Date(currentWeather.dt * 1000).toLocaleTimeString()}
							</Text>
							<Text style={[styles.footerText, { color: theme.textSecondary }]}>
								Data provided by OpenWeatherMap
							</Text>
						</View>
					</ScrollView>
				</SafeAreaView>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.base,
		paddingVertical: spacing.sm,
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		justifyContent: "center",
		alignItems: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: spacing["3xl"],
	},
	sunTimesContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: spacing.base,
		marginVertical: spacing.xl,
		gap: spacing.md,
	},
	sunTimeCard: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		padding: spacing.base,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},
	sunTimeLabel: {
		fontSize: 12,
		opacity: 0.8,
	},
	sunTimeValue: {
		fontSize: 16,
		fontWeight: "600",
	},
	footer: {
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.base,
		marginTop: spacing.xl,
	},
	footerText: {
		fontSize: 11,
		opacity: 0.7,
		textAlign: "center",
	},
});
