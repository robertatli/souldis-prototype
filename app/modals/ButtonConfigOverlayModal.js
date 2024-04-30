import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';

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
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [nextPageId, setNextPageId] = useState(buttonConfigs[currentButtonId] || ''); // Assuming buttonConfigs stores nextPageId
    const [hapticSequence, setHapticSequence] = useState(hapticNodes[currentButtonId] || []);

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setNextPageId(buttonConfigs[component.id] || '');
            setHapticSequence(hapticNodes[component.id] || []);
        }
    }, [component, buttonConfigs, hapticNodes]);

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
            setButtonConfigs({ ...buttonConfigs, [component.id]: nextPageId });
            setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
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
                    <Text>Button Configuration</Text>
                    <TextInput
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter component label"
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
                    <Button title="Save" onPress={handleSave} />
                </View>
            </View>
        </Modal>
    );
};

export default ButtonConfigOverlayModal;
