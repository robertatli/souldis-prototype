// ConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

import LabeledInput from './LabeledInput';

const CheckboxConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
    ButtonConfigurationComponent,
    setHapticNodes,
    hapticNodes,
    currentButtonId,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [hapticSequence, setHapticSequence] = useState(hapticNodes[currentButtonId] || []);


    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setHapticSequence(hapticNodes[component.id] || []);
        }
    }, [component, hapticNodes]);

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
            setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
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
                    <Text style={styles.modalTitle}>Checkbox Configuration</Text>
                    <LabeledInput
                        label="Label"
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter Text"
                    />
                    {ButtonConfigurationComponent}
                    <FlexSpacer />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CheckboxConfigOverlayModal;
