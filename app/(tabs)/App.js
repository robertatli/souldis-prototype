import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Button, ImageBackground, Dimensions, Platform, Text, Modal, FlatList, TouchableOpacity, TextInput, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Feather';
import { Link } from 'expo-router';


const { width, height } = Dimensions.get('window');

export default function App() {
  const [components, setComponents] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [savedSetups, setSavedSetups] = useState([]);
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [configOverlayVisible, setConfigOverlayVisible] = useState(false);
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [hapticNodes, setHapticNodes] = useState({});


  const Dropdown = ({ savedSetups, currentButtonId, buttonConfigs, onConfigChange }) => {
    // Convert saved setups to items for the picker
    const items = savedSetups.map((setup) => ({
        label: setup.name,
        value: setup.name,
    }));

    // Custom style for the picker
    const customPickerStyles = {
      inputIOS: {
          fontSize: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          textAlign: 'center',
          marginTop: 8,
      },
      inputAndroid: {
          fontSize: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          color: 'black',
          textAlign: 'center',
      },
      placeholder: {
          color: 'gray',
          fontSize: 16,
          textAlign: 'center',
      },
    };

    // Handle value change
    const handleValueChange = (value) => {
        onConfigChange(currentButtonId, value);
    };

    return (
        <RNPickerSelect
            onValueChange={handleValueChange}
            items={items}
            value={buttonConfigs[currentButtonId]}
            placeholder={{ label: "Select a setup...", value: null }}
            style={customPickerStyles}
            useNativeAndroidPickerStyle={false}
        />
    );
  };

  const HapticDropdown = ({ onHapticChange }) => {
    // Options for the haptic feedback types
    const hapticOptions = [
        { label: 'Selection', value: 'selectionAsync' },
        { label: 'Success Notification', value: 'notificationAsyncSuccess' },
        { label: 'Error Notification', value: 'notificationAsyncError' },
        { label: 'Warning Notification', value: 'notificationAsyncWarning' },
        { label: 'Light Impact', value: 'impactAsyncLight' },
        { label: 'Medium Impact', value: 'impactAsyncMedium' },
        { label: 'Heavy Impact', value: 'impactAsyncHeavy' },
    ];

    // Custom style for the picker
    const customPickerStyles = {
      inputIOS: {
          fontSize: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          textAlign: 'center',
          paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'purple',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
      },
      placeholder: {
          color: 'gray',
          fontSize: 16,
      },
      iconContainer: {
          top: 10,
          right: 15,
      },
  };

    return (
      <RNPickerSelect
          onValueChange={onHapticChange}
          items={hapticOptions}
          placeholder={{ label: "Select a haptic...", value: null }}
          style={customPickerStyles}
          useNativeAndroidPickerStyle={false} // this is to ensure consistent styling across platforms
          Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
      />
    );
  };


  const ButtonComponent = ({ id, onPress, onLongPress }) => {
    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);
  
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        positionX.value = event.translationX;
        positionY.value = event.translationY;
      });
  
      const singleTap = Gesture.Tap()
      .maxDuration(250)
      .onStart(() => {
        console.log('Single tap!');
      });
  
    const doubleTap = Gesture.Tap()
      .maxDuration(250)
      .numberOfTaps(2)
      .onStart(() => {
        console.log('Double tap!');
      });

    const LongPress = Gesture.LongPress()
      .runOnJS(true)
      .onEnd(() => {
        onLongPress(id);
      });
  
    const gesture = Gesture.Exclusive(panGesture, LongPress, doubleTap, singleTap);
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: positionX.value }, { translateY: positionY.value }],
      };
    });
  
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <Button title={`Button ${id}`} onPress={() => onPress(id)} />
        </Animated.View>
      </GestureDetector>
    );
  };

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
    setBackgroundImage(require('../../assets/splash.png')); // Remove background image
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

  // const handleActionChange = async (action) => {
  //   setSelectedAction(action); // This line might need to be adjusted based on your logic.
  //   switch (action) {
  //       case 'addButton':
  //           handleAddComponent();
  //           break;
  //       case 'setBackground':
  //           let result = await ImagePicker.launchImageLibraryAsync({
  //               mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //               quality: 1,
  //           });
  //           if (!result.cancelled) {
  //               setBackgroundImage({ uri: result.assets[0].uri }); // Adjusted to access the uri correctly
  //           }
  //           break;
  //       case 'saveSetup':
  //           await saveSetup(); // Save the current setup
  //           break;
  //       case 'loadSetup':
  //           await loadSetup(); // Load the saved setup
  //           break;
  //       default:
  //           console.log('Action not recognized:', action);
  //   }
  // };


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

  // const onGestureEvent = (event, id) => {
  //   if (event.nativeEvent.state === State.ACTIVE) {
  //     const updatedComponents = components.map(component => {
  //       if (component.id === id) {
  //         return {
  //           ...component,
  //           position: {
  //             x: event.nativeEvent.translationX,
  //             y: event.nativeEvent.translationY,
  //           },
  //         };
  //       }
  //       return component;
  //     });
  //     setComponents(updatedComponents);
  //   }
  // };

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
              <Button title="Add Button" onPress={handleAddComponent} />
              <Button title="Set Background" onPress={() => pickImage()} />
              <TextInput
                placeholder="Setup Name"
                value={setupName}
                onChangeText={setSetupName}
                style={styles.textInput}
              />
              <Button title="Save Current Setup" onPress={saveSetup} />
              <Button title="Clear Screen" onPress={clearScreen} />
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
              <Link href="/QuestionnairePage">
              Questionaire
              </Link>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 40, // Adjust top as needed
    right: 10, // Adjust right as needed
    backgroundColor: 'red',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10, // Add padding to increase the touchable area
  },
  picker: {
    width: 200,
  },
  buttonContainer: {
    margin: 10,
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    height: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  setupItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  deleteButton: {
    // Ensure this button is outside and to the right of the setup item container
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
  },
  setupItemText: {
    fontSize: 16,
    marginRight: 8,
  },    
  container: {
    flex: 1,
    padding: 10,
  },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
});
