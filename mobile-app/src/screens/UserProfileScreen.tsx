import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Share, ActivityIndicator, Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { userApi } from "../services/api";
import { ImageData, UserProfileData } from "../types";
import styles from "../styles/UserProfileScreen.styles";
import { generateProfileUrl } from "../config/environment";

export default function UserProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute();
  const navigation = useNavigation();
  const userId = (route.params as any)?.userId;

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [userId]);

  const fetchUserProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const profile = await userApi.getUserProfile(id);
      setUserProfile(profile);
    } catch (err: any) {
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleShareProfile = async () => {
    if (!userProfile) return;
    try {
      const profileUrl = generateProfileUrl(userProfile.id);
      let shareMessage = `Check out ${userProfile.first_name} ${userProfile.last_name}'s profile on Images Gallery!\n\n${profileUrl}`;
      if (__DEV__) {
        shareMessage += '\n\n🚀 Development Mode:\n• This URL is clickable but will show "Page not found" (normal for dev)\n• To test actual deep linking: npx uri-scheme open "exp://192.168.88.91:8081/--/profile/' + userProfile.id + '" --android';
      }
      
      await Share.share({
        message: shareMessage,
        title: `${userProfile.first_name}'s Profile`,
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
      Alert.alert("Error", "Failed to share profile");
    }
  };

  const renderImage = (image: ImageData) => (
    <TouchableOpacity key={image.id} style={styles.imageContainer}>
      <Image
        source={{ uri: image.signed_url || image.url }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchUserProfile(userId)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareProfile}
        >
          <Ionicons name="share-outline" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile.first_name.charAt(0)}
              {userProfile.last_name.charAt(0)}
            </Text>
          </View>
        </View>

        <Text style={styles.userName}>
          {userProfile.first_name} {userProfile.last_name}
        </Text>

        <Text style={styles.joinDate}>
          Member since{" "}
          {new Date(userProfile.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.images.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>
      </View>

      {/* Images Gallery */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionTitle}>Photos</Text>

        {userProfile.images.length > 0 ? (
          <View style={styles.imagesGrid}>
            {userProfile.images.map(renderImage)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No photos shared yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
