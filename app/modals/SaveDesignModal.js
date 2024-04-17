// SaveDesignModal.js
import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

const SaveDesignModal = ({ 
        modalVisible, 
        setModalVisible, 
        //pageName, 
        //setPageName, 
        savePage 
    }) => {
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
                        value={pageName}
                        onChangeText={setPageName}
                        style={styles.modalTextInput}
                    />
                    <TouchableOpacity style={styles.modalSaveButton} onPress={savePage}>
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
