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
			Animated.timing(shakeAnim, { toValue: 8, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: -8, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 6, duration: 100, useNativeDriver: true }),
			Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
		]).start();

		// Fade in content
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim, shakeAnim]);

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
					<Ionicons name="alert-circle" size={72} color={colors.text.light} style={styles.icon} />
				</Animated.View>
				<Text style={styles.title}>Weather hiccup</Text>
				<Text style={styles.message}>{message}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.75}>
					<Ionicons name="refresh" size={18} color={colors.text.light} />
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
		backgroundColor: colors.glass,
		borderRadius: borderRadius["2xl"],
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.xl,
		borderWidth: 1,
		borderColor: colors.glassBorder,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 18,
		elevation: 10,
	},
	icon: {
		marginBottom: spacing.lg,
		opacity: 0.9,
	},
	title: {
		fontSize: typography.sizes["2xl"],
		fontFamily: typography.fonts.title,
		color: colors.text.light,
		marginBottom: spacing.sm,
	},
	message: {
		fontSize: typography.sizes.base,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
		textAlign: "center",
		marginBottom: spacing.lg,
	},
	retryButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderRadius: borderRadius.full,
		gap: spacing.sm,
		borderWidth: 1,
		borderColor: colors.glassBorder,
	},
	retryText: {
		fontSize: typography.sizes.base,
		fontFamily: typography.fonts.label,
		color: colors.text.light,
	},
});
