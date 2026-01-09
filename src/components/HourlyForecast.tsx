/**
 * Hourly Forecast Component
 * Displays horizontal scrollable hourly forecast
 */

import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing, textStyles } from "../theme";
import type { ForecastItem } from "../types/weather";
import { formatTime } from "../utils";
import { GlassCard } from "./GlassCard";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
	forecast: ForecastItem[];
	textColor?: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
	forecast,
	textColor = colors.white,
}) => {
	return (
		<View style={styles.container}>
			<Text style={[styles.title, { color: textColor }]}>Hourly Forecast</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{forecast.map((item, index) => (
					<GlassCard key={index} style={styles.card}>
						<Text style={[styles.time, { color: textColor }]}>
							{index === 0 ? "Now" : formatTime(item.dt)}
						</Text>
						<WeatherIcon iconCode={item.weather[0].icon} size={40} />
						<Text style={[styles.temperature, { color: textColor }]}>
							{Math.round(item.main.temp)}°
						</Text>
						{item.pop > 0.2 && (
							<Text style={[styles.precipitation, { color: textColor }]}>
								{Math.round(item.pop * 100)}%
							</Text>
						)}
					</GlassCard>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: spacing.base,
	},
	title: {
		...textStyles.h5,
		marginBottom: spacing.md,
		paddingHorizontal: spacing.base,
	},
	scrollContent: {
		paddingHorizontal: spacing.base,
		gap: spacing.md,
	},
	card: {
		alignItems: "center",
		padding: spacing.md,
		minWidth: 70,
		gap: spacing.xs,
	},
	time: {
		...textStyles.caption,
		opacity: 0.8,
	},
	temperature: {
		...textStyles.bodyMedium,
		fontSize: 16,
	},
	precipitation: {
		...textStyles.caption,
		color: colors.info,
		fontSize: 10,
	},
});
