/**
 * Color Palette
 * Inspired by modern weather apps with dynamic weather-based themes
 */

export const colors = {
	// Primary weather states
	clearDay: {
		primary: "#47BFDF",
		secondary: "#4A90E2",
		gradient: ["#87CEEB", "#4A90E2", "#1E3A8A"] as const,
		text: "#FFFFFF",
		textSecondary: "rgba(255, 255, 255, 0.8)",
		card: "rgba(255, 255, 255, 0.15)",
		cardBorder: "rgba(255, 255, 255, 0.2)",
	},
	clearNight: {
		primary: "#1E293B",
		secondary: "#334155",
		gradient: ["#0F172A", "#1E293B", "#334155"] as const,
		text: "#FFFFFF",
		textSecondary: "rgba(255, 255, 255, 0.7)",
		card: "rgba(255, 255, 255, 0.1)",
		cardBorder: "rgba(255, 255, 255, 0.15)",
	},
	cloudy: {
		primary: "#6B7280",
		secondary: "#9CA3AF",
		gradient: ["#6B7280", "#9CA3AF", "#D1D5DB"] as const,
		text: "#FFFFFF",
		textSecondary: "rgba(255, 255, 255, 0.8)",
		card: "rgba(255, 255, 255, 0.15)",
		cardBorder: "rgba(255, 255, 255, 0.2)",
	},
	rainy: {
		primary: "#4A5568",
		secondary: "#718096",
		gradient: ["#2D3748", "#4A5568", "#718096"] as const,
		text: "#FFFFFF",
		textSecondary: "rgba(255, 255, 255, 0.8)",
		card: "rgba(255, 255, 255, 0.12)",
		cardBorder: "rgba(255, 255, 255, 0.18)",
	},
	stormy: {
		primary: "#1F2937",
		secondary: "#374151",
		gradient: ["#111827", "#1F2937", "#374151"] as const,
		text: "#FFFFFF",
		textSecondary: "rgba(255, 255, 255, 0.75)",
		card: "rgba(255, 255, 255, 0.1)",
		cardBorder: "rgba(255, 255, 255, 0.15)",
	},
	snowy: {
		primary: "#E0F2FE",
		secondary: "#BAE6FD",
		gradient: ["#F0F9FF", "#E0F2FE", "#BAE6FD"] as const,
		text: "#1E293B",
		textSecondary: "rgba(30, 41, 59, 0.7)",
		card: "rgba(255, 255, 255, 0.25)",
		cardBorder: "rgba(255, 255, 255, 0.3)",
	},

	// Base colors
	white: "#FFFFFF",
	black: "#000000",

	// Semantic colors
	success: "#10B981",
	warning: "#F59E0B",
	error: "#EF4444",
	info: "#3B82F6",

	// Neutral colors
	gray: {
		50: "#F9FAFB",
		100: "#F3F4F6",
		200: "#E5E7EB",
		300: "#D1D5DB",
		400: "#9CA3AF",
		500: "#6B7280",
		600: "#4B5563",
		700: "#374151",
		800: "#1F2937",
		900: "#111827",
	},

	// Weather condition colors
	temperature: {
		hot: "#EF4444",
		warm: "#F59E0B",
		moderate: "#10B981",
		cool: "#3B82F6",
		cold: "#8B5CF6",
	},

	// Overlay colors
	overlay: {
		light: "rgba(255, 255, 255, 0.1)",
		medium: "rgba(255, 255, 255, 0.2)",
		dark: "rgba(0, 0, 0, 0.3)",
	},
};

/**
 * Get theme based on weather condition and time
 */
export const getWeatherTheme = (weatherMain: string, isNight: boolean = false) => {
	const condition = weatherMain.toLowerCase();

	if (condition.includes("clear")) {
		return isNight ? colors.clearNight : colors.clearDay;
	}
	if (condition.includes("cloud")) {
		return colors.cloudy;
	}
	if (condition.includes("rain") || condition.includes("drizzle")) {
		return colors.rainy;
	}
	if (condition.includes("thunder") || condition.includes("storm")) {
		return colors.stormy;
	}
	if (condition.includes("snow")) {
		return colors.snowy;
	}

	// Default to clear day
	return colors.clearDay;
};

/**
 * Get temperature color based on celsius value
 */
export const getTemperatureColor = (temp: number): string => {
	if (temp >= 30) return colors.temperature.hot;
	if (temp >= 20) return colors.temperature.warm;
	if (temp >= 10) return colors.temperature.moderate;
	if (temp >= 0) return colors.temperature.cool;
	return colors.temperature.cold;
};
