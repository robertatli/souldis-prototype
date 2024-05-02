// ComponentsMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

const ComponentsMenuModal = ({ 
    modalVisible, 
    setModalVisible,
    handleAddComponent
 }) => {
    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Add your components menu content here */}
                    <Text>Components Menu</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('Button')}>
                        <Text>Add Button</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('Radio')}>
                        <Text>Add Radio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('Checkbox')}>
                        <Text>Add Checkbox</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('Text')}>
                        <Text>Add Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('TextInput')}>
                        <Text>Add TextInput</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.otherModalButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.otherModalText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ComponentsMenuModal;
