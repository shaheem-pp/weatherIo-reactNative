/**
 * Color Palette for the Weather App
 * Defines a beautiful, cohesive color scheme with gradients for different weather conditions
 */

export const colors = {
	// Primary Colors
	primary: "#5B9FED",
	secondary: "#4A90E2",
	accent: "#F5A623",

	// Background Gradients for Different Weather Conditions
	gradients: {
		clear: ["#4A90E2", "#5B9FED", "#87CEEB"],
		clouds: ["#6B7B8C", "#8B9CAD", "#B0BEC5"],
		rain: ["#3D5A80", "#4A6FA5", "#5B8BB5"],
		thunderstorm: ["#2C3E50", "#34495E", "#4A5F7F"],
		snow: ["#E8F4F8", "#B8D4E0", "#93C5DC"],
		mist: ["#95A5A6", "#B2C4C6", "#D0DBE0"],
		drizzle: ["#5B8AA8", "#6FA8C8", "#87C3DB"],
	},

	// UI Colors
	background: "#F5F7FA",
	surface: "#FFFFFF",
	surfaceLight: "rgba(255, 255, 255, 0.9)",

	// Text Colors
	text: {
		primary: "#2C3E50",
		secondary: "#7F8C8D",
		light: "#FFFFFF",
		dark: "#1A252F",
	},

	// Status Colors
	success: "#27AE60",
	warning: "#F39C12",
	error: "#E74C3C",
	info: "#3498DB",

	// Opacity Variants
	overlay: "rgba(0, 0, 0, 0.3)",
	shadow: "rgba(0, 0, 0, 0.1)",
	border: "rgba(0, 0, 0, 0.08)",
};

export type GradientKey = keyof typeof colors.gradients;
