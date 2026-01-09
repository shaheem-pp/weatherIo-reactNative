/**
 * WeatherCard Component
 * Displays current weather information with polished layout and motion
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
	formatTime,
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
	const slideAnim = useRef(new Animated.Value(20)).current;
	const scaleAnim = useRef(new Animated.Value(0.98)).current;

	useEffect(() => {
		fadeAnim.setValue(0);
		slideAnim.setValue(20);
		scaleAnim.setValue(0.98);

		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}),
			Animated.spring(slideAnim, {
				toValue: 0,
				tension: 60,
				friction: 7,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 60,
				friction: 7,
				useNativeDriver: true,
			}),
		]).start();
	}, [weather.dt]);

	return (
		<Animated.View
			style={[
				styles.card,
				{
					opacity: fadeAnim,
					transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
				},
			]}
		>
			<View style={styles.locationRow}>
				<View style={styles.locationBadge}>
					<Ionicons name="location-sharp" size={18} color={colors.text.light} />
					<Text style={styles.locationText}>
						{weather.name}, {weather.sys.country}
					</Text>
				</View>
				<View style={styles.timeBadge}>
					<Ionicons name="time-outline" size={14} color={colors.text.muted} />
					<Text style={styles.timeText}>{formatTime(weather.dt)}</Text>
				</View>
			</View>

			<View style={styles.heroRow}>
				<View style={styles.tempColumn}>
					<Text style={styles.temperature}>{formatTemperature(weather.main.temp)}</Text>
					<Text style={styles.condition}>
						{capitalizeWords(weather.weather[0].description)}
					</Text>
					<View style={styles.feelsLikeContainer}>
						<Ionicons name="thermometer-outline" size={14} color={colors.text.muted} />
						<Text style={styles.feelsLike}>
							Feels like {formatTemperature(weather.main.feels_like)}
						</Text>
					</View>
				</View>

				<View style={styles.iconColumn}>
					<View style={styles.iconBubble}>
						<Ionicons name={iconName as any} size={96} color={colors.text.light} />
					</View>
					<View style={styles.highLowPill}>
						<View style={styles.highLowItem}>
							<Ionicons name="arrow-up" size={14} color={colors.text.light} />
							<Text style={styles.highLowValue}>
								{formatTemperature(weather.main.temp_max)}
							</Text>
						</View>
						<View style={styles.highLowDivider} />
						<View style={styles.highLowItem}>
							<Ionicons name="arrow-down" size={14} color={colors.text.light} />
							<Text style={styles.highLowValue}>
								{formatTemperature(weather.main.temp_min)}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.metricsGrid}>
				<DetailTile
					icon="water-outline"
					label="Humidity"
					value={formatHumidity(weather.main.humidity)}
					animateKey={weather.dt}
					delay={100}
				/>
				<DetailTile
					icon="speedometer-outline"
					label="Wind"
					value={formatWindSpeed(weather.wind.speed)}
					extraInfo={getWindDirection(weather.wind.deg)}
					animateKey={weather.dt}
					delay={180}
				/>
				<DetailTile
					icon="analytics-outline"
					label="Pressure"
					value={formatPressure(weather.main.pressure)}
					animateKey={weather.dt}
					delay={260}
				/>
				<DetailTile
					icon="eye-outline"
					label="Visibility"
					value={`${(weather.visibility / 1000).toFixed(1)} km`}
					animateKey={weather.dt}
					delay={340}
				/>
				<DetailTile
					icon="sunny-outline"
					label="Sunrise"
					value={formatTime(weather.sys.sunrise)}
					animateKey={weather.dt}
					delay={420}
				/>
				<DetailTile
					icon="moon-outline"
					label="Sunset"
					value={formatTime(weather.sys.sunset)}
					animateKey={weather.dt}
					delay={500}
				/>
			</View>
		</Animated.View>
	);
};

/**
 * DetailTile Component
 * Displays individual weather detail in a tile with animation
 */
interface DetailTileProps {
	icon: string;
	label: string;
	value: string;
	extraInfo?: string;
	animateKey: number;
	delay?: number;
}

const DetailTile: React.FC<DetailTileProps> = ({
	icon,
	label,
	value,
	extraInfo,
	animateKey,
	delay = 0,
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(12)).current;

	useEffect(() => {
		fadeAnim.setValue(0);
		slideAnim.setValue(12);

		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 360,
				delay,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 360,
				delay,
				useNativeDriver: true,
			}),
		]).start();
	}, [animateKey, delay, fadeAnim, slideAnim]);

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
			<View style={styles.detailHeader}>
				<Ionicons name={icon as any} size={20} color={colors.text.light} />
				<Text style={styles.detailLabel}>{label}</Text>
			</View>
			<Text style={styles.detailValue}>{value}</Text>
			{extraInfo && <Text style={styles.detailExtra}>{extraInfo}</Text>}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.glass,
		borderRadius: borderRadius["2xl"],
		padding: spacing.xl,
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.glassBorder,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 14 },
		shadowOpacity: 0.25,
		shadowRadius: 24,
		elevation: 12,
	},
	locationRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.lg,
		gap: spacing.md,
	},
	locationBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.glassStrong,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md,
		borderRadius: borderRadius.full,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	timeBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: borderRadius.full,
		backgroundColor: "rgba(15, 26, 38, 0.35)",
	},
	locationText: {
		fontSize: typography.sizes.lg,
		fontFamily: typography.fonts.title,
		color: colors.text.light,
	},
	timeText: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.label,
		color: colors.text.muted,
	},
	heroRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		gap: spacing.lg,
	},
	tempColumn: {
		flex: 1,
	},
	temperature: {
		fontSize: 72,
		fontFamily: typography.fonts.display,
		color: colors.text.light,
		letterSpacing: -2,
	},
	condition: {
		fontSize: typography.sizes.lg,
		fontFamily: typography.fonts.title,
		color: colors.text.light,
		marginTop: spacing.xs,
	},
	feelsLikeContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginTop: spacing.sm,
	},
	feelsLike: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
	},
	iconColumn: {
		alignItems: "center",
		gap: spacing.md,
	},
	iconBubble: {
		padding: spacing.md,
		borderRadius: borderRadius.full,
		backgroundColor: colors.glassStrong,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	highLowPill: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: borderRadius.full,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	highLowItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	highLowValue: {
		fontSize: typography.sizes.base,
		fontFamily: typography.fonts.label,
		color: colors.text.light,
	},
	highLowDivider: {
		width: 1,
		height: 18,
		backgroundColor: colors.border,
	},
	metricsGrid: {
		marginTop: spacing.xl,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	detailCard: {
		flexBasis: "48%",
		flexGrow: 1,
		backgroundColor: colors.surface,
		borderRadius: borderRadius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	detailHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: spacing.sm,
	},
	detailLabel: {
		fontSize: typography.sizes.xs,
		fontFamily: typography.fonts.label,
		textTransform: "uppercase",
		letterSpacing: 0.8,
		color: colors.text.muted,
	},
	detailValue: {
		fontSize: typography.sizes.xl,
		fontFamily: typography.fonts.title,
		color: colors.text.light,
	},
	detailExtra: {
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.label,
		color: colors.text.muted,
		marginTop: spacing.xs,
	},
});
