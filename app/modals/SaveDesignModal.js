// SaveDesignModal.js
import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

const SaveDesignModal = ({ modalVisible, setModalVisible, setupName, setSetupName, saveSetup }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.centeredModalView}>
                <View style={styles.saveModalView}>
                    <Text style={styles.modalTitle}>Give your Design a name</Text>
                    <TextInput
                        placeholder="Enter Setup Name"
                        value={setupName}
                        onChangeText={setSetupName}
                        style={styles.modalTextInput}
                    />
                    <TouchableOpacity style={styles.modalSaveButton} onPress={saveSetup}>
                        <Text style={styles.modalButtonText}>Save Design</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SaveDesignModal;
