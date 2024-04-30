import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const useLoadPageData = (pageId, setComponents, setBackgroundImage, setSavedPages, flowId, setButtonConfigs, setHapticNodes) => {
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
  
              // Restore button configurations and haptic nodes
              const newButtonConfigs = {};
              const newHapticNodes = {};
              currentPage.components.forEach(component => {
                  if (component.type === 'Button') {
                      newButtonConfigs[component.id] = component.nextPageId;
                      newHapticNodes[component.id] = component.hapticNodes;
                  }
              });
              setButtonConfigs(newButtonConfigs);
              setHapticNodes(newHapticNodes);
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

    const validatePagesData = async () => {
      let storedPagesJson = await AsyncStorage.getItem('@pages');
      let storedPages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
      
      // Correct any page ids that are arrays rather than strings
      storedPages = storedPages.map(page => ({
          ...page,
          id: Array.isArray(page.id) ? page.id[0] : page.id
      }));
  
      await AsyncStorage.setItem('@pages', JSON.stringify(storedPages));
    };

    const fetchPages = async () => {
      const storedPagesJson = await AsyncStorage.getItem('@pages');
      const pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
      setSavedPages(pages.filter(p => p.flowId === flowId));
      currentPages = pages.filter(p => p.flowId === flowId);

      console.log('Fetched pages:', currentPages[0].components);
    };

    // Call the function to load page data
    loadPageData();

    // Call the function to request permissions
    requestPermissions();

    // validate the page data
    validatePagesData();

    fetchPages();
  }, [pageId, setComponents, setBackgroundImage, flowId]);
};

export default useLoadPageData;
