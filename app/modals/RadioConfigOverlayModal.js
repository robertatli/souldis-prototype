// ConfigOverlayModal.js
import React from 'react';
import { Modal, View, Text, Button } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';

const ButtonConfigOverlayModal = ({
    visible,
    onClose,
    savedPages,
    currentButtonId,
    buttonConfigs,
    setButtonConfigs,
    ButtonConfigurationComponent,  // Passing the whole component as a prop if it depends on context or has hooks
}) => {
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
                    <Dropdown
                        savedPages={savedPages}
                        currentButtonId={currentButtonId}
                        buttonConfigs={buttonConfigs}
                        onConfigChange={(id, selectedSetup) => {
                            setButtonConfigs({ ...buttonConfigs, [id]: selectedSetup });
                        }}
                    />
                    {ButtonConfigurationComponent}
                    <Button title="Save" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default ButtonConfigOverlayModal;
