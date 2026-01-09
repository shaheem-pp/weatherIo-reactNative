/**
 * Weather Icon Component
 * Displays weather icon from OpenWeatherMap
 */

import React from "react";
import { Image, StyleSheet } from "react-native";
import { getWeatherIconUrl } from "../utils";

interface WeatherIconProps {
	iconCode: string;
	size?: number;
	style?: any;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, size = 100, style }) => {
	return (
		<Image
			source={{ uri: getWeatherIconUrl(iconCode, "4x") }}
			style={[styles.icon, { width: size, height: size }, style]}
			resizeMode="contain"
		/>
	);
};

const styles = StyleSheet.create({
	icon: {
		alignSelf: "center",
	},
});
