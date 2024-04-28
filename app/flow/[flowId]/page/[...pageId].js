import React, { useState, useEffect } from 'react';
import { View, Button, ImageBackground, Platform, Text, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, useGlobalSearchParams, Link, router } from 'expo-router';
import Checkbox from 'react-native-ui-lib/checkbox.js'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// import styles
import styles from '../../../styles/stylesIndex.js';


// import components
import Dropdown from '../../../components/Dropdown/Dropdown.js';
import HapticDropdown from '../../../components/HapticDropdown/HapticDropdown.js';
import ButtonComponent from '../../../components/ButtonComponent/ButtonComponent.js';
import useLoadPageData from '../../../components/useLoadPageData/useLoadPageData.js';
import DynamicComponent from '../../../components/DynamicComponent/DynamicComponent.js';

// import modals
//import SaveDesignModal from '../../modals/SaveDesignModal.js';
import MainMenuModal from '../../../modals/MainMenuModal.js';
import ButtonConfigOverlayModal from '../../../modals/ButtonConfigOverlayModal.js';
import RadioConfigOverlayModal from '../../../modals/RadioConfigOverlayModal.js';
import CheckboxConfigOverlayModal from '../../../modals/CheckboxConfigOverlayModal.js';
import TextConfigOverlayModal from '../../../modals/TextConfigOverlayModal.js';
import TextInputConfigOverlayModal from '../../../modals/TextInputConfigOverlayModal.js';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';



