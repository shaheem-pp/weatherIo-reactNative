/**
 * Daily Forecast Component
 * Displays 5-day forecast with improved UI/UX
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
			<View style={styles.headerRow}>
				<Text style={[styles.title, { color: textColor }]}>5-Day Forecast</Text>
				<Ionicons name="calendar-outline" size={20} color={textColor} style={{ opacity: 0.7 }} />
			</View>

			{forecast.map((day, index) => (
				<GlassCard key={index} style={styles.dayCard}>
					<View style={styles.dayRow}>
						{/* Left: Day and Date */}
						<View style={styles.dayInfo}>
							<Text style={[styles.dayText, { color: textColor }]}>
								{index === 0 ? "Today" : formatDayOfWeek(day.dt)}
							</Text>
							<Text style={[styles.descriptionText, { color: textColor }]}>
								{day.weather[0].description}
							</Text>
						</View>

						{/* Center: Weather Icon and Condition */}
						<View style={styles.weatherInfo}>
							<WeatherIcon iconCode={day.weather[0].icon} size={48} />
							{day.pop > 0.2 && (
								<View style={styles.precipitationContainer}>
									<Ionicons name="water" size={14} color={colors.info} />
									<Text style={[styles.precipitationText, { color: colors.info }]}>
										{Math.round(day.pop * 100)}%
									</Text>
								</View>
							)}
						</View>

						{/* Right: Temperature Range with Visual Bar */}
						<View style={styles.tempSection}>
							<View style={styles.tempRange}>
								<Text style={[styles.tempMax, { color: textColor }]}>
									{Math.round(day.temp_max)}°
								</Text>
								<View style={styles.tempBar}>
									<View
										style={[
											styles.tempBarFill,
											{
												backgroundColor: textColor,
												opacity: 0.3,
												width: "100%",
											},
										]}
									/>
									<View
										style={[
											styles.tempBarFill,
											styles.tempBarHighlight,
											{
												backgroundColor: textColor,
												width: `${((day.temp_max - day.temp_min) / day.temp_max) * 100}%`,
											},
										]}
									/>
								</View>
								<Text style={[styles.tempMin, { color: textColor }]}>
									{Math.round(day.temp_min)}°
								</Text>
							</View>
						</View>
					</View>
				</GlassCard>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.base,
		paddingHorizontal: spacing.base,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.md,
		paddingHorizontal: spacing.xs,
	},
	title: {
		...textStyles.h5,
	},
	dayCard: {
		padding: spacing.base,
		marginBottom: spacing.sm,
	},
	dayRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	dayInfo: {
		flex: 1.2,
	},
	dayText: {
		...textStyles.bodyMedium,
		marginBottom: 2,
	},
	descriptionText: {
		...textStyles.caption,
		opacity: 0.7,
		textTransform: "capitalize",
	},
	weatherInfo: {
		alignItems: "center",
		flex: 1,
		gap: spacing.xs,
	},
	precipitationContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	precipitationText: {
		...textStyles.caption,
		fontSize: 11,
		fontWeight: "600",
	},
	tempSection: {
		flex: 1.3,
		alignItems: "flex-end",
	},
	tempRange: {
		width: "100%",
		alignItems: "center",
		gap: 6,
	},
	tempBar: {
		width: "100%",
		height: 4,
		borderRadius: 2,
		overflow: "hidden",
		position: "relative",
		backgroundColor: "transparent",
	},
	tempBarFill: {
		position: "absolute",
		left: 0,
		top: 0,
		height: "100%",
		borderRadius: 2,
	},
	tempBarHighlight: {
		opacity: 0.8,
	},
	tempMax: {
		...textStyles.bodyMedium,
		fontSize: 16,
		fontWeight: "600",
	},
	tempMin: {
		...textStyles.body,
		opacity: 0.6,
		fontSize: 14,
	},
});
