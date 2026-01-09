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
		<View style={styles.card}>
			{/* Location */}
			<View style={styles.locationContainer}>
				<Ionicons name="location" size={20} color={colors.text.light} />
				<Text style={styles.location}>
					{weather.name}, {weather.sys.country}
				</Text>
			</View>

			{/* Main Weather */}
			<View style={styles.mainWeather}>
				<Ionicons name={iconName as any} size={100} color={colors.text.light} />
				<Text style={styles.temperature}>{formatTemperature(weather.main.temp)}</Text>
				<Text style={styles.description}>{capitalizeWords(weather.weather[0].description)}</Text>
				<Text style={styles.feelsLike}>
					Feels like {formatTemperature(weather.main.feels_like)}
				</Text>
			</View>

			{/* Weather Details */}
			<View style={styles.detailsContainer}>
				<View style={styles.detailRow}>
					<DetailItem
						icon="thermometer-outline"
						label="Min / Max"
						value={`${formatTemperature(weather.main.temp_min)} / ${formatTemperature(
							weather.main.temp_max
						)}`}
					/>
					<DetailItem
						icon="water-outline"
						label="Humidity"
						value={formatHumidity(weather.main.humidity)}
					/>
				</View>
				<View style={styles.detailRow}>
					<DetailItem
						icon="speedometer-outline"
						label="Wind"
						value={`${formatWindSpeed(weather.wind.speed)} ${getWindDirection(weather.wind.deg)}`}
					/>
					<DetailItem
						icon="analytics-outline"
						label="Pressure"
						value={formatPressure(weather.main.pressure)}
					/>
				</View>
			</View>
		</View>
	);
};

/**
 * DetailItem Component
 * Displays individual weather detail
 */
interface DetailItemProps {
	icon: string;
	label: string;
	value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
	<View style={styles.detailItem}>
		<Ionicons name={icon as any} size={24} color={colors.text.light} />
		<View style={styles.detailText}>
			<Text style={styles.detailLabel}>{label}</Text>
			<Text style={styles.detailValue}>{value}</Text>
		</View>
	</View>
);

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: borderRadius.xl,
		padding: spacing.xl,
		marginBottom: spacing.lg,
	},
	locationContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.lg,
		gap: spacing.sm,
	},
	location: {
		fontSize: typography.sizes.xl,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
	},
	mainWeather: {
		alignItems: "center",
		marginBottom: spacing.xl,
	},
	temperature: {
		fontSize: typography.sizes["6xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		marginTop: spacing.md,
	},
	description: {
		fontSize: typography.sizes.xl,
		color: colors.text.light,
		marginTop: spacing.sm,
		fontWeight: typography.weights.medium,
	},
	feelsLike: {
		fontSize: typography.sizes.base,
		color: colors.text.light,
		marginTop: spacing.sm,
		opacity: 0.8,
	},
	detailsContainer: {
		gap: spacing.md,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.md,
	},
	detailItem: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		padding: spacing.md,
		borderRadius: borderRadius.md,
		gap: spacing.sm,
	},
	detailText: {
		flex: 1,
	},
	detailLabel: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		opacity: 0.8,
		marginBottom: 2,
	},
	detailValue: {
		fontSize: typography.sizes.base,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
	},
});
