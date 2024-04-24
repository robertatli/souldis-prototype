// ConfigOverlayModal.js
import React from 'react';
import { Modal, View, Text, Button } from 'react-native';
import Dropdown from '../components/Dropdown/Dropdown';
import styles from '../styles/stylesIndex';

const RadioConfigOverlayModal = ({
    visible,
    onClose,
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
                    <Text>Radio Configuration</Text>
                    <Button title="Save" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default RadioConfigOverlayModal;
