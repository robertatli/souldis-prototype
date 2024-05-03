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
import { RadioGroup } from 'react-native-ui-lib';
import SwipeToOpenModal from '../../../modals/SwipeToOpenModal.js';



export default function App() {
  const { flowId, pageId: pageIdArray } = useLocalSearchParams();  // Extracting pageId from the URL parameters
  const pageId = Array.isArray(pageIdArray) ? pageIdArray[0] : pageIdArray;

  const [components, setComponents] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [componentsPageModalVisible, setComponentsPageModalVisible] = useState(false);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [savedPages, setSavedPages] = useState([]);
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [configOverlayVisible, setConfigOverlayVisible] = useState(false);
  const [radioConfigOverlayVisible, setRadioConfigOverlayVisible] = useState(false);
  const [checkboxConfigOverlayVisible, setCheckboxConfigOverlayVisible] = useState(false);
  const [textConfigOverlayVisible, setTextConfigOverlayVisible] = useState(false);
  const [textInputConfigOverlayVisible, setTextInputConfigOverlayVisible] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [hapticNodes, setHapticNodes] = useState({});
  const [viewMode, setViewMode] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [variables, setVariables] = useState([]);

   // Use the custom hook to load page data and handle permissions
   useLoadPageData(pageId, setComponents, setBackgroundImage, setSavedPages, flowId, setButtonConfigs, setHapticNodes, setVariables);

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
          selectedHaptic={item.selectedHaptic}
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
        const updatedNodes = nodes.map((node) => 
          node.key === key ? { ...node, value: newValue, selectedHaptic: newValue } : node
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
        selectedHaptic: 'selectionAsync',
      };
      const currentNodes = hapticNodes[currentButtonId] || [];
      const updatedNodes = [...currentNodes, newNode];
      setHapticNodes({ ...hapticNodes, [currentButtonId]: updatedNodes });
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.modalButton} onPress={addHapticNode}>
            <Text>Add Haptic Node</Text>
        </TouchableOpacity>
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
  
  
  const savePage = async () => {
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
      // Update the existing page data
      // pages[pageIndex] = {
      //   ...pages[pageIndex], // Preserve existing data
      //   components: components, // Update components
      //   backgroundImageUri: backgroundImage ? backgroundImage : null // Update background image
      // };
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

  
  const clearScreen = () => {
    console.log('Clearing screen...');
    setComponents([]); // Clear all components
    setBackgroundImage(require('../../../../assets/default-resized.png')); // Remove background image
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


  const onLabelChange = (id, newLabel) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            return { ...comp, label: newLabel };
        }
        return comp;
    }));
  };

  const onSaveValue = async (variableId, newValue) => {
    const storedFlows = await AsyncStorage.getItem('@flows');
    let flows = storedFlows ? JSON.parse(storedFlows) : [];
    let flowIndex = flows.findIndex(f => f.id === flowId);
    
    if (flowIndex !== -1) {
      let flow = flows[flowIndex];
      let variableIndex = flow.variables.findIndex(v => v.id === variableId);
      
      if (variableIndex !== -1) {
        // Update the variable value
        flow.variables[variableIndex].value = newValue;
  
        // Update the flow in the array
        flows[flowIndex] = flow;
        
        // Save the updated flows array back to AsyncStorage
        await AsyncStorage.setItem('@flows', JSON.stringify(flows));
        
        // Optionally update the local state if you're also tracking changes there
        setVariables(flow.variables);
      }
    }
  };
  

  const updateComponent = (id, updates) => {
    setComponents(prevComponents => prevComponents.map(comp => {
        if (comp.id === id) {
            return { ...comp, ...updates };
        }
        return comp;
    }));
  };


  const handleSelectVariable = async (variableId) => {
      // Map through variables to update their values based on selection
      const updatedVariables = variables.map(variable => {
          if (variable.id === variableId) {
              variable.value = selectedId === variableId ? 0 : 1; // Toggle value
          }
          return variable;
      });
      setVariables(updatedVariables);
      setSelectedId(selectedId === variableId ? null : variableId);
      // Save updated variables back to AsyncStorage
      await saveFlowVariables(flowId, updatedVariables);
  };

  const saveFlowVariables = async (flowId, updatedVariables) => {
    const storedFlows = await AsyncStorage.getItem('@flows');
    let flowsArray = JSON.parse(storedFlows);
    let flowIndex = flowsArray.findIndex(f => f.id === flowId);
    if (flowIndex !== -1) {
        flowsArray[flowIndex].variables = updatedVariables;
        await AsyncStorage.setItem('@flows', JSON.stringify(flowsArray));
    }
    console.log("flow Variables: ", flowsArray[flowIndex].variables);
};

  const handleAddComponent = (type) => {
    const baseComponent = {
        id: uuidv4(),
        position: { x: 0, y: -400 },
        type: type,
        label: type === 'Text' ? 'New Text' : type,
    };

    switch (type) {
        case 'Button':
            setComponents([...components, {...baseComponent, nextPageId: null, hapticNodes: [], height: 40, width: '90%'}]);
            break;
        case 'Radio':
            setComponents([...components, {...baseComponent, selected: false, label: '', hapticNodes: []}]); // Example additional property
            break;
        case 'Checkbox':
            setComponents([...components, {...baseComponent, checked: false, label: '', hapticNodes: []}]);
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


  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const onButtonPress = async (component) => {
    const hapticSequence = hapticNodes[component.id] || [];

    switch (component.type) {
      case 'Button':
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
            case 'delayAsync100':
              console.log('Delay 100ms');
              await delay(100);
              break;
            case 'delayAsync300':
              console.log('Delay 300ms');
              await delay(300);
              break;
            case 'delayAsync500':
              console.log('Delay 500ms');
              await delay(500);
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
            case 'delayAsync100':
              console.log('Delay 100ms');
              await delay(100);
              break;
            case 'delayAsync300':
              console.log('Delay 300ms');
              await delay(300);
              break;
            case 'delayAsync500':
              console.log('Delay 500ms');
              await delay(500);
              break;
          }
        }
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
            case 'delayAsync100':
              console.log('Delay 100ms');
              await delay(100);
              break;
            case 'delayAsync300':
              console.log('Delay 300ms');
              await delay(300);
              break;
            case 'delayAsync500':
              console.log('Delay 500ms');
              await delay(500);
              break;
          }
        }

        
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
  };

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <ImageBackground source={backgroundImage} resizeMode="cover" style={{...styles.backgroundImage, top: -60,}}>
      <View style={{
        width: '100%',
        height: '100%',
      }}>
        <SwipeToOpenModal onOpen={() => setModalVisible(true)} />
      </View>
      <MainMenuModal 
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          componentsPageModalVisible={componentsPageModalVisible}
          setComponentsPageModalVisible={setComponentsPageModalVisible}
          handleAddComponent={handleAddComponent}
          pickImage={pickImage}
          clearScreen={clearScreen}
          savePage={savePage}
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
          setHapticNodes={setHapticNodes}
          hapticNodes={hapticNodes}
          onComponentUpdate={updateComponent}
      />
      <RadioConfigOverlayModal
        visible={radioConfigOverlayVisible}
        onClose={() => setRadioConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
        onSaveValue={onSaveValue}
        variables={variables}
        ButtonConfigurationComponent={<ButtonConfiguration />}
        setHapticNodes={setHapticNodes}
        hapticNodes={hapticNodes}
        currentButtonId={currentButtonId}
      />
      <CheckboxConfigOverlayModal
        visible={checkboxConfigOverlayVisible}
        onClose={() => setCheckboxConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
        ButtonConfigurationComponent={<ButtonConfiguration />}
        setHapticNodes={setHapticNodes}
        hapticNodes={hapticNodes}
        currentButtonId={currentButtonId}
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
        <RadioGroup onValueChange={handleSelectVariable} initialValue={selectedId}>
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
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

