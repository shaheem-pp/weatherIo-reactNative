/**
 * SearchBar Component
 * Native-feeling search bar with city suggestions
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
	Animated,
	Keyboard,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { POPULAR_CITIES } from "../constants/cities";
import { borderRadius, colors, spacing, typography } from "../theme";

interface SearchBarProps {
	onSearch: (city: string) => void;
	placeholder?: string;
}

const DEFAULT_SUGGESTION_COUNT = 12;
const MATCHING_SUGGESTION_COUNT = 24;

export const SearchBar: React.FC<SearchBarProps> = ({
	onSearch,
	placeholder = "Search city...",
}) => {
	const [searchText, setSearchText] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(0));

	const handleSearch = (city?: string) => {
		const searchValue = (city || searchText).trim();
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

	const filteredCities = useMemo(() => {
		const query = searchText.trim().toLowerCase();
		if (!query) {
			return POPULAR_CITIES.slice(0, DEFAULT_SUGGESTION_COUNT);
		}

		return POPULAR_CITIES.filter(city => city.search.includes(query)).slice(
			0,
			MATCHING_SUGGESTION_COUNT
		);
	}, [searchText]);

	const suggestionHeader = searchText.trim()
		? "Matching Cities"
		: "Major Cities";

	return (
		<View style={styles.container}>
			<View style={styles.searchBox}>
				<Ionicons name="search" size={20} color={colors.text.light} style={styles.searchIcon} />
				<TextInput
					style={styles.input}
					value={searchText}
					onChangeText={setSearchText}
					placeholder={placeholder}
					placeholderTextColor={colors.text.muted}
					onSubmitEditing={() => handleSearch()}
					onFocus={handleFocus}
					onBlur={handleBlur}
					returnKeyType="search"
					autoCapitalize="words"
					autoCorrect={false}
				/>
				{searchText.length > 0 && (
					<TouchableOpacity onPress={handleClear} style={styles.clearButton}>
						<Ionicons name="close" size={18} color={colors.text.light} />
					</TouchableOpacity>
				)}
			</View>

			{/* City Suggestions Dropdown */}
			{showSuggestions && (
				<Animated.View style={[styles.suggestionsContainer, { opacity: fadeAnim }]}>
					<ScrollView
						showsVerticalScrollIndicator
						keyboardShouldPersistTaps="handled"
						nestedScrollEnabled
						style={styles.suggestionsList}
						contentContainerStyle={styles.suggestionsContent}
					>
						<Text style={styles.suggestionsHeader}>{suggestionHeader}</Text>
						{filteredCities.length === 0 ? (
							<Text style={styles.emptyText}>No matching cities yet.</Text>
						) : (
							filteredCities.map(item => (
								<TouchableOpacity
									key={`${item.name}-${item.country}`}
									style={styles.suggestionItem}
									onPress={() => handleSearch(`${item.name},${item.country}`)}
								>
									<Ionicons name="location-outline" size={18} color={colors.text.light} />
									<Text style={styles.suggestionText}>{item.display}</Text>
									<Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
								</TouchableOpacity>
							))
						)}
					</ScrollView>
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.lg,
		zIndex: 1000,
	},
	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.glassStrong,
		borderRadius: borderRadius.full,
		paddingHorizontal: spacing.lg,
		paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm,
		borderWidth: 1,
		borderColor: colors.glassBorder,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 18,
		elevation: 8,
	},
	searchIcon: {
		marginRight: spacing.sm,
	},
	input: {
		flex: 1,
		fontSize: typography.sizes.base,
		color: colors.text.light,
		paddingVertical: spacing.sm,
		fontFamily: typography.fonts.body,
	},
	clearButton: {
		padding: spacing.sm,
	},
	suggestionsContainer: {
		marginTop: spacing.sm,
		backgroundColor: colors.surfaceStrong,
		borderRadius: borderRadius.lg,
		maxHeight: 300,
		shadowColor: colors.shadow,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 10,
		borderWidth: 1,
		borderColor: colors.glassBorder,
		overflow: "hidden",
	},
	suggestionsList: {
		maxHeight: 300,
	},
	suggestionsContent: {
		paddingBottom: spacing.sm,
	},
	suggestionsHeader: {
		fontSize: typography.sizes.xs,
		fontFamily: typography.fonts.label,
		color: colors.text.muted,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.sm,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	suggestionItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	suggestionText: {
		flex: 1,
		fontSize: typography.sizes.base,
		fontFamily: typography.fonts.label,
		color: colors.text.light,
	},
	emptyText: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		fontSize: typography.sizes.sm,
		fontFamily: typography.fonts.body,
		color: colors.text.muted,
	},
});
