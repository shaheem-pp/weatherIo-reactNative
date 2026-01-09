/**
 * LoadingScreen Component
 * Displays a beautiful loading animation while fetching weather data
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

interface LoadingScreenProps {
	message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
	message = "Fetching weather data...",
}) => {
	return (
		<LinearGradient colors={colors.gradients.clear} style={styles.container}>
			<View style={styles.content}>
				<Ionicons name="cloud" size={80} color={colors.text.light} style={styles.icon} />
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
