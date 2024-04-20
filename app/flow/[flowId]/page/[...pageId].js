import React, { useState, useEffect } from 'react';
import { View, Button, ImageBackground, Platform, Text, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';


// import styles
import styles from '../../../styles/stylesIndex.js';


// import components
import Dropdown from '../../../components/Dropdown/Dropdown.js';
import HapticDropdown from '../../../components/HapticDropdown/HapticDropdown.js';
import ButtonComponent from '../../../components/ButtonComponent/ButtonComponent.js';
import useLoadPageData from '../../../components/useLoadPageData/useLoadPageData.js';

// import modals
//import SaveDesignModal from '../../modals/SaveDesignModal.js';
import MainMenuModal from '../../../modals/MainMenuModal.js';
import ButtonConfigOverlayModal from '../../../modals/ButtonConfigOverlayModal.js';


export default function App() {
  const { flowId, pageId: pageIdArray } = useLocalSearchParams();  // Extracting pageId from the URL parameters
  const pageId = Array.isArray(pageIdArray) ? pageIdArray[0] : pageIdArray;
  // const glob = useGlobalSearchParams();
  // const local = useLocalSearchParams();

  // console.log("Local:", local, "Global:", glob); //  this is for debug purposes

  const [components, setComponents] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [savePageModalVisible, setSavePageModalVisible] = useState(false);
  // const [pageName, setPageName] = useState('');
  const [savedPages, setSavedPages] = useState([]);
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [configOverlayVisible, setConfigOverlayVisible] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [hapticNodes, setHapticNodes] = useState({});

   // Use the custom hook to load page data and handle permissions
   useLoadPageData(pageId, setComponents, setBackgroundImage);

  const HapticNodeItem = ({ item, drag, isActive, onValueChange }) => {
    // Assuming your `item` has a 'label' and 'value' that corresponds to the haptic feedback
    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.nodeItem,
          { backgroundColor: isActive ? "red" : "lightgrey" },
        ]}
      >
        <HapticDropdown
          onHapticChange={(value) => {
            onValueChange(item.key, value); // Update based on item.key
          }}
          selectedValue={item.value}
        />
      </TouchableOpacity>
    );
  };
  
  const HapticNodeList = ({ nodes, setNodes }) => {
    const renderItem = ({ item, drag, isActive }) => {
      const onValueChange = (key, newValue) => {
        console.log(`Haptic feedback for ${key} changed to ${newValue}`);
        const updatedNodes = nodes.map((node) => 
          node.key === key ? { ...node, value: newValue } : node
        );
        setNodes(updatedNodes);
      };
  
      return (
        <HapticNodeItem
          item={item}
          drag={drag}
          isActive={isActive}
          onValueChange={onValueChange}
        />
      );
    };
  
    return (
      <DraggableFlatList
        data={nodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setNodes(data)}
      />
    );
  };

  // Main component logic
  const ButtonConfiguration = () => {
    //const [nodes, setNodes] = useState([]);
  
    // Function to add a new haptic node
    const addHapticNode = () => {
      const newNode = {
        key: `${Date.now()}`, // Unique key for the new node
        value: 'selectionAsync', // Default value or some initial value
      };
      const currentNodes = hapticNodes[currentButtonId] || [];
      const updatedNodes = [...currentNodes, newNode];
      setHapticNodes({ ...hapticNodes, [currentButtonId]: updatedNodes });
    };
    return (
      <View style={styles.container}>
        <Button title="Add Haptic Node" onPress={addHapticNode} />
        <HapticNodeList
          nodes={hapticNodes[currentButtonId] || []}
          setNodes={(newNodes) => {
            setHapticNodes({ ...hapticNodes, [currentButtonId]: newNodes });
          }}
        />
      </View>
    );
  }; 

  const handlePositionChange = (componentId, newPosition) => {
    setComponents(currentComponents => currentComponents.map(comp => {
      if (comp.id === componentId) {
        return { ...comp, position: newPosition };
      }
      return comp;
    }));
  };
  


  // Use the custom hook to load page data and handle permissions
  useLoadPageData(pageId, setComponents, setBackgroundImage);
  
  const savePage = async () => {
    // Fetch the existing list of pages
    const storedPagesJson = await AsyncStorage.getItem('@pages');
    let pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];

    // Find the page object using `pageId`
    const currentPage = pages.find(p => p.id === pageId);

    if (currentPage) {
        console.log("Current page: ", JSON.stringify(currentPage, null, 2));
    } else {
        console.log("No page found with id:", pageId);
    }
    
    
    // Find the index of the current page using `pageId`
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex !== -1) {
      // Update the existing page data
      pages[pageIndex] = {
        ...pages[pageIndex], // Preserve existing data
        components: components, // Update components
        backgroundImageUri: backgroundImage ? backgroundImage : null // Update background image
      };

      // Save the updated pages array back to storage
      try {
        await AsyncStorage.setItem('@pages', JSON.stringify(pages));
        alert('Page updated successfully!');
      } catch (e) {
        console.error('Failed to update page', e);
        alert('Failed to update page.');
      }
    } else {
      // This case should not normally occur since the page should exist
      alert('Page not found!');
    }
  };

  const loadPage = async () => { // maybe should only be in flowOverview
    const storedPagesJson = await AsyncStorage.getItem('@pages');
    const pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
    const currentPage = pages.find(p => p.id === pageId);
    if (currentPage) {
      setComponents(currentPage.components);
      setBackgroundImage(currentPage.backgroundImageUri ? { uri: currentPage.backgroundImageUri } : null);
    } else {
      alert('Page not found');
    }
  };
  


  const deletePage = async (id) => { // maybe should only be in flowOverview
    const storedPagesJson = await AsyncStorage.getItem('@pages');
    let pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
    const filteredPages = pages.filter(p => p.id !== id);
    
    try {
      await AsyncStorage.setItem('@pages', JSON.stringify(filteredPages));
      alert('Page deleted successfully!');
    } catch (e) {
      console.error('Failed to delete page', e);
      alert('Failed to delete page.');
    }
  };
  

  
  const clearScreen = () => {
    console.log('Clearing screen...');
    setComponents([]); // Clear all components
    setBackgroundImage(require('../../../../assets/splash.png')); // Remove background image
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    if (!result.cancelled) {
        setBackgroundImage({ uri: result.assets[0].uri });
    }
    setModalVisible(false); // Optionally close the modal after setting the background
  };


  const handleAddComponent = () => {
    const newComponent = {
      type: 'Button',
      id: Date.now(),
      position: { x: 0, y: 0 },
    };
    setComponents([...components, newComponent]);
  };

  const onButtonPress = async (id) => {

    const hapticSequence = hapticNodes[id] || [];
    
    for (let node of hapticSequence) {
      switch (node.value) {
        case 'selectionAsync':
          console.log('HapticSelection');
          await Haptics.selectionAsync();
          break;
        case 'notificationAsyncSuccess':
          console.log('HapticSuccess');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'notificationAsyncError':
          console.log('HapticError');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'notificationAsyncWarning':
          console.log('HapticWarning');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'impactAsyncLight':
          console.log('HapticLight');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'impactAsyncMedium':
          console.log('HapticMedium');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'impactAsyncHeavy':
          console.log('HapticHeavy');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    }

    const pageName = buttonConfigs[id];
    if (pageName) {
      const page = savedPages.find(s => s.name === pageName);
      if (page) {
        loadPage(page);
      }
    } else {
      console.log(`Button ${id} pressed without a specific page configured.`);
    }
  };

  const onButtonLongPress = (buttonId) => {
    setCurrentButtonId(buttonId);
    setConfigOverlayVisible(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.menuButtonContainer}>
        <Button title="Menu" onPress={() => setModalVisible(true)} color="white" />
      </View>
      <MainMenuModal 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleAddComponent={handleAddComponent}
          pickImage={pickImage}
          clearScreen={clearScreen}
          // setSavePageModalVisible={setSavePageModalVisible}
          savedPages={savedPages}
          loadPage={loadPage} // maybe should only be in flowOverview
          deletePage={deletePage} // maybe should only be in flowOverview
          // pageName={pageName}
          // setPageName={setPageName}
          savePage={savePage}
          // savePageModalVisible={savePageModalVisible}
          flowId={flowId}
      />
      <ButtonConfigOverlayModal
          visible={configOverlayVisible}
          onClose={() => setConfigOverlayVisible(false)}
          savedPages={savedPages}
          currentButtonId={currentButtonId}
          buttonConfigs={buttonConfigs}
          setButtonConfigs={setButtonConfigs}
          ButtonConfigurationComponent={<ButtonConfiguration />}
      />
        {components.map((component) => (
          <ButtonComponent
            key={component.id}
            id={component.id}
            onPress={onButtonPress}
            onLongPress={onButtonLongPress}
            initialPosition={component.position}
            onPositionChange={handlePositionChange}
          />
        ))}
      </ImageBackground>
    </GestureHandlerRootView>
  );
}