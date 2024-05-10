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
                        <Text style={styles.sectionHeader}>Name</Text>
                        <Text style={styles.sectionDescription}>Choose the displayed name of the button</Text>
                        <LabeledInput
                            label="Label"
                            value={label}
                            onChangeText={setLabel}
                            placeholder="Enter Text"
                        />
                        </View>
                        <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Dimensions</Text>
                        <Text style={styles.sectionDescription}>Choose the width / height of the button dimensions.</Text>
                        <LabeledInput
                            label="Width"
                            value={width.toString()}
                            onChangeText={text => setWidth(text)}
                            placeholder="Enter width"
                        />
                        <LabeledInput
                            label="Height"
                            value={height.toString()}
                            onChangeText={text => setHeight(text)}
                            placeholder="Enter height"
                        />
                        </View>
                        <View style={{...styles.section}}>
                        <Text style={styles.sectionHeader}>Navigation</Text>
                        <Text style={styles.sectionDescription}>Choose what page to navigate to on click.</Text>
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
                        <Text style={styles.sectionHeader}>Button Visibility</Text>
                        <Text style={styles.sectionDescription}>Choose to have the button visible in the View mode.</Text>
                        <CheckBoxInput 
                            label={"Visible in View mode"}
                            checked={checked}
                            checkValueChanged={checkValueChanged}
                        />
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>On Start Haptic Feedback</Text>
                            <Text style={styles.sectionDescription}>Select the haptic feedback to play when the button is initially pressed.</Text>
                            <HapticDropdown
                                selectedHaptic={selectedHaptic}
                                onHapticChange={(value) => {
                                    setSelectedHaptic(value);   // Set the selected haptic type
                                    setHapticValue(value);      // Also set the haptic value if needed elsewhere
                                }}
                                style={pickerSelectStyles}
                                selectedValue={hapticValue}    // Ensuring this is used for displaying the current value
                            />

                        </View>

                        <View style={{...styles.section}}>
                            <Text style={styles.sectionHeader}>Sequential Haptic Feedback Nodes</Text>
                            <Text style={styles.sectionDescription}>Configure the sequence of haptic feedbacks to play during the interaction.</Text>
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
