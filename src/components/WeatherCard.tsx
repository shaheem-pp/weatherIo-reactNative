/**
 * WeatherCard Component
 * Displays current weather information with beautiful design
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
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

	return (
		<View>
			{/* Location */}
			<View style={styles.locationContainer}>
				<Ionicons name="location-sharp" size={24} color={colors.text.light} />
				<Text style={styles.location}>
					{weather.name}, {weather.sys.country}
				</Text>
			</View>

			{/* Main Weather Card */}
			<View style={styles.mainCard}>
				<View style={styles.mainWeather}>
					<Ionicons name={iconName as any} size={120} color={colors.text.light} />
					<View style={styles.temperatureContainer}>
						<Text style={styles.temperature}>{formatTemperature(weather.main.temp)}</Text>
						<View style={styles.tempDetails}>
							<Text style={styles.description}>
								{capitalizeWords(weather.weather[0].description)}
							</Text>
							<Text style={styles.feelsLike}>
								Feels like {formatTemperature(weather.main.feels_like)}
							</Text>
						</View>
					</View>
				</View>

				{/* High/Low Temperature */}
				<View style={styles.highLowContainer}>
					<View style={styles.highLowItem}>
						<Ionicons name="arrow-up" size={16} color={colors.text.light} />
						<Text style={styles.highLowText}>{formatTemperature(weather.main.temp_max)}</Text>
					</View>
					<View style={styles.divider} />
					<View style={styles.highLowItem}>
						<Ionicons name="arrow-down" size={16} color={colors.text.light} />
						<Text style={styles.highLowText}>{formatTemperature(weather.main.temp_min)}</Text>
					</View>
				</View>
			</View>

			{/* Weather Details Grid */}
			<View style={styles.detailsGrid}>
				<DetailCard
					icon="water-outline"
					label="Humidity"
					value={formatHumidity(weather.main.humidity)}
				/>
				<DetailCard
					icon="speedometer-outline"
					label="Wind Speed"
					value={formatWindSpeed(weather.wind.speed)}
					extraInfo={getWindDirection(weather.wind.deg)}
				/>
				<DetailCard
					icon="analytics-outline"
					label="Pressure"
					value={formatPressure(weather.main.pressure)}
				/>
				<DetailCard
					icon="eye-outline"
					label="Visibility"
					value={`${(weather.visibility / 1000).toFixed(1)} km`}
				/>
			</View>
		</View>
	);
};

/**
 * DetailCard Component
 * Displays individual weather detail in a card
 */
interface DetailCardProps {
	icon: string;
	label: string;
	value: string;
	extraInfo?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, extraInfo }) => (
	<View style={styles.detailCard}>
		<Ionicons name={icon as any} size={28} color={colors.text.light} style={styles.detailIcon} />
		<Text style={styles.detailLabel}>{label}</Text>
		<Text style={styles.detailValue}>{value}</Text>
		{extraInfo && <Text style={styles.detailExtra}>{extraInfo}</Text>}
	</View>
);

const styles = StyleSheet.create({
	locationContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.xl,
		gap: spacing.sm,
	},
	location: {
		fontSize: typography.sizes["2xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	mainCard: {
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderRadius: borderRadius.xl,
		padding: spacing.xl,
		marginBottom: spacing.lg,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	mainWeather: {
		alignItems: "center",
		paddingBottom: spacing.lg,
	},
	temperatureContainer: {
		alignItems: "center",
		marginTop: spacing.md,
	},
	temperature: {
		fontSize: 72,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		letterSpacing: -2,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 8,
	},
	tempDetails: {
		alignItems: "center",
		marginTop: spacing.sm,
	},
	description: {
		fontSize: typography.sizes.xl,
		color: colors.text.light,
		fontWeight: typography.weights.semibold,
		textTransform: "capitalize",
	},
	feelsLike: {
		fontSize: typography.sizes.base,
		color: colors.text.light,
		marginTop: spacing.xs,
		opacity: 0.85,
	},
	highLowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: borderRadius.lg,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		marginTop: spacing.md,
		gap: spacing.lg,
	},
	highLowItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	highLowText: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
	},
	divider: {
		width: 1,
		height: 20,
		backgroundColor: "rgba(255, 255, 255, 0.4)",
	},
	detailsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	detailCard: {
		flex: 1,
		minWidth: "47%",
		backgroundColor: "rgba(255, 255, 255, 0.25)",
		borderRadius: borderRadius.lg,
		padding: spacing.lg,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	detailIcon: {
		marginBottom: spacing.sm,
	},
	detailLabel: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		opacity: 0.85,
		marginBottom: spacing.xs,
		fontWeight: typography.weights.medium,
	},
	detailValue: {
		fontSize: typography.sizes.xl,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
	},
	detailExtra: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		opacity: 0.9,
		marginTop: spacing.xs,
		fontWeight: typography.weights.semibold,
	},
});
