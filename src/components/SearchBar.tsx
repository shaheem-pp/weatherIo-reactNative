/**
 * SearchBar Component
 * Native-feeling search bar with city suggestions
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Keyboard,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	FlatList,
	Text,
	Animated,
} from "react-native";
import { borderRadius, colors, spacing, typography } from "../theme";
import { POPULAR_CITIES } from "../constants/cities";

interface SearchBarProps {
	onSearch: (city: string) => void;
	placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search city...",
}) => {
	const [searchText, setSearchText] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));

	const handleSearch = (city?: string) => {
		const searchValue = city || searchText.trim();
		if (searchValue) {
			onSearch(searchValue);
			setSearchText("");
			setShowSuggestions(false);
			Keyboard.dismiss();
		}
	};

	const handleClear = () => {
		setSearchText("");
		setShowSuggestions(false);
	};

	const handleFocus = () => {
		setShowSuggestions(true);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	const handleBlur = () => {
		// Delay to allow city selection
		setTimeout(() => {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => setShowSuggestions(false));
		}, 150);
	};

	const filteredCities = POPULAR_CITIES.filter(city =>
		city.display.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<View style={styles.container}>
			<View style={styles.searchBox}>
				<Ionicons
					name="search"
					size={20}
					color="rgba(255, 255, 255, 0.8)"
					style={styles.searchIcon}
				/>
				<TextInput
					style={styles.input}
					value={searchText}
					onChangeText={setSearchText}
					placeholder={placeholder}
					placeholderTextColor="rgba(255, 255, 255, 0.6)"
					onSubmitEditing={() => handleSearch()}
					onFocus={handleFocus}
					onBlur={handleBlur}
					returnKeyType="search"
					autoCapitalize="words"
					autoCorrect={false}
				/>
				{searchText.length > 0 && (
					<TouchableOpacity onPress={handleClear} style={styles.clearButton}>
						<Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.8)" />
					</TouchableOpacity>
				)}
			</View>

			{/* City Suggestions Dropdown */}
			{showSuggestions && (
				<Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
					<FlatList
						data={searchText ? filteredCities : POPULAR_CITIES.slice(0, 8)}
						keyExtractor={(item) => item.name + item.country}
						scrollEnabled={true}
						style={styles.suggestionsList}
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.suggestionItem}
								onPress={() => handleSearch(item.name)}
							>
								<Ionicons name="location-outline" size={18} color={colors.text.light} />
								<Text style={styles.suggestionText}>{item.display}</Text>
								<Ionicons name="chevron-forward" size={16} color="rgba(255, 255, 255, 0.5)" />
							</TouchableOpacity>
						)}
						ListHeaderComponent={
							<Text style={styles.suggestionsHeader}>
								{searchText ? "Matching Cities" : "Popular Cities"}
							</Text>
						}
					/>
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
		zIndex: 1000,
	},
	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: borderRadius.xl,
		paddingHorizontal: spacing.lg,
		paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 6,
	},
	searchIcon: {
		marginRight: spacing.md,
	},
	input: {
		flex: 1,
		fontSize: typography.sizes.base,
		color: colors.text.light,
		paddingVertical: spacing.sm,
		fontWeight: typography.weights.medium,
	},
	clearButton: {
		padding: spacing.sm,
	},
	suggestionsContainer: {
		marginTop: spacing.sm,
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		borderRadius: borderRadius.lg,
		maxHeight: 280,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 12,
		elevation: 8,
		overflow: "hidden",
	},
	suggestionsList: {
		maxHeight: 280,
	},
	suggestionsHeader: {
		fontSize: typography.sizes.sm,
		fontWeight: typography.weights.bold,
		color: colors.text.secondary,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	suggestionItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
		borderBottomWidth: 0.5,
		borderBottomColor: "rgba(0, 0, 0, 0.05)",
	},
	suggestionText: {
		flex: 1,
		fontSize: typography.sizes.base,
		color: colors.text.primary,
		fontWeight: typography.weights.medium,	
		marginLeft: spacing.xs,
	},
});
