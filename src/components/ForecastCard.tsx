/**
 * ForecastCard Component
 * Displays individual forecast day
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";
import type { ForecastDay } from "../types/weather";
import { capitalizeWords, formatTemperature, getShortDayName, getWeatherIcon } from "../utils";

interface ForecastCardProps {
	forecast: ForecastDay;
	isToday?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, isToday }) => {
	const iconName = getWeatherIcon(forecast.weather[0].icon);
	const dayName = isToday ? "Today" : getShortDayName(forecast.dt);

	return (
		<View style={styles.card}>
			<Text style={styles.day}>{dayName}</Text>
			<Ionicons name={iconName as any} size={40} color={colors.text.light} style={styles.icon} />
			<Text style={styles.description}>{capitalizeWords(forecast.weather[0].description)}</Text>
			<View style={styles.temperatureContainer}>
				<Text style={styles.tempMax}>{formatTemperature(forecast.temp_max)}</Text>
				<Text style={styles.tempMin}>{formatTemperature(forecast.temp_min)}</Text>
			</View>
			{forecast.pop > 0 && (
				<View style={styles.rainContainer}>
					<Ionicons name="water" size={14} color={colors.text.light} />
					<Text style={styles.rainText}>{Math.round(forecast.pop * 100)}%</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		marginRight: spacing.md,
		alignItems: "center",
		minWidth: 120,
	},
	day: {
		fontSize: typography.sizes.base,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
		marginBottom: spacing.sm,
	},
	icon: {
		marginVertical: spacing.sm,
	},
	description: {
		fontSize: typography.sizes.xs,
		color: colors.text.light,
		opacity: 0.9,
		marginBottom: spacing.sm,
		textAlign: "center",
	},
	temperatureContainer: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	tempMax: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
	},
	tempMin: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.regular,
		color: colors.text.light,
		opacity: 0.7,
	},
	rainContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.sm,
	},
	rainText: {
		fontSize: typography.sizes.xs,
		color: colors.text.light,
		opacity: 0.9,
	},
});
