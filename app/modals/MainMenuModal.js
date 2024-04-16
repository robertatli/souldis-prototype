// MainMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';

import SaveDesignModal from './SaveDesignModal';

const MainMenuModal = ({
    modalVisible,
    setModalVisible,
    handleAddComponent,
    pickImage,
    clearScreen,
    setSaveSetupModalVisible,
    savedSetups,
    loadSetup,
    deleteSetup,
    setupName, 
    setSetupName, 
    saveSetup,
    saveSetupModalVisible
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleAddComponent}>
                        <Text>Add Button</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                        <Text>Set Background</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                        <Text>Clear The Screen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={() => setSaveSetupModalVisible(true)}>
                        <Text>Save Current Setup</Text>
                    </TouchableOpacity>
                
                    <FlatList
                        data={savedSetups}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                            <View style={styles.setupItemRow}>
                                <TouchableOpacity onPress={() => loadSetup(item)}>
                                    <Text style={styles.setupItemText} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteSetup(item.name)}>
                                    <Text style={styles.deleteButtonText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </View>
            <SaveDesignModal
                modalVisible={saveSetupModalVisible}
                setModalVisible={setSaveSetupModalVisible}
                setupName={setupName}
                setSetupName={setSetupName}
                saveSetup={saveSetup}
            />
        </Modal>
    );
};

export default MainMenuModal;
