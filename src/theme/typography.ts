/**
 * Typography System
 * Consistent text styles across the app
 */

export const typography = {
	// Font families
	fonts: {
		regular: "Sora_400Regular",
		medium: "Sora_500Medium",
		semiBold: "Sora_600SemiBold",
		bold: "Sora_700Bold",
	},

	// Font sizes
	sizes: {
		xs: 10,
		sm: 12,
		base: 14,
		md: 16,
		lg: 18,
		xl: 20,
		"2xl": 24,
		"3xl": 30,
		"4xl": 36,
		"5xl": 48,
		"6xl": 60,
		"7xl": 72,
		"8xl": 96,
		"9xl": 128,
	},

	// Line heights
	lineHeights: {
		tight: 1.1,
		snug: 1.2,
		normal: 1.5,
		relaxed: 1.75,
		loose: 2,
	},

	// Letter spacing
	letterSpacing: {
		tighter: -0.05,
		tight: -0.025,
		normal: 0,
		wide: 0.025,
		wider: 0.05,
		widest: 0.1,
	},
};

/**
 * Predefined text styles
 */
export const textStyles = {
	// Display styles
	display: {
		fontFamily: typography.fonts.bold,
		fontSize: typography.sizes["8xl"],
		lineHeight: typography.sizes["8xl"] * typography.lineHeights.tight,
		letterSpacing: typography.letterSpacing.tight,
	},
	displayMedium: {
		fontFamily: typography.fonts.bold,
		fontSize: typography.sizes["6xl"],
		lineHeight: typography.sizes["6xl"] * typography.lineHeights.tight,
		letterSpacing: typography.letterSpacing.tight,
	},

	// Heading styles
	h1: {
		fontFamily: typography.fonts.bold,
		fontSize: typography.sizes["5xl"],
		lineHeight: typography.sizes["5xl"] * typography.lineHeights.snug,
		letterSpacing: typography.letterSpacing.tight,
	},
	h2: {
		fontFamily: typography.fonts.bold,
		fontSize: typography.sizes["4xl"],
		lineHeight: typography.sizes["4xl"] * typography.lineHeights.snug,
	},
	h3: {
		fontFamily: typography.fonts.semiBold,
		fontSize: typography.sizes["3xl"],
		lineHeight: typography.sizes["3xl"] * typography.lineHeights.snug,
	},
	h4: {
		fontFamily: typography.fonts.semiBold,
		fontSize: typography.sizes["2xl"],
		lineHeight: typography.sizes["2xl"] * typography.lineHeights.snug,
	},
	h5: {
		fontFamily: typography.fonts.semiBold,
		fontSize: typography.sizes.xl,
		lineHeight: typography.sizes.xl * typography.lineHeights.normal,
	},
	h6: {
		fontFamily: typography.fonts.semiBold,
		fontSize: typography.sizes.lg,
		lineHeight: typography.sizes.lg * typography.lineHeights.normal,
	},

	// Body styles
	body: {
		fontFamily: typography.fonts.regular,
		fontSize: typography.sizes.base,
		lineHeight: typography.sizes.base * typography.lineHeights.normal,
	},
	bodyMedium: {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.base,
		lineHeight: typography.sizes.base * typography.lineHeights.normal,
	},
	bodyLarge: {
		fontFamily: typography.fonts.regular,
		fontSize: typography.sizes.md,
		lineHeight: typography.sizes.md * typography.lineHeights.normal,
	},
	bodySmall: {
		fontFamily: typography.fonts.regular,
		fontSize: typography.sizes.sm,
		lineHeight: typography.sizes.sm * typography.lineHeights.normal,
	},

	// Caption styles
	caption: {
		fontFamily: typography.fonts.regular,
		fontSize: typography.sizes.xs,
		lineHeight: typography.sizes.xs * typography.lineHeights.normal,
	},
	captionMedium: {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.xs,
		lineHeight: typography.sizes.xs * typography.lineHeights.normal,
	},

	// Special styles
	label: {
		fontFamily: typography.fonts.medium,
		fontSize: typography.sizes.sm,
		lineHeight: typography.sizes.sm * typography.lineHeights.normal,
		textTransform: "uppercase" as const,
		letterSpacing: typography.letterSpacing.wider,
	},
	button: {
		fontFamily: typography.fonts.semiBold,
		fontSize: typography.sizes.md,
		lineHeight: typography.sizes.md * typography.lineHeights.normal,
		letterSpacing: typography.letterSpacing.wide,
	},
};
