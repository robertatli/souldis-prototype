import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

import LabeledInput from './LabeledInput';

const RadioConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
    onSaveValue,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    // Convert the value to a string for use in TextInput
    // Initialize value safely by ensuring component and component.value are defined
    const [value, setValue] = useState((component?.value ?? 0).toString());


    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            // Use nullish coalescing to ensure we fallback to '0' if component.value is undefined
            setValue((component.value ?? 0).toString());
        }
    }, [component]);
    

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
            // Convert value back to a number when saving/updating
            onSaveValue(component.id, parseInt(value, 10));
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
                    <Text style={styles.modalTitle}>Radio Configuration</Text>
                    <LabeledInput
                        label="Label"
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter Text"
                    />
                    {/* Add a break or space for layout if needed */}
                    <Text>Radio Value</Text>
                    <TextInput
                        value={value}
                        onChangeText={setValue}
                        placeholder="Enter component's value"
                        keyboardType="numeric"  // Ensure the keyboard is appropriate for numeric input
                    />
                    <FlexSpacer />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default RadioConfigOverlayModal;
