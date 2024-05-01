// TutorialModal.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import Modal from "react-native-modal";
import styles from '../styles/stylesIndex';

const TutorialModal = ({ isVisible, onClose }) => {
    return (
        <Modal
            animationIn="slideInRight"
            animationOut="slideOutRight"
            isVisible={isVisible}
            hasBackdrop={false}
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <Text style={styles.modalText}>Welcome to the Tutorial!</Text>
                <Button onPress={onClose} title="Close Tutorial" />
            </View>
        </Modal>
    );
};

export default TutorialModal;
