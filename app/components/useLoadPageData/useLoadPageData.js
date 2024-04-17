import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const useLoadPageData = (pageId, setComponents, setBackgroundImage) => {
  useEffect(() => {
    // Function to load the page data
    const loadPageData = async () => {
      const storedPages = await AsyncStorage.getItem('@pages');
      if (storedPages) {
        const pages = JSON.parse(storedPages);
        const currentPage = pages.find(p => p.id === pageId);
        if (currentPage) {
          setComponents(currentPage.components);
          setBackgroundImage(currentPage.backgroundImageUri);
          // Set other state specific to the page as needed
        }
      }
    };

    // Function to request permissions
    const requestPermissions = async () => {
      if (Platform.OS !== 'web') {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
          }
        } catch (e) {
          console.error('Failed to request media library permissions', e);
          Alert.alert('Permission error', 'Failed to request media library permissions');
        }
      }
    };

    // Call the function to load page data
    loadPageData();

    // Call the function to request permissions
    requestPermissions();
  }, [pageId, setComponents, setBackgroundImage]);
};

export default useLoadPageData;
