// ConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';

const RadioConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
    onSaveValue,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [value, setValue] = useState(component?.value || 0);

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setValue(component.value || 0);
        }
    }, [component]);

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
            onSaveValue(component.id, value);
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Radio Configuration</Text>
                    <TextInput
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter component label"
                    />
                    <br/>
                    <Text>Radio Value</Text>
                    <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder="Enter component's value"
                    />
                    <br/>
                    <Button title="Save" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
};

export default RadioConfigOverlayModal;
