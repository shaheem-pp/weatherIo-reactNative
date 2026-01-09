/**
 * Loading Screen Component
 * Displayed while fonts and weather data are loading
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, textStyles } from "../theme";

interface LoadingScreenProps {
	message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
	message = "Loading weather data...",
}) => {
	return (
		<LinearGradient colors={colors.clearDay.gradient} style={styles.container}>
			<View style={styles.content}>
				<ActivityIndicator size="large" color={colors.white} />
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
		gap: spacing.lg,
	},
	message: {
		...textStyles.body,
		color: colors.white,
		textAlign: "center",
	},
});
