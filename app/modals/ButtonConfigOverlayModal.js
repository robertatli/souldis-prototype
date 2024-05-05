import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';
import Toast from 'react-native-toast-message';

import LabeledInput from './LabeledInput';
import { runOnJS } from 'react-native-reanimated';

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
    const [width, setWidth] = useState(component?.width || '90%');
    const [height, setHeight] = useState(component?.height || 40);

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setNextPageId(buttonConfigs[component.id] || '');
            setHapticSequence(hapticNodes[component.id] || []);
            setWidth(component.width || '100%');
            setHeight(component.height || 40);
        }
    }, [component, buttonConfigs, hapticNodes]);

    const handleSave = () => {
        if (component) {
            const formattedWidth = handleDimensionChange(width);
            const formattedHeight = handleDimensionChange(height);
            runOnJS(onLabelChange)(component.id, label);
            setButtonConfigs({ ...buttonConfigs, [component.id]: nextPageId });
            setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
            onComponentUpdate(component.id, { ...component, width: formattedWidth, height: formattedHeight });
        }
        onClose();
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
                    <Text style={styles.modalTitle}>Button Configuration</Text>
                    <LabeledInput
                        label="Label"
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter Text"
                    />
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
                    <Dropdown
                        savedPages={savedPages}
                        currentButtonId={currentButtonId}
                        buttonConfigs={buttonConfigs}
                        onConfigChange={(id, selectedSetup) => {
                            setNextPageId(selectedSetup);
                            setButtonConfigs({ ...buttonConfigs, [id]: selectedSetup });
                        }}
                    />
                    {ButtonConfigurationComponent}
                    <FlexSpacer />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};

export default ButtonConfigOverlayModal;
