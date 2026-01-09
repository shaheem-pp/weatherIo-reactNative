/**
 * Color Palette for the Weather App
 * Defines a cohesive palette with atmospheric gradients
 */

export const colors = {
	// Primary Colors
	primary: "#1C4E7A",
	secondary: "#2E86AB",
	accent: "#F6C453",
	accentWarm: "#F18F5C",

	// Background Gradients for Different Weather Conditions
	gradients: {
		clear: ["#2E86AB", "#4BB4E6", "#C6E7FF"] as const,
		clouds: ["#304255", "#556778", "#8FA0AF"] as const,
		rain: ["#1E2F44", "#2E5B7A", "#4E7FA7"] as const,
		thunderstorm: ["#1A1F2B", "#2B3645", "#3E4B5E"] as const,
		snow: ["#B7D4E6", "#8EB5D4", "#6D9CBD"] as const,
		mist: ["#6F7F8B", "#93A3AE", "#BAC7D0"] as const,
		drizzle: ["#2D6D76", "#4B9AA6", "#85C8CC"] as const,
	},

	// UI Colors
	background: "#0D1B2A",
	surface: "rgba(255, 255, 255, 0.14)",
	surfaceStrong: "rgba(255, 255, 255, 0.24)",
	glass: "rgba(255, 255, 255, 0.12)",
	glassStrong: "rgba(255, 255, 255, 0.22)",
	glassBorder: "rgba(255, 255, 255, 0.28)",

	// Text Colors
	text: {
		primary: "#102435",
		secondary: "#4D6475",
		light: "#F8FBFF",
		muted: "rgba(248, 251, 255, 0.7)",
		dark: "#0E1E2B",
	},

	// Status Colors
	success: "#1FBBA6",
	warning: "#F6C453",
	error: "#E35C5C",
	info: "#4BB4E6",

	// Opacity Variants
	overlay: "rgba(10, 20, 31, 0.35)",
	shadow: "rgba(8, 16, 24, 0.35)",
	border: "rgba(255, 255, 255, 0.18)",
	glow: "rgba(255, 255, 255, 0.18)",
	glowStrong: "rgba(246, 196, 83, 0.22)",
};

export type GradientKey = keyof typeof colors.gradients;
