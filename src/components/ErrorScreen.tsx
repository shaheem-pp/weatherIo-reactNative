/**
 * Error Screen Component
 * Displayed when there's an error fetching weather data
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, spacing, textStyles } from "../theme";

interface ErrorScreenProps {
	message: string;
	onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
	return (
		<LinearGradient colors={colors.clearDay.gradient} style={styles.container}>
			<View style={styles.content}>
				<Ionicons name="cloud-offline-outline" size={80} color={colors.white} />
				<Text style={styles.title}>Oops!</Text>
				<Text style={styles.message}>{message}</Text>
				{onRetry && (
					<TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
						<Ionicons name="refresh" size={20} color={colors.white} />
						<Text style={styles.buttonText}>Try Again</Text>
					</TouchableOpacity>
				)}
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
		paddingHorizontal: spacing["2xl"],
	},
	title: {
		...textStyles.h2,
		color: colors.white,
	},
	message: {
		...textStyles.body,
		color: colors.white,
		textAlign: "center",
		opacity: 0.9,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.xl,
		marginTop: spacing.lg,
	},
	buttonText: {
		...textStyles.button,
		color: colors.white,
	},
});