export default function App() {
  const { flowId, pageId: pageIdArray } = useLocalSearchParams();  // Extracting pageId from the URL parameters
  const pageId = Array.isArray(pageIdArray) ? pageIdArray[0] : pageIdArray;
  // const glob = useGlobalSearchParams();
  // const local = useLocalSearchParams();

  // console.log("Local:", local, "Global:", glob); //  this is for debug purposes

  const [components, setComponents] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [componentsPageModalVisible, setComponentsPageModalVisible] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  // const [savePageModalVisible, setSavePageModalVisible] = useState(false);
  // const [pageName, setPageName] = useState('');
  const [savedPages, setSavedPages] = useState([]);
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [configOverlayVisible, setConfigOverlayVisible] = useState(false);
  const [radioConfigOverlayVisible, setRadioConfigOverlayVisible] = useState(false);
  const [checkboxConfigOverlayVisible, setCheckboxConfigOverlayVisible] = useState(false);
  const [textConfigOverlayVisible, setTextConfigOverlayVisible] = useState(false);
  const [textInputConfigOverlayVisible, setTextInputConfigOverlayVisible] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [hapticNodes, setHapticNodes] = useState({});
  const [selectedHaptic, setSelectedHaptic] = useState(null);
  const [viewMode, setViewMode] = useState(false);

   // Use the custom hook to load page data and handle permissions
   useLoadPageData(pageId, setComponents, setBackgroundImage, setSavedPages, flowId);

  const HapticNodeItem = ({ item, drag, isActive, onValueChange }) => {
    // Assuming your `item` has a 'label' and 'value' that corresponds to the haptic feedback
    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.nodeItem,
          { backgroundColor: isActive ? "lightgrey" : "#f0f0f0" },
        ]}
      >
        <HapticDropdown
          selectedHaptic={selectedHaptic}
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
        setSelectedHaptic(newValue);
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
        key: `${uuidv4()}`, // Unique key for the new node
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
  


  // // Use the custom hook to load page data and handle permissions
  // useLoadPageData(pageId, setComponents, setBackgroundImage);
  
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

  // const loadPage = async () => { // maybe should only be in flowOverview
  //   const storedPagesJson = await AsyncStorage.getItem('@pages');
  //   const pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
  //   const currentPage = pages.find(p => p.id === pageId);
  //   if (currentPage) {
  //     setComponents(currentPage.components);
  //     setBackgroundImage(currentPage.backgroundImageUri ? { uri: currentPage.backgroundImageUri } : null);
  //   } else {
  //     alert('Page not found');
  //   }
  // };
  


  // const deletePage = async (id) => { // maybe should only be in flowOverview
  //   const storedPagesJson = await AsyncStorage.getItem('@pages');
  //   let pages = storedPagesJson ? JSON.parse(storedPagesJson) : [];
  //   const filteredPages = pages.filter(p => p.id !== id);
    
  //   try {
  //     await AsyncStorage.setItem('@pages', JSON.stringify(filteredPages));
  //     alert('Page deleted successfully!');
  //   } catch (e) {
  //     console.error('Failed to delete page', e);
  //     alert('Failed to delete page.');
  //   }
  // };
  

  
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


  // const handleAddComponent = () => {
  //   const newComponent = {
  //     type: 'Button',
  //     id: Date.now(),
  //     position: { x: 0, y: 0 },
  //   };
  //   setComponents([...components, newComponent]);
  // };

  const onLabelChange = (id, newLabel) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            return { ...comp, label: newLabel };
        }
        return comp;
    }));
  };

  const onSaveValue = (id, newValue) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            return { ...comp, value: newValue };
        }
        return comp;
    }));
  };



  const handleAddComponent = (type) => {
    const baseComponent = {
        id: uuidv4(),
        position: { x: 0, y: 0 },
        type: type,
        label: type === 'Text' ? 'New Text' : type,
    };

    switch (type) {
        case 'Button':
            setComponents([...components, {...baseComponent}]);
            break;
        case 'Radio':
            setComponents([...components, {...baseComponent, selected: false}]); // Example additional property
            break;
        case 'Checkbox':
            setComponents([...components, {...baseComponent, checked: false}]);
            break;
        case 'Text':
            setComponents([...components, {...baseComponent, text: 'New Text'}]);
            break;
        case 'TextInput':
            setComponents([...components, {...baseComponent, value: ''}]);
            break;
        default:
            console.log('Unknown type');
      }
    };


  const onButtonPress = async (component) => {
    console.log(`Button with ID ${component.id} pressed`);
    console.log(`Component type: ${component.type}`);
    console.log(`Component value: ${component.value}`);
    switch (component.type) {
      case 'Button':
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

        const nextPageId = buttonConfigs[component.id]; // Assuming buttonConfigs stores page IDs now

        if (nextPageId) {
            // Use the `router.navigate` or `router.push` method to navigate to the selected page
            router.push({ pathname: `/flow/${flowId}/page/${nextPageId}` });
        } else {
            console.log(`Button ${component.id} pressed without a specific page configured.`);
        }
        break;
      case 'Radio':
        
        break;
      case 'Checkbox':
        setComponents(prevComponents => {
            return prevComponents.map(prevComponent => {
                if (prevComponent.id === component.id) {
                    return { ...prevComponent, checked: !prevComponent.checked };
                } else {
                    return prevComponent;
                }
            });
        });
        break;
      case 'Text':
        break;
      case 'TextInput':
        break;
      default:
          return null;
    }

    
  };

  const onButtonLongPress = (component) => {
    switch (component.type) {
        case 'Button':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setConfigOverlayVisible(true);
          break;
        case 'Radio':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setRadioConfigOverlayVisible(true);
          break;
        case 'Checkbox':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setCheckboxConfigOverlayVisible(true);
          break;
        case 'Text':
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setTextConfigOverlayVisible(true);
          break;
        case 'TextInput': // open config for this component type
          setCurrentButtonId(component.id);
          setCurrentComponent(component);
          console.log(component.type, 'long press detected');
          setTextInputConfigOverlayVisible(true);
          break;
        default:
            return null;
    }
    // setCurrentButtonId(buttonId);
    // setConfigOverlayVisible(true);
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
          componentsPageModalVisible={componentsPageModalVisible}
          setComponentsPageModalVisible={setComponentsPageModalVisible}
          handleAddComponent={handleAddComponent}
          pickImage={pickImage}
          clearScreen={clearScreen}
          // setSavePageModalVisible={setSavePageModalVisible}
          // savedPages={savedPages}
          // loadPage={loadPage} // maybe should only be in flowOverview
          // deletePage={deletePage} // maybe should only be in flowOverview
          // pageName={pageName}
          // setPageName={setPageName}
          savePage={savePage}
          // savePageModalVisible={savePageModalVisible}
          flowId={flowId}
          changeViewMode={setViewMode}
          isViewModeOn={viewMode}
      />
      <ButtonConfigOverlayModal
          visible={configOverlayVisible}
          onClose={() => setConfigOverlayVisible(false)}
          savedPages={savedPages}
          currentButtonId={currentButtonId}
          buttonConfigs={buttonConfigs}
          setButtonConfigs={setButtonConfigs}
          ButtonConfigurationComponent={<ButtonConfiguration />}
          component={currentComponent}
          onLabelChange={onLabelChange}
      />
      <RadioConfigOverlayModal
        visible={radioConfigOverlayVisible}
        onClose={() => setRadioConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
        onSaveValue={onSaveValue}
      />
      <CheckboxConfigOverlayModal
        visible={checkboxConfigOverlayVisible}
        onClose={() => setCheckboxConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
      />
      <TextConfigOverlayModal
        visible={textConfigOverlayVisible}
        onClose={() => setTextConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
      />
      <TextInputConfigOverlayModal
        visible={textInputConfigOverlayVisible}
        onClose={() => setTextInputConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
      />
        {/* {components.map((component) => (
          <ButtonComponent
            key={component.id}
            id={component.id}
            onPress={onButtonPress}
            onLongPress={onButtonLongPress}
            initialPosition={component.position}
            onPositionChange={handlePositionChange}
          />
        ))} */}
        <RadioGroup initialValue={null}>
        {components.map((component) => (
          <DynamicComponent
              key={component.id}
              component={component}
              onPress={onButtonPress}
              onLongPress={onButtonLongPress}
              onPositionChange={handlePositionChange}
              onLabelChange={onLabelChange}
              viewModeIsOn={viewMode}
          />
        ))}
        </RadioGroup>

        {/* <RadioGroup initialValue={null} onValueChange={null}>
        <RadioButton value={"test1"} label={"test1"}/>
        <RadioButton value={"test2"} label={"test2"}/>
        </RadioGroup> */}

      </ImageBackground>
    </GestureHandlerRootView>
  );
}

