/**
 * Current Weather Card Component
 * Displays current temperature and conditions
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, textStyles } from "../theme";
import type { CurrentWeather } from "../types/weather";
import { formatWeatherDescription } from "../utils";
import { GlassCard } from "./GlassCard";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherCardProps {
	weather: CurrentWeather;
	textColor?: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
	weather,
	textColor = colors.white,
}) => {
	const temp = Math.round(weather.main.temp);
	const feelsLike = Math.round(weather.main.feels_like);
	const description = formatWeatherDescription(weather.weather[0].description);

	return (
		<View style={styles.container}>
			<Text style={[styles.location, { color: textColor }]}>{weather.name}</Text>

			<WeatherIcon iconCode={weather.weather[0].icon} size={150} />

			<View style={styles.temperatureContainer}>
				<Text style={[styles.temperature, { color: textColor }]}>{temp}°</Text>
				<Text style={[styles.description, { color: textColor }]}>{description}</Text>
			</View>

			<GlassCard style={styles.detailsCard}>
				<View style={styles.detailRow}>
					<Text style={[styles.detailLabel, { color: textColor }]}>Feels like</Text>
					<Text style={[styles.detailValue, { color: textColor }]}>{feelsLike}°</Text>
				</View>
				<View style={styles.separator} />
				<View style={styles.detailRow}>
					<Text style={[styles.detailLabel, { color: textColor }]}>
						H: {Math.round(weather.main.temp_max)}°
					</Text>
					<Text style={[styles.detailLabel, { color: textColor }]}>
						L: {Math.round(weather.main.temp_min)}°
					</Text>
				</View>
			</GlassCard>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: spacing.xl,
	},
	location: {
		...textStyles.h3,
		marginBottom: spacing.md,
	},
	temperatureContainer: {
		alignItems: "center",
		marginTop: spacing.lg,
	},
	temperature: {
		...textStyles.display,
		fontSize: 96,
		fontWeight: "300",
		letterSpacing: -2,
	},
	description: {
		...textStyles.h4,
		marginTop: spacing.sm,
		textTransform: "capitalize",
	},
	detailsCard: {
		marginTop: spacing.xl,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		minWidth: 200,
	},
	detailRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	detailLabel: {
		...textStyles.body,
		opacity: 0.8,
	},
	detailValue: {
		...textStyles.bodyMedium,
	},
	separator: {
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		marginVertical: spacing.sm,
	},
});
