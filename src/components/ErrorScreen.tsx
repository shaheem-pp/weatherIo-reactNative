/**
 * ErrorScreen Component
 * Displays error message with retry option
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";

interface ErrorScreenProps {
	message: string;
	onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
	return (
		<LinearGradient colors={colors.gradients.clouds} style={styles.container}>
			<View style={styles.content}>
				<Ionicons name="alert-circle" size={80} color={colors.text.light} style={styles.icon} />
				<Text style={styles.title}>Oops!</Text>
				<Text style={styles.message}>{message}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={onRetry}>
					<Ionicons name="refresh" size={20} color={colors.text.light} />
					<Text style={styles.retryText}>Try Again</Text>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	content: {
		alignItems: "center",
	},
	icon: {
		marginBottom: spacing.lg,
		opacity: 0.9,
	},
	title: {
		fontSize: typography.sizes["3xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		marginBottom: spacing.md,
	},
	message: {
		fontSize: typography.sizes.lg,
		color: colors.text.light,
		textAlign: "center",
		marginBottom: spacing.xl,
		opacity: 0.9,
	},
	retryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.lg,
		gap: spacing.sm,
	},
	retryText: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
	},
});
