import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { BaseToast } from 'react-native-toast-message';

export const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#3C3630' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#a24040' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    ),
  };

export const savePageHelper = async (pageId, components, backgroundImage, buttonConfigs, hapticNodes) => {
    // Fetch the existing list of pages
    const storedPagesJson = await AsyncStorage.getItem('@pages');
    let pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];

    // Find the page object using `pageId`
    const currentPage = pages.find(p => p.id === pageId);

    if (currentPage) {
        console.log("Current page: ", JSON.stringify(currentPage, null, 2));
        console.log("Current page components: ", JSON.stringify(currentPage.components, null, 2));
    } else {
        console.log("No page found with id:", pageId);
    }
    
    
    // Find the index of the current page using `pageId`
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      pages[pageIndex] = {
        ...pages[pageIndex],
        components: components.map(component => ({
            ...component,
            nextPageId: buttonConfigs[component.id], // Assuming buttonConfigs is still relevant
            hapticNodes: hapticNodes[component.id] || [] // Store current haptic configuration
        })),
        backgroundImageUri: backgroundImage ? backgroundImage : null
    };

      // Save the updated pages array back to storage
      try {
        await AsyncStorage.setItem('@pages', JSON.stringify(pages));
        // alert('Page updated successfully!');
        Toast.show({
          type: 'success',
          text1: 'Saved Page Successfully!',
          textStyle: { fontSize: 16 }, // Applies to all text if not overridden
          position: 'top',
          visibilityTime: 3000,
          topOffset: 10, // Distance from the top (if position is 'top')
      });
      } catch (e) {
        console.error('Failed to update page', e);
        Toast.show({
          type: 'error',
          text1: 'Saving Page Unsuccessful!',
          textStyle: { fontSize: 16 }, // Applies to all text if not overridden
          position: 'top',
          visibilityTime: 3000,
          topOffset: 10, // Distance from the top (if position is 'top')
      });
      }
    } else {
      // This case should not normally occur since the page should exist
      alert('Page not found!');
    }
  };