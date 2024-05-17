import React, { useState, useMemo } from 'react';
import { View, ImageBackground } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';

// import styles
import styles from '../../../styles/stylesIndex.js';


// import components
import useLoadPageData from '../../../components/useLoadPageData/useLoadPageData.js';
import DynamicComponent from '../../../components/DynamicComponent/DynamicComponent.js';


// import utility functions
import { savePageHelper, toastConfig } from '../../../components/Page/savePage.js';
import { ButtonConfiguration } from '../../../components/Page/ButtonConfiguration.js';
import { createPositionHandler } from '../../../components/Page/handlePositionChange.js';
import { clearScreenHandler } from '../../../components/Page/clearScreen.js';
import { pickImageHandler } from '../../../components/Page/pickImage.js';
import { playHapticSequenceHelper } from '../../../components/Page/playHapticSequence.js';
import { onLabelChangeHelper } from '../../../components/Page/onLabelChange.js';
import { onSaveValueHandler } from '../../../components/Page/onSaveValue.js';
import { updateComponentHelper } from '../../../components/Page/updateComponent.js';
import { handleSelectVariableHandler } from '../../../components/Page/handleSelectVariable.js';
import { handleAddComponentHandler } from '../../../components/Page/handleAddComponent.js';
import { onButtonPressHandler } from '../../../components/Page/onButtonPress.js';
import { onButtonLongPressHandler } from '../../../components/Page/onButtonLongPress.js';
import { onButtonPressStartHandler } from '../../../components/Page/onButtonPressStart.js';

// import modals
import MainMenuModal from '../../../modals/MainMenuModal.js';
import ButtonConfigOverlayModal from '../../../modals/ButtonConfigOverlayModal.js';
import RadioConfigOverlayModal from '../../../modals/RadioConfigOverlayModal.js';
import CheckboxConfigOverlayModal from '../../../modals/CheckboxConfigOverlayModal.js';
import TextConfigOverlayModal from '../../../modals/TextConfigOverlayModal.js';
import TextInputConfigOverlayModal from '../../../modals/TextInputConfigOverlayModal.js';
import { RadioGroup } from 'react-native-ui-lib';
import SwipeToOpenModal from '../../../modals/SwipeToOpenModal.js';



