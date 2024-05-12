import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-virtualized-view';

import { StyleSheet } from 'react-native';

import HapticDropdown from '../components/HapticDropdown/HapticDropdown';
import LabeledInput from './LabeledInput';
import CheckBoxInput from './CheckboxInput';
import { runOnJS } from 'react-native-reanimated';
import { Checkbox } from 'react-native-ui-lib';

const handleDimensionChange = (value) => {
    // Ensure the value is a string
    let strValue = String(value);
    if (strValue.match(/^\d+%$/)) { // Ends with a percentage
        return strValue;
    } else if (strValue.match(/^\d+$/)) { // Only digits
        return parseInt(strValue, 10); // Convert to integer
    }
    return strValue; // Return as is (could add more validation or defaulting logic here)
};


const ButtonConfigOverlayModal = ({
    visible,
    onClose,
    savedPages,
    currentButtonId,
    buttonConfigs,
    setButtonConfigs,
    ButtonConfigurationComponent,
    component,
    onLabelChange,
    setHapticNodes,
    hapticNodes,
    onComponentUpdate,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [nextPageId, setNextPageId] = useState(buttonConfigs[currentButtonId] || ''); // Assuming buttonConfigs stores nextPageId
    const [hapticSequence, setHapticSequence] = useState(hapticNodes[currentButtonId] || []);
    const [width, setWidth] = useState(component?.width || '20%');
    const [height, setHeight] = useState(component?.height || 40);
    const [checked, setChecked] = useState(component?.visible || true);
    const [selectedHaptic, setSelectedHaptic] = useState('');
    const [hapticValue, setHapticValue] = useState('');


    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setNextPageId(buttonConfigs[component.id] || '');
            setHapticSequence(hapticNodes[component.id] || []);
            setWidth(component.width || '100%');
            setHeight(component.height || 40);
            setSelectedHaptic(component.startHaptic.selectedHaptic || '');
            setHapticValue(component.startHaptic.hapticValue || '');
        }
    }, [component, buttonConfigs, hapticNodes]);

    const handleSave = () => {
        if (component) {
            const formattedWidth = handleDimensionChange(width);
            const formattedHeight = handleDimensionChange(height);
            runOnJS(onLabelChange)(component.id, label);
            setButtonConfigs({ ...buttonConfigs, [component.id]: nextPageId });
            setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
            onComponentUpdate(component.id, {
                ...component, 
                width: formattedWidth, 
                height: formattedHeight, 
                visible: checked,
                startHaptic: { selectedHaptic, hapticValue },
            });
        }
        onClose();
    };

    const checkValueChanged = () => {
        const newVisibility = !checked;
        console.log(`Old visibility: ${component.visible}, new: ${newVisibility}`);
        setChecked(newVisibility);
        onComponentUpdate(component.id, { ...component, visible: newVisibility });  
    };

    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Spacer height={32} />
                    <Text style={styles.modalTitleSection}>Button Configuration</Text>
                    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Button Name</Text>
                        <Text style={styles.sectionDescription}>Set the button's name as it will appear on the screen.</Text>
                        <LabeledInput
                            label="Name"
                            value={label}
                            onChangeText={setLabel}
                            placeholder="Enter name"
                        />
                    </View>
                    <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Size</Text>
                        <Text style={styles.sectionDescription}>Adjust the button's size by setting its width and height.</Text>
                        <LabeledInput
                            label="Width"
                            value={width.toString()}
                            onChangeText={text => setWidth(text)}
                            placeholder="Width (e.g., 50%)"
                        />
                        <LabeledInput
                            label="Height"
                            value={height.toString()}
                            onChangeText={text => setHeight(text)}
                            placeholder="Height (e.g., 20px)"
                        />
                    </View>
                    <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Link</Text>
                        <Text style={styles.sectionDescription}>Choose which page the button will link to when pressed.</Text>
                        <Dropdown
                            savedPages={savedPages}
                            currentButtonId={currentButtonId}
                            buttonConfigs={buttonConfigs}
                            onConfigChange={(id, selectedSetup) => {
                                setNextPageId(selectedSetup);
                                setButtonConfigs({ ...buttonConfigs, [id]: selectedSetup });
                            }}
                        />
                    </View>
                    <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Visibility</Text>
                        <Text style={styles.sectionDescription}>Toggle whether this button is visible when the app is in view mode.</Text>
                        <CheckBoxInput 
                            label="Show in view mode"
                            checked={checked}
                            checkValueChanged={checkValueChanged}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Initial Touch Feedback</Text>
                        <Text style={styles.sectionDescription}>Choose the type of feedback when the button is first touched.</Text>
                        <HapticDropdown
                            selectedHaptic={selectedHaptic}
                            onHapticChange={setSelectedHaptic}
                            style={pickerSelectStyles}
                            selectedValue={hapticValue}
                        />
                    </View>
                    <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Touch Feedback Sequence</Text>
                        <Text style={styles.sectionDescription}>Set up a sequence of feedbacks for interactions with the button.</Text>
                        {ButtonConfigurationComponent}
                    </View>

                        <FlexSpacer />
                    </ScrollView>
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '100%', // Ensure full width or a fixed width as needed
        height: 40, // Standardize height
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
  });

export default ButtonConfigOverlayModal;
