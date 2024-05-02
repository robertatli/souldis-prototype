// ComponentsMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

const ComponentsMenuModal = ({ 
    modalVisible, 
    setModalVisible,
    handleAddComponent
 }) => {
    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >   
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Spacer height={32} />
                    {/* Add your components menu content here */}
                    <Text style={styles.modalTitle}>Components Menu</Text>
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

                    <FlexSpacer />

                    <TouchableOpacity style={styles.modalButtonClose} onPress={() => setModalVisible(false)}>
                        <Text style={styles.whitetext}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ComponentsMenuModal;
