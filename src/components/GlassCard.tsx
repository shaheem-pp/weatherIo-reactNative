/**
 * Glass Card Component
 * Reusable glassmorphism card with blur effect
 */

import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { borderRadius, shadows, spacing } from "../theme";

interface GlassCardProps {
	children: React.ReactNode;
	intensity?: number;
	style?: ViewStyle;
	tint?: "light" | "dark" | "default";
}

export const GlassCard: React.FC<GlassCardProps> = ({
	children,
	intensity = 20,
	style,
	tint = "light",
}) => {
	return (
		<BlurView intensity={intensity} tint={tint} style={[styles.card, style]}>
			{children}
		</BlurView>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: borderRadius.lg,
		padding: spacing.base,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		overflow: "hidden",
		...shadows.base,
	},
});
