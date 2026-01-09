/**
 * Spacing System
 * Consistent spacing values across the app
 */

export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	base: 16,
	lg: 20,
	xl: 24,
	"2xl": 32,
	"3xl": 40,
	"4xl": 48,
	"5xl": 64,
	"6xl": 80,
	"7xl": 96,
};

/**
 * Border radius values
 */
export const borderRadius = {
	none: 0,
	sm: 4,
	base: 8,
	md: 12,
	lg: 16,
	xl: 20,
	"2xl": 24,
	"3xl": 32,
	full: 9999,
};

/**
 * Shadow configurations
 */
export const shadows = {
	sm: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.18,
		shadowRadius: 1.0,
		elevation: 1,
	},
	base: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	md: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	lg: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,
		elevation: 12,
	},
	xl: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.51,
		shadowRadius: 13.16,
		elevation: 20,
	},
};
