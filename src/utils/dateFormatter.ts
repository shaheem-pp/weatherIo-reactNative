/**
 * Date Formatting Utilities
 * Helper functions for formatting dates and times
 */

/**
 * Formats Unix timestamp to readable date string
 * @param timestamp - Unix timestamp
 * @returns Formatted date string (e.g., "Monday, Jan 8")
 */
export const formatDate = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		month: "short",
		day: "numeric",
	};
	return date.toLocaleDateString("en-US", options);
};

/**
 * Formats Unix timestamp to short date string
 * @param timestamp - Unix timestamp
 * @returns Short date string (e.g., "Mon, Jan 8")
 */
export const formatShortDate = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	const options: Intl.DateTimeFormatOptions = {
		weekday: "short",
		month: "short",
		day: "numeric",
	};
	return date.toLocaleDateString("en-US", options);
};

/**
 * Formats Unix timestamp to time string
 * @param timestamp - Unix timestamp
 * @returns Time string (e.g., "3:45 PM")
 */
export const formatTime = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "2-digit",
	};
	return date.toLocaleTimeString("en-US", options);
};

/**
 * Gets day name from Unix timestamp
 * @param timestamp - Unix timestamp
 * @returns Day name (e.g., "Monday")
 */
export const getDayName = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	return date.toLocaleDateString("en-US", { weekday: "long" });
};

/**
 * Gets short day name from Unix timestamp
 * @param timestamp - Unix timestamp
 * @returns Short day name (e.g., "Mon")
 */
export const getShortDayName = (timestamp: number): string => {
	const date = new Date(timestamp * 1000);
	return date.toLocaleDateString("en-US", { weekday: "short" });
};
