import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';
import Toast from 'react-native-toast-message';

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

    const renderSection = ({ item }) => (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>{item.header}</Text>
            <Text style={styles.sectionDescription}>{item.description}</Text>
            {item.content}
        </View>
    );

    const sections = [
        {
            key: 'name',
            header: 'Button Name',
            description: "Set the button's name as it will appear on the screen.",
            content: (
                <LabeledInput
                    label="Name"
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Enter name"
                />
            ),
        },
        {
            key: 'size',
            header: 'Size',
            description: "Adjust the button's size by setting its width and height.",
            content: (
                <>
                    <LabeledInput
                        label="Width"
                        value={width.toString()}
                        onChangeText={text => setWidth(text)}
                        placeholder="Width (e.g., 50% or 50)"
                    />
                    <LabeledInput
                        label="Height"
                        value={height.toString()}
                        onChangeText={text => setHeight(text)}
                        placeholder="Height (e.g., 20 or 20%)"
                    />
                </>
            ),
        },
        {
            key: 'link',
            header: 'Link',
            description: "Choose which page the button will link to when pressed.",
            content: (
                <Dropdown
                    savedPages={savedPages}
                    currentButtonId={currentButtonId}
                    buttonConfigs={buttonConfigs}
                    onConfigChange={(id, selectedSetup) => {
                        setNextPageId(selectedSetup);
                        setButtonConfigs({ ...buttonConfigs, [id]: selectedSetup });
                    }}
                />
            ),
        },
        {
            key: 'visibility',
            header: 'Visibility',
            description: "Toggle whether this button is visible when the app is in view mode.",
            content: (
                <CheckBoxInput 
                    label="Show in view mode"
                    checked={checked}
                    checkValueChanged={checkValueChanged}
                />
            ),
        },
        {
            key: 'initialFeedback',
            header: 'Initial Touch Feedback',
            description: "Choose the type of feedback when the button is first touched.",
            content: (
                <HapticDropdown
                    selectedHaptic={selectedHaptic}
                    onHapticChange={setSelectedHaptic}
                    style={pickerSelectStyles}
                    selectedValue={hapticValue}
                />
            ),
        },
        {
            key: 'sequenceFeedback',
            header: 'Touch Feedback Sequence',
            description: "Set up a sequence of feedbacks for interactions with the button.",
            content: ButtonConfigurationComponent,
        },
    ];

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
                    <KeyboardAwareFlatList
                        data={sections}
                        renderItem={renderSection}
                        keyExtractor={item => item.key}
                        extraScrollHeight={100}
                        enableOnAndroid={true}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};

const Spacer = ({ height }) => <View style={{ height }} />;
const FlexSpacer = () => <View style={{ flex: 1 }} />;

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
