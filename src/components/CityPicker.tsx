/**
 * CityPicker Component
 * Glass-morphism dropdown picker for city selection with native feel
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
	FlatList,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import type { City } from "../constants/cities";
import { borderRadius, colors, spacing, typography } from "../theme";

interface CityPickerProps {
	cities: City[];
	onSelectCity: (city: City) => void;
}

export const CityPicker: React.FC<CityPickerProps> = ({ cities, onSelectCity }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [searchText, setSearchText] = useState("");

	// Filter cities based on search
	const filteredCities = searchText.trim()
		? cities.filter(
				city =>
					city.name.toLowerCase().includes(searchText.toLowerCase()) ||
					city.country.toLowerCase().includes(searchText.toLowerCase())
		  )
		: cities;

	const handleSelectCity = (city: City) => {
		onSelectCity(city);
		setModalVisible(false);
		setSearchText("");
	};

	return (
		<>
			{/* Trigger Button */}
			<TouchableOpacity
				style={styles.triggerButton}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.7}
			>
				<View style={styles.triggerContent}>
					<Ionicons name="location-sharp" size={24} color={colors.accent} />
					<Text style={styles.triggerText}>Select a City</Text>
					<Ionicons name="chevron-down-outline" size={22} color={colors.text.light} />
				</View>
			</TouchableOpacity>

			{/* Modal Dropdown */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				{/* Backdrop */}
				<Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
					{/* Modal Content with Glass-morphism */}
					<Pressable style={styles.modalContentWrapper} onPress={e => e.stopPropagation()}>
						<BlurView intensity={Platform.OS === "ios" ? 80 : 100} style={styles.modalContent}>
							{/* Header */}
							<View style={styles.modalHeader}>
								<View style={styles.headerTitleContainer}>
									<Ionicons name="globe-outline" size={26} color={colors.accent} />
									<Text style={styles.modalTitle}>Choose Your City</Text>
								</View>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={() => setModalVisible(false)}
									hitSlop={12}
								>
									<Ionicons name="close-circle" size={32} color={colors.text.light} />
								</TouchableOpacity>
							</View>

							{/* Search Input */}
							<View style={styles.searchContainer}>
								<View style={styles.searchInputWrapper}>
									<Ionicons
										name="search-outline"
										size={22}
										color={colors.text.light}
										style={styles.searchIcon}
									/>
									<TextInput
										style={styles.searchInput}
										placeholder="Search by city or country..."
										placeholderTextColor={colors.text.muted}
										value={searchText}
										onChangeText={setSearchText}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{searchText.length > 0 && (
										<TouchableOpacity
											onPress={() => setSearchText("")}
											hitSlop={10}
											style={styles.clearSearchButton}
										>
											<Ionicons name="close-circle" size={22} color={colors.text.light} />
										</TouchableOpacity>
									)}
								</View>
							</View>

							{/* Results Count */}
							<View style={styles.resultsHeader}>
								<View style={styles.resultsBadge}>
									<Text style={styles.resultsCount}>
										{filteredCities.length} {filteredCities.length === 1 ? "city" : "cities"}
									</Text>
								</View>
							</View>

							{/* Cities List */}
							<FlatList
								data={filteredCities}
								keyExtractor={item => `${item.name}-${item.country}`}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.cityItem}
										onPress={() => handleSelectCity(item)}
										activeOpacity={0.7}
									>
										<View style={styles.cityItemContent}>
											<View style={styles.cityIconContainer}>
												<Ionicons name="location" size={22} color={colors.accent} />
											</View>
											<View style={styles.cityTextContainer}>
												<Text style={styles.cityName}>{item.name}</Text>
												<Text style={styles.cityCountry}>{item.country}</Text>
											</View>
											<Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
										</View>
									</TouchableOpacity>
								)}
								showsVerticalScrollIndicator={true}
								indicatorStyle="white"
								contentContainerStyle={styles.listContent}
								keyboardShouldPersistTaps="handled"
								ListEmptyComponent={
									<View style={styles.emptyContainer}>
										<View style={styles.emptyIconContainer}>
											<Ionicons name="search-outline" size={56} color={colors.text.muted} />
										</View>
										<Text style={styles.emptyText}>No cities found</Text>
										<Text style={styles.emptySubtext}>Try searching with a different term</Text>
									</View>
								}
							/>
						</BlurView>
					</Pressable>
				</Pressable>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	triggerButton: {
		backgroundColor: colors.glassStrong,
		borderRadius: borderRadius.xl,
		borderWidth: 1,
		borderColor: colors.glassBorder,
		marginBottom: spacing.lg,
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: colors.shadow,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 8,
			},
			android: {
				elevation: 4,
			},
		}),
	},
	triggerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: spacing.lg,
		paddingHorizontal: spacing.xl,
		gap: spacing.md,
	},
	triggerText: {
		flex: 1,
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
		letterSpacing: 0.3,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(13, 27, 42, 0.85)",
		justifyContent: "flex-end",
	},
	modalContentWrapper: {
		height: "88%",
		borderTopLeftRadius: borderRadius["3xl"],
		borderTopRightRadius: borderRadius["3xl"],
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: -8 },
				shadowOpacity: 0.3,
				shadowRadius: 16,
			},
			android: {
				elevation: 24,
			},
		}),
	},
	modalContent: {
		flex: 1,
		backgroundColor: "rgba(30, 40, 55, 0.92)",
		paddingTop: spacing.xl,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	headerTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		flex: 1,
	},
	modalTitle: {
		fontSize: typography.sizes["2xl"],
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		letterSpacing: 0.5,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	closeButton: {
		padding: spacing.xs,
	},
	searchContainer: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.lg,
		paddingBottom: spacing.md,
	},
	searchInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		borderRadius: borderRadius.xl,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
		...Platform.select({
			ios: {
				shadowColor: colors.shadow,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.15,
				shadowRadius: 4,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	searchIcon: {
		opacity: 0.9,
	},
	searchInput: {
		flex: 1,
		fontSize: typography.sizes.base,
		color: colors.text.light,
		paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm,
		fontWeight: typography.weights.medium,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	clearSearchButton: {
		padding: spacing.xs,
	},
	resultsHeader: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		flexDirection: "row",
		alignItems: "center",
	},
	resultsBadge: {
		backgroundColor: "rgba(255, 255, 255, 0.18)",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: borderRadius.full,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	resultsCount: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		fontWeight: typography.weights.semibold,
		letterSpacing: 0.5,
		textTransform: "uppercase",
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	listContent: {
		paddingBottom: spacing["2xl"],
		paddingTop: spacing.sm,
	},
	cityItem: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.sm,
		backgroundColor: "rgba(255, 255, 255, 0.12)",
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.25)",
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: colors.shadow,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	cityItemContent: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
		gap: spacing.md,
	},
	cityIconContainer: {
		width: 40,
		height: 40,
		borderRadius: borderRadius.full,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	cityTextContainer: {
		flex: 1,
	},
	cityName: {
		fontSize: typography.sizes.lg,
		fontWeight: typography.weights.semibold,
		color: colors.text.light,
		marginBottom: 2,
		letterSpacing: 0.3,
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	cityCountry: {
		fontSize: typography.sizes.sm,
		color: colors.text.light,
		opacity: 0.75,
		fontWeight: typography.weights.medium,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
	emptyContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing["4xl"],
		paddingHorizontal: spacing.xl,
	},
	emptyIconContainer: {
		width: 100,
		height: 100,
		borderRadius: borderRadius.full,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},
	emptyText: {
		fontSize: typography.sizes.xl,
		fontWeight: typography.weights.bold,
		color: colors.text.light,
		marginBottom: spacing.sm,
		letterSpacing: 0.3,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	emptySubtext: {
		fontSize: typography.sizes.base,
		color: colors.text.light,
		opacity: 0.75,
		textAlign: "center",
		fontWeight: typography.weights.medium,
		textShadowColor: "rgba(0, 0, 0, 0.2)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 1,
	},
});
