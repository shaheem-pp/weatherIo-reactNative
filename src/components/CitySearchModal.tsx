/**
 * City Search Modal Component
 * Allows users to search and select different cities with fuzzy search
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
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
import { worldCities } from "../constants/worldCities";
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
	const [loading, setLoading] = useState(false);
	const [apiResults, setApiResults] = useState<City[]>([]);
	const [searchingApi, setSearchingApi] = useState(false);

	// Use our curated world cities database (already sorted by population)
	const citiesData = useMemo(() => worldCities, []);

	// Popular cities for initial display (top 20 by population)
	const popularCities: City[] = useMemo(() => worldCities.slice(0, 20), []);

	// Fuzzy search with ranking
	const searchResults = useMemo(() => {
		if (!searchQuery.trim() || searchQuery.length < 2) {
			return popularCities;
		}

		const query = searchQuery.toLowerCase();
		const results: Array<City & { score: number }> = [];

		// Search through all cities
		for (const city of citiesData) {
			const cityName = city.name.toLowerCase();
			const country = city.country.toLowerCase();
			const state = city.state?.toLowerCase() || "";

			let score = 0;

			// Exact match (highest priority)
			if (cityName === query) {
				score = 1000;
			}
			// Starts with query (high priority)
			else if (cityName.startsWith(query)) {
				score = 900 - cityName.length;
			}
			// Contains query as substring (medium priority)
			else if (cityName.includes(query)) {
				const index = cityName.indexOf(query);
				score = 500 - index * 10;
			}
			// State matches
			else if (state && state.includes(query)) {
				score = 300;
			}
			// Country matches
			else if (country.includes(query)) {
				score = 200;
			}
			// Character-by-character fuzzy match (lowest priority)
			else {
				let tempScore = 0;
				let lastIndex = -1;
				let consecutive = 0;

				for (const char of query) {
					const index = cityName.indexOf(char, lastIndex + 1);
					if (index === -1) {
						tempScore = 0;
						break;
					}

					if (index === lastIndex + 1) {
						consecutive++;
						tempScore += 10 + consecutive * 5;
					} else {
						consecutive = 0;
						tempScore += Math.max(1, 10 - (index - lastIndex));
					}

					lastIndex = index;
				}

				score = tempScore;
			}

			// Only include if there's a match
			if (score > 0) {
				// Boost score by population rank (but don't let it dominate)
				const populationBonus = Math.log(city.population) * 2;
				results.push({ ...city, score: score + populationBonus });
			}

			// Stop if we have enough high-quality results
			if (results.length >= 100 && score < 100) break;
		}

		// Sort by score and return top 50 results
		const localResults = results
			.sort((a, b) => b.score - a.score)
			.slice(0, 50)
			.map(({ score, population, ...city }) => city);

		// If no local results and we have API results, use those
		if (localResults.length === 0 && apiResults.length > 0) {
			return apiResults;
		}

		return localResults;
	}, [searchQuery, citiesData, popularCities, apiResults]);

	// Search OpenWeatherMap API when no local results found
	useEffect(() => {
		if (!searchQuery.trim() || searchQuery.length < 2) {
			setApiResults([]);
			return;
		}

		// Check if we have local results
		const query = searchQuery.toLowerCase();
		const hasLocalResults = citiesData.some(city => {
			const cityName = city.name.toLowerCase();
			const country = city.country.toLowerCase();
			const state = city.state?.toLowerCase() || "";
			return cityName.includes(query) || state.includes(query) || country.includes(query);
		});

		if (hasLocalResults) {
			setApiResults([]);
			return;
		}

		// No local results, search API
		const searchApi = async () => {
			setSearchingApi(true);
			try {
				const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
				const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
					searchQuery
				)}&limit=10&appid=${API_KEY}`;

				const response = await fetch(url);
				if (response.ok) {
					const data = await response.json();
					const cities: City[] = data.map((item: any) => ({
						name: item.name,
						country: item.country,
						state: item.state,
						lat: item.lat,
						lon: item.lon,
					}));
					setApiResults(cities);
				}
			} catch (error) {
				console.error("Error searching OpenWeatherMap API:", error);
			} finally {
				setSearchingApi(false);
			}
		};

		const timeoutId = setTimeout(searchApi, 500);
		return () => clearTimeout(timeoutId);
	}, [searchQuery, citiesData]);

	const handleSearch = (text: string) => {
		setSearchQuery(text);
	};

	const handleSelectCity = async (city: City) => {
		setLoading(true);

		try {
			// Use OpenWeatherMap Geocoding API to get accurate coordinates
			const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
			const query = city.state
				? `${city.name},${city.state},${city.country}`
				: `${city.name},${city.country}`;

			const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
				query
			)}&limit=1&appid=${API_KEY}`;

			const response = await fetch(url);

			if (response.ok) {
				const data = await response.json();
				if (data && data.length > 0) {
					// Use coordinates from API
					onSelectCity(data[0].lat, data[0].lon, city.name);
				} else {
					// Fallback to library coordinates
					onSelectCity(city.lat, city.lon, city.name);
				}
			} else {
				// Fallback to library coordinates
				onSelectCity(city.lat, city.lon, city.name);
			}
		} catch (error) {
			console.error("Error fetching city coordinates:", error);
			// Fallback to library coordinates
			onSelectCity(city.lat, city.lon, city.name);
		} finally {
			setLoading(false);
			setSearchQuery("");
			onClose();
		}
	};

	const renderCityItem = ({ item }: { item: City }) => (
		<TouchableOpacity onPress={() => handleSelectCity(item)} disabled={loading}>
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
									setApiResults([]);
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
								<Text style={styles.loadingText}>Loading city...</Text>
							</View>
						) : (
							<>
								<View style={styles.sectionHeader}>
									<Text style={styles.sectionTitle}>
										{searchQuery.length > 1
											? searchingApi
												? "Searching online..."
												: `${searchResults.length} cities found`
											: "Popular Cities"}
									</Text>
								</View>
								{searchingApi && searchQuery.length > 1 ? (
									<View style={styles.loadingContainer}>
										<ActivityIndicator size="small" color={colors.white} />
										<Text style={styles.loadingText}>Searching online...</Text>
									</View>
								) : (
									<FlatList
										data={searchResults}
										renderItem={renderCityItem}
										keyExtractor={(item, index) =>
											`${item.name}-${item.country}-${item.lat}-${index}`
										}
										showsVerticalScrollIndicator={false}
										initialNumToRender={20}
										maxToRenderPerBatch={20}
										windowSize={10}
									/>
								)}
							</>
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
