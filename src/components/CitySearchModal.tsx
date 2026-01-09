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
		{ name: "Berlin", country: "DE", lat: 52.52, lon: 13.405 },
		{ name: "Madrid", country: "ES", lat: 40.4168, lon: -3.7038 },
		{ name: "Rome", country: "IT", lat: 41.9028, lon: 12.4964 },
		{ name: "Amsterdam", country: "NL", lat: 52.3676, lon: 4.9041 },
		{ name: "Bangkok", country: "TH", lat: 13.7563, lon: 100.5018 },
		{ name: "Hong Kong", country: "HK", lat: 22.3193, lon: 114.1694 },
		{ name: "Seoul", country: "KR", lat: 37.5665, lon: 126.978 },
		{ name: "Istanbul", country: "TR", lat: 41.0082, lon: 28.9784 },
		{ name: "São Paulo", country: "BR", lat: -23.5505, lon: -46.6333 },
		{ name: "Mexico City", country: "MX", lat: 19.4326, lon: -99.1332 },
	];

	// Fuzzy search algorithm
	const fuzzyMatch = (text: string, query: string): number => {
		const textLower = text.toLowerCase();
		const queryLower = query.toLowerCase();

		// Exact match gets highest score
		if (textLower === queryLower) return 100;

		// Starts with query gets high score
		if (textLower.startsWith(queryLower)) return 90;

		// Contains query as substring
		if (textLower.includes(queryLower)) return 80;

		// Character-by-character fuzzy matching
		let score = 0;
		let textIndex = 0;

		for (let i = 0; i < queryLower.length; i++) {
			const char = queryLower[i];
			const foundIndex = textLower.indexOf(char, textIndex);

			if (foundIndex === -1) return 0; // Character not found

			// Consecutive characters get bonus points
			if (foundIndex === textIndex) {
				score += 10;
			} else {
				score += Math.max(1, 10 - (foundIndex - textIndex));
			}

			textIndex = foundIndex + 1;
		}

		// Penalize longer text (prefer shorter matches)
		score -= text.length * 0.1;

		return Math.max(0, score);
	};

	// Filter popular cities with fuzzy search
	const getFilteredPopularCities = (query: string): City[] => {
		if (!query.trim()) return popularCities;

		const citiesWithScores = popularCities.map(city => ({
			city,
			score: Math.max(
				fuzzyMatch(city.name, query),
				city.state ? fuzzyMatch(city.state, query) : 0,
				fuzzyMatch(city.country, query)
			),
		}));

		return citiesWithScores
			.filter(item => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.map(item => item.city)
			.slice(0, 10);
	};

	const searchCities = async (query: string) => {
		if (!query.trim() || query.length < 2) {
			setSearchResults([]);
			return;
		}

		// First, show local fuzzy search results immediately
		const localResults = getFilteredPopularCities(query);
		if (localResults.length > 0) {
			setSearchResults(localResults);
		}

		setLoading(true);
		setError(null);

		try {
			// Using OpenWeatherMap Geocoding API
			const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
			console.log("Searching for city:", query);
			const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
				query
			)}&limit=8&appid=${API_KEY}`;

			const response = await fetch(url);

			if (!response.ok) {
				const errorText = await response.text();
				console.error("API Error:", response.status, errorText);
				throw new Error("Failed to search cities");
			}

			const data = await response.json();
			console.log("Search results:", data);

			// Combine API results with local fuzzy matches, remove duplicates
			const combinedResults: City[] = [...data];
			const apiCityNames = new Set(data.map((c: City) => c.name.toLowerCase()));

			localResults.forEach(localCity => {
				if (!apiCityNames.has(localCity.name.toLowerCase())) {
					combinedResults.push(localCity);
				}
			});

			setSearchResults(combinedResults.slice(0, 10));
		} catch (err) {
			// On error, still show local fuzzy results
			const localResults = getFilteredPopularCities(query);
			if (localResults.length > 0) {
				setSearchResults(localResults);
			} else {
				setError("Failed to search cities. Showing local results only.");
			}
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
						{loading && searchResults.length === 0 ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="large" color={colors.white} />
								<Text style={styles.loadingText}>Searching...</Text>
							</View>
						) : error && searchResults.length === 0 ? (
							<View style={styles.errorContainer}>
								<Ionicons name="alert-circle" size={48} color={colors.error} />
								<Text style={styles.errorText}>{error}</Text>
							</View>
						) : searchResults.length > 0 ? (
							<>
								<View style={styles.sectionHeader}>
									<Text style={styles.sectionTitle}>
										{searchQuery.length > 0 ? "Search Results" : "Popular Cities"}
									</Text>
									{loading && (
										<ActivityIndicator size="small" color={colors.white} style={{ opacity: 0.5 }} />
									)}
								</View>
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
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.sm,
		marginTop: spacing.xs,
	},
	sectionTitle: {
		...textStyles.h6,
		color: colors.white,
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
