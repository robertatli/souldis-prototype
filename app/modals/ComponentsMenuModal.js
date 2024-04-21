// ComponentsMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

const ComponentsMenuModal = ({ modalVisible, setModalVisible }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Add your components menu content here */}
                    <Text>Components Menu</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={() => console.log('Button pressed')}>
                        <Text>Button</Text>
                    </TouchableOpacity>
                    {/* Add more components/buttons as needed */}
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ComponentsMenuModal;
