/**
 * Daily Forecast Component
 * Displays 5-day forecast
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, textStyles } from "../theme";
import type { ForecastDay } from "../types/weather";
import { formatDayOfWeek } from "../utils";
import { GlassCard } from "./GlassCard";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
	forecast: ForecastDay[];
	textColor?: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
	forecast,
	textColor = colors.white,
}) => {
	return (
		<View style={styles.container}>
			<Text style={[styles.title, { color: textColor }]}>5-Day Forecast</Text>
			<GlassCard style={styles.card}>
				{forecast.map((day, index) => (
					<View key={index}>
						<View style={styles.dayRow}>
							<Text style={[styles.dayText, { color: textColor }]}>
								{index === 0 ? "Today" : formatDayOfWeek(day.dt)}
							</Text>

							<View style={styles.weatherInfo}>
								<WeatherIcon iconCode={day.weather[0].icon} size={32} />
								{day.pop > 0.2 && (
									<View style={styles.precipitationContainer}>
										<Ionicons name="water" size={12} color={colors.info} />
										<Text style={[styles.precipitationText, { color: colors.info }]}>
											{Math.round(day.pop * 100)}%
										</Text>
									</View>
								)}
							</View>

							<View style={styles.tempRange}>
								<Text style={[styles.tempMax, { color: textColor }]}>
									{Math.round(day.temp_max)}°
								</Text>
								<Text style={[styles.tempMin, { color: textColor }]}>
									{Math.round(day.temp_min)}°
								</Text>
							</View>
						</View>
						{index < forecast.length - 1 && <View style={styles.separator} />}
					</View>
				))}
			</GlassCard>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.base,
		paddingHorizontal: spacing.base,
	},
	title: {
		...textStyles.h5,
		marginBottom: spacing.md,
	},
	card: {
		padding: spacing.base,
	},
	dayRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: spacing.sm,
	},
	dayText: {
		...textStyles.body,
		flex: 1,
	},
	weatherInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		flex: 1,
		justifyContent: "center",
	},
	precipitationContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	precipitationText: {
		...textStyles.caption,
		fontSize: 10,
	},
	tempRange: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		flex: 1,
		justifyContent: "flex-end",
	},
	tempMax: {
		...textStyles.bodyMedium,
		minWidth: 35,
		textAlign: "right",
	},
	tempMin: {
		...textStyles.body,
		opacity: 0.6,
		minWidth: 35,
		textAlign: "right",
	},
	separator: {
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		marginVertical: spacing.xs,
	},
});
