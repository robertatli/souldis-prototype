import React, { useState, useEffect } from 'react';
import { View, Button, ImageBackground, Platform, Text, Modal, FlatList, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, Link } from 'expo-router';


// import styles
import styles from '../../styles/stylesIndex.js';


// import components
import Dropdown from '../../components/Dropdown/Dropdown.js';
import HapticDropdown from '../../components/HapticDropdown/HapticDropdown.js';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.js';


export default function App() {
  const [components, setComponents] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saveSetupModalVisible, setSaveSetupModalVisible] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [savedSetups, setSavedSetups] = useState([]);
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [configOverlayVisible, setConfigOverlayVisible] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [hapticNodes, setHapticNodes] = useState({});


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
  
  

  useEffect(() => {
    loadSavedSetups();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const saveSetup = async () => {
    const newSetup = {
      name: setupName || `Setup ${new Date().toISOString()}`,
      components,
      backgroundImageUri: backgroundImage ? backgroundImage.uri : '',
    };
    // Attempt to load existing setups, or initialize an empty array if none are found
    const existingSetupsJson = await AsyncStorage.getItem('@setups');
    const existingSetups = existingSetupsJson ? JSON.parse(existingSetupsJson) : [];
    const updatedSetups = [...existingSetups, newSetup];
    try {
      await AsyncStorage.setItem('@setups', JSON.stringify(updatedSetups));
      setSavedSetups(updatedSetups); // Update the local state to reflect the new list of setups
      setModalVisible(false); // Optionally close the modal
      alert('Setup saved successfully!');
    } catch (e) {
      console.log(e);
      alert('Failed to save setup.');
    }
  };  

  // Function to load the list of saved setups from AsyncStorage
  const loadSavedSetups = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@setups');
      if (jsonValue != null) {
        setSavedSetups(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log(e);
      alert('Failed to load saved setups.');
    }
  };

  // This function remains mostly unchanged but will be called when a user selects a setup to load
  const loadSetup = (setup) => {
    setComponents(setup.components);
    setBackgroundImage(setup.backgroundImageUri ? { uri: setup.backgroundImageUri } : null);
    setModalVisible(false); // Close the modal after loading a setup
  };

  const deleteSetup = async (name) => {
    const filteredSetups = savedSetups.filter(setup => setup.name !== name);
    setSavedSetups(filteredSetups); // Update the local state
    try {
      await AsyncStorage.setItem('@setups', JSON.stringify(filteredSetups)); // Update AsyncStorage
      alert('Setup deleted successfully!');
    } catch (e) {
      console.log(e);
      alert('Failed to delete setup.');
    }
  };
  
  const clearScreen = () => {
    console.log('Clearing screen...');
    setComponents([]); // Clear all components
    setBackgroundImage(require('../../../assets/splash.png')); // Remove background image
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

    const setupName = buttonConfigs[id];
    if (setupName) {
      const setup = savedSetups.find(s => s.name === setupName);
      if (setup) {
        loadSetup(setup);
      }
    } else {
      console.log(`Button ${id} pressed without a specific setup configured.`);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
        
            <Link href="/components/ComponentsPage/ComponentsPage" asChild>
              <TouchableOpacity style={styles.modalButton}>
                <Text>Add Component</Text>
              </TouchableOpacity>
            </Link>
            
            <TouchableOpacity style={styles.modalButton} onPress={() => pickImage()}>
              <Text>Set Background</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
              <Text>Clear The Screen</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => setSaveSetupModalVisible(true)}>
              <Text>Save Current Setup</Text>
            </TouchableOpacity>
          
              <FlatList
                data={savedSetups}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <View style={styles.setupItemRow}>
                    <TouchableOpacity 
                      onPress={() => loadSetup(item)}>
                      <Text style={styles.setupItemText} numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton} 
                      onPress={() => deleteSetup(item.name)}>
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={saveSetupModalVisible}
            onRequestClose={() => {
              setSaveSetupModalVisible(!saveSetupModalVisible);
            }}>
            <View style={styles.centeredModalView}>
              <View style={styles.saveModalView}>
                <Text style={styles.modalTitle}>Give your Design a name</Text>
                <TextInput
                  placeholder="Enter Setup Name"
                  value={setupName}
                  onChangeText={setSetupName}
                  style={styles.modalTextInput}
                />
                <TouchableOpacity style={styles.modalSaveButton} onPress={saveSetup}>
                  <Text style={styles.modalButtonText}>Save Design</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => setSaveSetupModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
        <Modal
          visible={configOverlayVisible}
          onRequestClose={() => setConfigOverlayVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Button Configuration</Text>
              <Dropdown
                savedSetups={savedSetups}
                currentButtonId={currentButtonId}
                buttonConfigs={buttonConfigs}
                onConfigChange={(id, selectedSetup) => {
                  setButtonConfigs({ ...buttonConfigs, [id]: selectedSetup });
                }}
              />
              <ButtonConfiguration/>
              <Button title="Save" onPress={() => setConfigOverlayVisible(false)} />
            </View>
          </View>
        </Modal>
        {components.map((component) => (
          <ButtonComponent
            key={component.id}
            id={component.id}
            onPress={onButtonPress}
            onLongPress={onButtonLongPress}
          />
        ))}
      </ImageBackground>
    </GestureHandlerRootView>
  );
}