export default function App() {
  // Here we get the flowId and pageId from the URL parameters, this is because we have dynamic routing.
  const { flowId, pageId: pageIdArray } = useLocalSearchParams();  // Extracting pageId from the URL parameters
  const pageId = Array.isArray(pageIdArray) ? pageIdArray[0] : pageIdArray;

  // Here we create and store our states for our page.
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

  /* This is used in the main menu, to handle the saving of the page data, and storing using AsyncStorage. */
  const savePage = async () => {
    savePageHelper(pageId, components, backgroundImage, buttonConfigs, hapticNodes);
  };
  
  // Use the custom hook to load page data and handle permissions
  useLoadPageData(pageId, setComponents, setBackgroundImage, setSavedPages, flowId, setButtonConfigs, setHapticNodes, setVariables, savePage);

  /* This is used for every component, to handle the current and updated positions and store them in the Local AsyncStorage database */
  const handlePositionChange = useMemo(() => createPositionHandler(setComponents), [setComponents]);
  
  /* This is used in the main menu to clear the screen of any component and reset the background image. */
  const clearScreen = () => {
    clearScreenHandler(setComponents, setBackgroundImage);
  };

  /* This is used in the main menu to select a background image from the image library of the device. */
  const pickImage = async () => {
    pickImageHandler(setBackgroundImage, setModalVisible);
  }

  /* This is used in the ButtonComponent, Radio and Checkbox, to play haptic feedback from the nodes selected. */
  const playHapticSequence = async (hapticSequence) => {
    playHapticSequenceHelper(hapticSequence);
  };

  /* This is used in every component that has the functionality of changing its label (displayed name) */
  const onLabelChange = (id, newLabel) => {
    onLabelChangeHelper(id, newLabel, setComponents);
  };

  /* This is used in the RadioComponent Modal, to update the values of variables stored in the flow */
  const onSaveValue = async (variableId, newValue) => {
    onSaveValueHandler(variableId, newValue, setVariables, flowId);
  };
  
  /* This is used in the ButtonComponent Modal, to update the height/width and visibility of the component */
  const updateComponent = (id, updates) => {
    updateComponentHelper(id, updates, setComponents);
  };

  /* This is used in the RadioGroup, to handle onChange to update the value of the selected variable */
  const handleSelectVariable = async (variableId) => {
    handleSelectVariableHandler(variableId, variables, setVariables, selectedId, setSelectedId, flowId);
  };

  /* This is used in the main menu to handle the addition of any component to the page. */
  const handleAddComponent = (type) => {
    handleAddComponentHandler(type, setComponents, components);
  };

  /* This is used by any component, and handles the logic for each component type when a button is pressed. */
  const onButtonPress = async (component) => {
    onButtonPressHandler(component, hapticNodes, playHapticSequence, router, flowId, buttonConfigs, setComponents);
  };

  const onButtonPressStart = async (component) => {
    await onButtonPressStartHandler(component, playHapticSequence);
  };

  /* This is used by any component, and handles the opening of modals for the component after a long press */
  const onButtonLongPress = (component) => {
    onButtonLongPressHandler(component, 
      setCurrentButtonId, 
      setCurrentComponent, 
      setConfigOverlayVisible, 
      setRadioConfigOverlayVisible, 
      setCheckboxConfigOverlayVisible, 
      setTextConfigOverlayVisible, 
      setTextInputConfigOverlayVisible
    );
  };

  
  return (
    // The GestureHandlerRootView, is the root because it needs to handle all types of gestures, 
    // and any component or modal within this root may have the ability of using gestures
    <GestureHandlerRootView style={{ flex: 1}}>
      {/* 
          Here we set the Background Image 
      */}
      <ImageBackground source={backgroundImage} resizeMode="cover" style={{...styles.backgroundImage, top: -60,}}>
      <View style={{
        width: '100%',
        height: '100%',
      }}>
        {/* 
            Here we handle the swipe to open the main menu modal, from the right of the screen.
        */}
        <SwipeToOpenModal onOpen={() => setModalVisible(true)} />
      </View>
      {/* 
            Here is the Main menu modal
      */}
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
      {/* 
            Here is the Button Config modal
      */}
      <ButtonConfigOverlayModal
          visible={configOverlayVisible}
          onClose={() => setConfigOverlayVisible(false)}
          savedPages={savedPages}
          currentButtonId={currentButtonId}
          buttonConfigs={buttonConfigs}
          setButtonConfigs={setButtonConfigs}
          ButtonConfigurationComponent={<ButtonConfiguration 
            currentButtonId={currentButtonId}
            hapticNodes={hapticNodes}
            setHapticNodes={setHapticNodes}
          />}
          component={currentComponent}
          onLabelChange={onLabelChange}
          setHapticNodes={setHapticNodes}
          hapticNodes={hapticNodes}
          onComponentUpdate={updateComponent}
      />
      {/* 
            Here is the Radio Config modal
      */}
      <RadioConfigOverlayModal
        visible={radioConfigOverlayVisible}
        onClose={() => setRadioConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
        onSaveValue={onSaveValue}
        variables={variables}
        ButtonConfigurationComponent={<ButtonConfiguration 
          currentButtonId={currentButtonId}
          hapticNodes={hapticNodes}
          setHapticNodes={setHapticNodes}
        />}
        setHapticNodes={setHapticNodes}
        hapticNodes={hapticNodes}
        currentButtonId={currentButtonId}
      />
      {/* 
            Here is the Checkbox Config modal
      */}
      <CheckboxConfigOverlayModal
        visible={checkboxConfigOverlayVisible}
        onClose={() => setCheckboxConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
        ButtonConfigurationComponent={<ButtonConfiguration 
          currentButtonId={currentButtonId}
          hapticNodes={hapticNodes}
          setHapticNodes={setHapticNodes}
        />}
        setHapticNodes={setHapticNodes}
        hapticNodes={hapticNodes}
        currentButtonId={currentButtonId}
      />
      {/* 
            Here is the Text Config modal
      */}
      <TextConfigOverlayModal
        visible={textConfigOverlayVisible}
        onClose={() => setTextConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
      />
      {/* 
            Here is the TextInput Config modal
      */}
      <TextInputConfigOverlayModal
        visible={textInputConfigOverlayVisible}
        onClose={() => setTextInputConfigOverlayVisible(false)}
        component={currentComponent}
        onLabelChange={onLabelChange}
      />
      {/* 
            We have a RadioGroup encompassing all components, because we cant 
            create a new Radio Group for a specific selection of radio components
            and still have it function without external supervision
      */}
        <RadioGroup onValueChange={handleSelectVariable} initialValue={selectedId} 
        style={{
          width: '100%', 
          }}>
          {/* 
            Here we render all of our components
          */}
        {components.map((component) => (
          <DynamicComponent
              key={component.id}
              component={component}
              onPress={onButtonPress}
              onLongPress={onButtonLongPress}
              onPositionChange={handlePositionChange}
              onLabelChange={onLabelChange}
              viewModeIsOn={viewMode}
              onPressStart={onButtonPressStart}
          />
        ))}
        </RadioGroup>
      </ImageBackground>
      {/* 
            A Toast is a notification, it has to be the last element of the root.
      */}
      <Toast config={toastConfig}/>
    </GestureHandlerRootView>
  );
}

