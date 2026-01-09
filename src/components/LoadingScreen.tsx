/**
 * LoadingScreen Component
 * Displays a beautiful loading animation while fetching weather data
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";

interface LoadingScreenProps {
	message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
	message = "Fetching weather data...",
}) => {
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const rotateAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Pulse animation
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.12,
					duration: 900,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 900,
					useNativeDriver: true,
				}),
			])
		).start();

		// Rotation animation
		Animated.loop(
			Animated.timing(rotateAnim, {
				toValue: 1,
				duration: 4000,
				useNativeDriver: true,
			})
		).start();
	}, [pulseAnim, rotateAnim]);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<LinearGradient colors={colors.gradients.clear} style={styles.container}>
			<View style={styles.content}>
				<View style={styles.card}>
					<Animated.View
						style={{
							transform: [{ scale: pulseAnim }, { rotate }],
						}}
					>
						<Ionicons name="cloud" size={72} color={colors.text.light} style={styles.icon} />
					</Animated.View>
					<ActivityIndicator size="large" color={colors.text.light} />
					<Text style={styles.message}>{message}</Text>
				</View>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		alignItems: "center",
		paddingHorizontal: spacing.lg,
	},
	card: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.xl,
		backgroundColor: colors.glass,
		borderRadius: borderRadius["2xl"],
		borderWidth: 1,
		borderColor: colors.glassBorder,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 10,
	},
	icon: {
		marginBottom: spacing.lg,
		opacity: 0.9,
	},
	message: {
		marginTop: spacing.lg,
		fontSize: typography.sizes.lg,
		fontFamily: typography.fonts.body,
		color: colors.text.light,
		textAlign: "center",
	},
});
