/**
 * LoadingScreen Component
 * Displays a beautiful loading animation while fetching weather data
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

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
					toValue: 1.2,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1000,
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
	}, []);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<LinearGradient colors={colors.gradients.clear} style={styles.container}>
			<View style={styles.content}>
				<Animated.View
					style={{
						transform: [{ scale: pulseAnim }, { rotate }],
					}}
				>
					<Ionicons name="cloud" size={80} color={colors.text.light} style={styles.icon} />
				</Animated.View>
				<ActivityIndicator size="large" color={colors.text.light} />
				<Text style={styles.message}>{message}</Text>
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
	},
	icon: {
		marginBottom: spacing.xl,
		opacity: 0.9,
	},
	message: {
		marginTop: spacing.lg,
		fontSize: typography.sizes.lg,
		color: colors.text.light,
		fontWeight: typography.weights.medium,
	},
});
