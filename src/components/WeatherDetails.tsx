/**
 * Weather Details Grid Component
 * Displays additional weather information in a grid layout
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, textStyles } from "../theme";
import type { CurrentWeather } from "../types/weather";
import { formatVisibility, getWindDirection, msToKmh } from "../utils";
import { GlassCard } from "./GlassCard";

interface WeatherDetailsProps {
	weather: CurrentWeather;
	textColor?: string;
}

interface DetailItemProps {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	value: string;
	unit?: string;
	textColor: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, unit, textColor }) => (
	<GlassCard style={styles.detailCard}>
		<View style={styles.detailHeader}>
			<Ionicons name={icon} size={20} color={textColor} style={styles.icon} />
			<Text style={[styles.detailLabel, { color: textColor }]}>{label}</Text>
		</View>
		<View style={styles.detailContent}>
			<Text style={[styles.detailValue, { color: textColor }]}>{value}</Text>
			{unit && <Text style={[styles.detailUnit, { color: textColor }]}>{unit}</Text>}
		</View>
	</GlassCard>
);

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
	weather,
	textColor = colors.white,
}) => {
	const windSpeed = msToKmh(weather.wind.speed);
	const windDirection = getWindDirection(weather.wind.deg);
	const visibility = formatVisibility(weather.visibility);

	return (
		<View style={styles.container}>
			<Text style={[styles.title, { color: textColor }]}>Weather Details</Text>
			<View style={styles.grid}>
				<DetailItem
					icon="water-outline"
					label="Humidity"
					value={weather.main.humidity.toString()}
					unit="%"
					textColor={textColor}
				/>
				<DetailItem
					icon="speedometer-outline"
					label="Pressure"
					value={weather.main.pressure.toString()}
					unit="hPa"
					textColor={textColor}
				/>
				<DetailItem
					icon="navigate-outline"
					label="Wind"
					value={`${windSpeed} ${windDirection}`}
					unit="km/h"
					textColor={textColor}
				/>
				<DetailItem
					icon="eye-outline"
					label="Visibility"
					value={visibility}
					textColor={textColor}
				/>
				<DetailItem
					icon="cloud-outline"
					label="Cloudiness"
					value={weather.clouds.all.toString()}
					unit="%"
					textColor={textColor}
				/>
				<DetailItem
					icon="thermometer-outline"
					label="Feels Like"
					value={Math.round(weather.main.feels_like).toString()}
					unit="°C"
					textColor={textColor}
				/>
			</View>
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
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	detailCard: {
		flex: 1,
		minWidth: "45%",
		padding: spacing.md,
		gap: spacing.sm,
	},
	detailHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	icon: {
		opacity: 0.8,
	},
	detailLabel: {
		...textStyles.caption,
		opacity: 0.8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	detailContent: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: spacing.xs,
	},
	detailValue: {
		...textStyles.h4,
		fontSize: 24,
	},
	detailUnit: {
		...textStyles.body,
		opacity: 0.7,
	},
});
