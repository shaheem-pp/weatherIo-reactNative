/**
 * ErrorScreen Component
 * Displays error message with retry option and animation
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";

interface ErrorScreenProps {
	message: string;
	onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
	const shakeAnim = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Shake animation for icon
		Animated.sequence([
			Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
		]).start();

		// Fade in content
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<LinearGradient colors={colors.gradients.clouds} style={styles.container}>
			<Animated.View
				style={[
					styles.content,
					{
						opacity: fadeAnim,
					},
				]}
			>
				<Animated.View
					style={{
						transform: [{ translateX: shakeAnim }],
					}}
				>
					<Ionicons name="alert-circle" size={80} color={colors.text.light} style={styles.icon} />
				</Animated.View>
				<Text style={styles.title}>Oops!</Text>
				<Text style={styles.message}>{message}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
					<Ionicons name="refresh" size={20} color={colors.text.light} />
					<Text style={styles.retryText}>Try Again</Text>
				</TouchableOpacity>
			</Animated.View>
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
