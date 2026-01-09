/**
 * City Search Modal Component
 * Allows users to search and select different cities
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, spacing, textStyles } from "../theme";
import { GlassCard } from "./GlassCard";

interface City {
	name: string;
	country: string;
	state?: string;
	lat: number;
	lon: number;
}

interface CitySearchModalProps {
	visible: boolean;
	onClose: () => void;
	onSelectCity: (lat: number, lon: number, cityName: string) => void;
	currentCity?: string;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
	visible,
	onClose,
	onSelectCity,
	currentCity,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<City[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Popular cities as suggestions
	const popularCities: City[] = [
		{ name: "New York", country: "US", state: "NY", lat: 40.7128, lon: -74.006 },
		{ name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
		{ name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
		{ name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
		{ name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
		{ name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
		{ name: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
		{ name: "Mumbai", country: "IN", lat: 19.076, lon: 72.8777 },
		{ name: "Los Angeles", country: "US", state: "CA", lat: 34.0522, lon: -118.2437 },
		{ name: "Toronto", country: "CA", lat: 43.6532, lon: -79.3832 },
	];

	const searchCities = async (query: string) => {
		if (!query.trim() || query.length < 2) {
			setSearchResults([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// Using OpenWeatherMap Geocoding API
			const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
			console.log("Searching for city:", query);
			const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
				query
			)}&limit=5&appid=${API_KEY}`;

			const response = await fetch(url);

			if (!response.ok) {
				const errorText = await response.text();
				console.error("API Error:", response.status, errorText);
				throw new Error("Failed to search cities");
			}

			const data = await response.json();
			console.log("Search results:", data);
			setSearchResults(data);
		} catch (err) {
			setError("Failed to search cities. Please try again.");
			console.error("City search error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (text: string) => {
		setSearchQuery(text);
		searchCities(text);
	};

	const handleSelectCity = (city: City) => {
		onSelectCity(city.lat, city.lon, city.name);
		setSearchQuery("");
		setSearchResults([]);
		onClose();
	};

	const renderCityItem = ({ item }: { item: City }) => (
		<TouchableOpacity onPress={() => handleSelectCity(item)}>
			<GlassCard style={styles.cityItem}>
				<View style={styles.cityInfo}>
					<View style={styles.cityNameRow}>
						<Ionicons name="location" size={18} color={colors.white} />
						<Text style={styles.cityName}>{item.name}</Text>
					</View>
					<Text style={styles.cityDetails}>
						{item.state ? `${item.state}, ` : ""}
						{item.country}
					</Text>
				</View>
				<Ionicons name="chevron-forward" size={20} color={colors.white} style={{ opacity: 0.5 }} />
			</GlassCard>
		</TouchableOpacity>
	);

	return (
		<Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
			<BlurView intensity={80} tint="dark" style={styles.modalContainer}>
				<View style={styles.modalContent}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Search City</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={28} color={colors.white} />
						</TouchableOpacity>
					</View>

					{/* Search Bar */}
					<View style={styles.searchContainer}>
						<Ionicons name="search" size={20} color={colors.white} style={{ opacity: 0.7 }} />
						<TextInput
							style={styles.searchInput}
							placeholder="Search for a city..."
							placeholderTextColor="rgba(255, 255, 255, 0.5)"
							value={searchQuery}
							onChangeText={handleSearch}
							autoCapitalize="words"
							autoCorrect={false}
							returnKeyType="search"
						/>
						{searchQuery.length > 0 && (
							<TouchableOpacity
								onPress={() => {
									setSearchQuery("");
									setSearchResults([]);
								}}
							>
								<Ionicons
									name="close-circle"
									size={20}
									color={colors.white}
									style={{ opacity: 0.7 }}
								/>
							</TouchableOpacity>
						)}
					</View>

					{/* Current Location */}
					{currentCity && (
						<View style={styles.currentLocationContainer}>
							<Ionicons name="navigate" size={18} color={colors.info} />
							<Text style={styles.currentLocationText}>Currently showing: {currentCity}</Text>
						</View>
					)}

					{/* Results / Popular Cities */}
					<View style={styles.resultsContainer}>
						{loading ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color={colors.white} />
								<Text style={styles.loadingText}>Searching...</Text>
							</View>
						) : error ? (
							<View style={styles.errorContainer}>
								<Ionicons name="alert-circle" size={48} color={colors.error} />
								<Text style={styles.errorText}>{error}</Text>
							</View>
						) : searchResults.length > 0 ? (
							<>
								<Text style={styles.sectionTitle}>Search Results</Text>
								<FlatList
									data={searchResults}
									renderItem={renderCityItem}
									keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
									showsVerticalScrollIndicator={false}
								/>
							</>
						) : searchQuery.length === 0 ? (
							<>
								<Text style={styles.sectionTitle}>Popular Cities</Text>
								<FlatList
									data={popularCities}
									renderItem={renderCityItem}
									keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
									showsVerticalScrollIndicator={false}
								/>
							</>
						) : (
							<View style={styles.noResultsContainer}>
								<Ionicons
									name="search-outline"
									size={48}
									color={colors.white}
									style={{ opacity: 0.3 }}
								/>
								<Text style={styles.noResultsText}>No cities found. Try a different search.</Text>
							</View>
						)}
					</View>
				</View>
			</BlurView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "rgba(20, 20, 40, 0.98)",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: spacing.lg,
		paddingHorizontal: spacing.base,
		paddingBottom: spacing.xl,
		height: "90%",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.base,
	},
	headerTitle: {
		...textStyles.h4,
		color: colors.white,
	},
	closeButton: {
		padding: spacing.xs,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: 12,
		paddingHorizontal: spacing.base,
		paddingVertical: spacing.sm,
		marginBottom: spacing.base,
		gap: spacing.sm,
	},
	searchInput: {
		flex: 1,
		...textStyles.body,
		color: colors.white,
		fontSize: 16,
	},
	currentLocationContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.base,
		backgroundColor: "rgba(100, 150, 255, 0.15)",
		borderRadius: 8,
		marginBottom: spacing.base,
	},
	currentLocationText: {
		...textStyles.caption,
		color: colors.info,
		fontSize: 13,
	},
	resultsContainer: {
		flex: 1,
	},
	sectionTitle: {
		...textStyles.h6,
		color: colors.white,
		marginBottom: spacing.sm,
		marginTop: spacing.xs,
		opacity: 0.7,
	},
	cityItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: spacing.base,
		marginBottom: spacing.sm,
	},
	cityInfo: {
		flex: 1,
	},
	cityNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: 4,
	},
	cityName: {
		...textStyles.bodyMedium,
		color: colors.white,
		fontSize: 16,
	},
	cityDetails: {
		...textStyles.caption,
		color: colors.white,
		opacity: 0.6,
		marginLeft: 26,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.xl * 2,
		gap: spacing.base,
	},
	loadingText: {
		...textStyles.body,
		color: colors.white,
		opacity: 0.7,
	},
	errorContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.xl * 2,
		gap: spacing.base,
	},
	errorText: {
		...textStyles.body,
		color: colors.error,
		textAlign: "center",
	},
	noResultsContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.xl * 2,
		gap: spacing.base,
	},
	noResultsText: {
		...textStyles.body,
		color: colors.white,
		opacity: 0.5,
		textAlign: "center",
	},
});
