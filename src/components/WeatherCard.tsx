/**
 * WeatherCard Component
 * Displays current weather information with beautiful design and animations
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";
import type { CurrentWeather } from "../types/weather";
import {
	capitalizeWords,
	formatHumidity,
	formatPressure,
	formatTemperature,
	formatWindSpeed,
	getWeatherIcon,
	getWindDirection,
} from "../utils";

interface WeatherCardProps {
	weather: CurrentWeather;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
	const iconName = getWeatherIcon(weather.weather[0].icon);

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.spring(slideAnim, {
				toValue: 0,
				tension: 50,
				friction: 7,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 50,
				friction: 7,
				useNativeDriver: true,
			}),
		]).start();
	}, [weather.dt]);

	return (
		<Animated.View
			style={{
				opacity: fadeAnim,
				transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
			}}
		>
			{/* Location */}
			<View style={styles.locationContainer}>
				<Ionicons name="location-sharp" size={28} color={colors.text.light} />
				<Text style={styles.location}>
					{weather.name}, {weather.sys.country}
				</Text>
			</View>

			{/* Main Weather Card */}
			<View style={styles.mainCard}>
				<View style={styles.mainWeather}>
					<Ionicons name={iconName as any} size={140} color={colors.text.light} />
					<View style={styles.temperatureContainer}>
						<Text style={styles.temperature}>{formatTemperature(weather.main.temp)}</Text>
						<View style={styles.tempDetails}>
							<Text style={styles.description}>
								{capitalizeWords(weather.weather[0].description)}
							</Text>
							<View style={styles.feelsLikeContainer}>
								<Ionicons name="thermometer-outline" size={16} color={colors.text.light} />
								<Text style={styles.feelsLike}>
									Feels like {formatTemperature(weather.main.feels_like)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* High/Low Temperature */}
				<View style={styles.highLowContainer}>
					<View style={styles.highLowItem}>
						<Ionicons name="arrow-up" size={18} color={colors.text.light} />
						<Text style={styles.highLowText}>{formatTemperature(weather.main.temp_max)}</Text>
						<Text style={styles.highLowLabel}>High</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.highLowItem}>
						<Ionicons name="arrow-down" size={18} color={colors.text.light} />
						<Text style={styles.highLowText}>{formatTemperature(weather.main.temp_min)}</Text>
						<Text style={styles.highLowLabel}>Low</Text>
					</View>
				</View>
			</View>

			{/* Weather Details Grid */}
			<View style={styles.detailsGrid}>
				<DetailCard
					icon="water-outline"
					label="Humidity"
					value={formatHumidity(weather.main.humidity)}
					delay={100}
				/>
				<DetailCard
					icon="speedometer-outline"
					label="Wind Speed"
					value={formatWindSpeed(weather.wind.speed)}
					extraInfo={getWindDirection(weather.wind.deg)}
					delay={200}
				/>
				<DetailCard
					icon="analytics-outline"
					label="Pressure"
					value={formatPressure(weather.main.pressure)}
					delay={300}
				/>
				<DetailCard
					icon="eye-outline"
					label="Visibility"
					value={`${(weather.visibility / 1000).toFixed(1)} km`}
					delay={400}
				/>
			</View>
		</Animated.View>
	);
};

/**
 * DetailCard Component
 * Displays individual weather detail in a card with animation
 */
interface DetailCardProps {
	icon: string;
	label: string;
	value: string;
	extraInfo?: string;
	delay?: number;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, extraInfo, delay = 0 }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(20)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 400,
				delay,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 400,
				delay,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	return (
		<Animated.View
			style={[
				styles.detailCard,
				{
					opacity: fadeAnim,
					transform: [{ translateY: slideAnim }],
				},
			]}
		>
			<View style={styles.detailIconContainer}>
				<Ionicons name={icon as any} size={32} color={colors.text.light} />
			</View>
			<Text style={styles.detailLabel}>{label}</Text>
			<Text style={styles.detailValue}>{value}</Text>
			{extraInfo && <Text style={styles.detailExtra}>{extraInfo}</Text>}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	locationContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing["2xl"],
		gap: spacing.sm,
	},
	location: {
		fontSize: typography.sizes["3xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 8,
	},
	mainCard: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: borderRadius["2xl"],
		padding: spacing["2xl"],
		marginBottom: spacing.xl,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 12,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	mainWeather: {
		alignItems: "center",
		paddingBottom: spacing.xl,
	},
	temperatureContainer: {
		alignItems: "center",
		marginTop: spacing.lg,
	},
	temperature: {
		fontSize: 80,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		letterSpacing: -3,
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: { width: 0, height: 3 },
		textShadowRadius: 10,
	},
	tempDetails: {
		alignItems: "center",
		marginTop: spacing.md,
	},
	description: {
		fontSize: typography.sizes["2xl"],
		color: colors.text.light,
		fontWeight: typography.weights.bold,
		textTransform: "capitalize",
		marginBottom: spacing.sm,
	},
	feelsLikeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.full,
	},
	feelsLike: {
		fontSize: typography.sizes.base,
		color: colors.text.light,
		fontWeight: typography.weights.medium,
	},
	highLowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderRadius: borderRadius.xl,
		paddingVertical: spacing.lg,
		paddingHorizontal: spacing.xl,
		marginTop: spacing.lg,
		gap: spacing.xl,
	},
	highLowItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	highLowText: {
		fontSize: typography.sizes["2xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		marginRight: spacing.xs,
	},
	highLowLabel: {
		fontSize: typography.sizes.sm,
		fontWeight: typography.weights.medium,
		color: colors.text.light,
		opacity: 0.8,
	},
	divider: {
		width: 2,
		height: 30,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
		borderRadius: 1,
	},
	detailsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	detailCard: {
		flex: 1,
		minWidth: "47%",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: borderRadius.xl,
		padding: spacing.lg,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 6,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.25)",
	},
	detailIconContainer: {
		marginBottom: spacing.md,
	},
	detailLabel: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		opacity: 0.85,
		marginBottom: spacing.sm,
		fontWeight: typography.weights.semibold,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	detailValue: {
		fontSize: typography.sizes["2xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
	},
	detailExtra: {
		fontSize: typography.sizes.base,
		color: colors.text.light,
		opacity: 0.9,
		marginTop: spacing.xs,
		fontWeight: typography.weights.bold,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: borderRadius.sm,
	},
});
