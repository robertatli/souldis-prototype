import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';

import ComponentsMenuModal from './ComponentsMenuModal';

const MainMenuModal = ({ modalVisible, setModalVisible }) => {
    const [componentsMenuVisible, setComponentsMenuVisible] = useState(false);

    const openComponentsMenu = () => {
        setComponentsMenuVisible(true);
    };

    const handleAddComponent = () => {
        // Add functionality to handle adding components
        console.log('Add component functionality here');
    };

    const pickImage = () => {
        // Add functionality to pick an image
        console.log('Pick image functionality here');
    };

    const clearScreen = () => {
        // Add functionality to clear the screen
        console.log('Clear screen functionality here');
    };

    const savePage = () => {
        // Add functionality to save the current setup
        console.log('Save page functionality here');
    };

    const loadPage = (item) => {
        // Add functionality to load a saved page
        console.log(`Load page: ${item.name}`);
    };

    const deletePage = (name) => {
        // Add functionality to delete a saved page
        console.log(`Delete page: ${name}`);
    };

    const savedPages = []; // Add your saved pages data here

    const flowId = ''; // Add your flow ID here

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Existing functionality */}
                    <TouchableOpacity style={styles.modalButton} onPress={handleAddComponent}>
                        <Text>Add Component</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                        <Text>Set Background</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                        <Text>Clear The Screen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={savePage}>
                        <Text>Save Current Setup</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={savedPages}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                            <View style={styles.setupItemRow}>
                                <TouchableOpacity onPress={() => loadPage(item)}>
                                    <Text style={styles.setupItemText} numberOfLines={1} ellipsizeMode="tail">
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => deletePage(item.name)}>
                                    <Text style={styles.deleteButtonText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <Button title="Go back to Flow" onPress={() => {}} />
                    {/* New functionality to open ComponentsMenuModal */}
                    <TouchableOpacity style={styles.modalButton} onPress={openComponentsMenu}>
                        <Text>Open Components Menu</Text>
                    </TouchableOpacity>
                    {/* Close modal button */}
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Render ComponentsMenuModal if componentsMenuVisible is true */}
            {componentsMenuVisible && (
                <ComponentsMenuModal
                    modalVisible={componentsMenuVisible}
                    setModalVisible={setComponentsMenuVisible}
                />
            )}
        </Modal>
    );
};

export default MainMenuModal;
