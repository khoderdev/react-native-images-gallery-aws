import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, Share, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { imageApi } from '../services/api';
import { useAuth } from '../context/AuthContext'; 
import { generateProfileUrl } from '../config/environment';
import { ImageData, ImageGalleryScreenProps } from '../types';
import styles from '../styles/ImageGalleryScreen.styles';

export default function ImageGalleryScreen({ navigation }: ImageGalleryScreenProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadImages();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant access to your photo library');
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      const fetchedImages = await imageApi.getMyImages();
      setImages(fetchedImages);
    } catch (error) {
      Alert.alert('Error', 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleShareProfile = async () => {
    if (!user) return;
    try {
      const profileUrl = generateProfileUrl(user.id);
      
      let shareMessage = `Check out my profile on Images Gallery! I've shared ${images.length} photos.\n\n${profileUrl}`;
      
      // Add development testing instructions
      if (__DEV__) {
        shareMessage += '\n\n🚀 Development Mode:\n• This URL is clickable but will show "Page not found" (normal for dev)\n• To test actual deep linking: npx uri-scheme open "exp://192.168.88.91:8081/--/profile/' + user.id + '" --android';
      }
      
      await Share.share({
        message: shareMessage,
        title: `${user.first_name}'s Gallery Profile`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share profile');
    }
  };

  const handleViewMyProfile = () => {
    if (user) {
      navigation.navigate('Profile', { userId: user.id.toString() });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission needed', 'Please grant camera access');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (imageAsset: any) => {
    try {
      setUploading(true);
      const base64Data = `data:${imageAsset.mimeType || 'image/jpeg'};base64,${imageAsset.base64}`;
      const uploadedImage = await imageApi.uploadImage(base64Data, 'gallery');
      setImages(prev => [uploadedImage, ...prev]);
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await imageApi.deleteImage(imageId);
              setImages(prev => prev.filter(img => img.id !== imageId));
              Alert.alert('Success', 'Image deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete image');
            }
          },
        },
      ]
    );
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showProfileOptions = () => {
    Alert.alert(
      'Profile',
      'Choose an option',
      [
        { text: 'View My Profile', onPress: handleViewMyProfile },
        { text: 'Share My Profile', onPress: handleShareProfile },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={showProfileOptions}
          >
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.first_name}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShareProfile}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          {images.length} {images.length === 1 ? 'image' : 'images'} in your gallery
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={showImageOptions}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#667eea" size="small" />
          ) : (
            <Ionicons name="add" size={24} color="#667eea" />
          )}
          <Text style={styles.addButtonText}>
            {uploading ? 'Uploading...' : 'Add Image'}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading images...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.gallery}
            contentContainerStyle={styles.galleryContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageGrid}>
              {images.map((image) => (
                <TouchableOpacity
                  key={image.id}
                  style={styles.imageContainer}
                  onLongPress={() => deleteImage(image.id)}
                >
                  <Image
                    source={{ uri: image.signed_url || image.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <Ionicons name="trash-outline" size={16} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {!loading && images.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No images yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap "Add Image" to get started
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}