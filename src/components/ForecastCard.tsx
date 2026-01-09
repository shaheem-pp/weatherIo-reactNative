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
		backgroundColor: colors.glass,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		marginRight: spacing.md,
		alignItems: "center",
		minWidth: 130,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	day: {
		fontSize: typography.sizes.base,
		fontFamily: typography.fonts.title,
		color: colors.text.light,
		marginBottom: spacing.xs,
	},
	icon: {
		marginVertical: spacing.sm,
	},
	description: {
		fontSize: typography.sizes.xs,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
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
		fontFamily: typography.fonts.title,
		color: colors.text.light,
	},
	tempMin: {
		fontSize: typography.sizes.lg,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
	},
	rainContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.sm,
	},
	rainText: {
		fontSize: typography.sizes.xs,
		fontFamily: typography.fonts.label,
		color: colors.text.muted,
	},
});
