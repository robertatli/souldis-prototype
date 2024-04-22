// MainMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link } from 'expo-router';

import SaveDesignModal from './SaveDesignModal';

const MainMenuModal = ({
    modalVisible,
    setModalVisible,
    handleAddComponent,
    pickImage,
    clearScreen,
    // setSavePageModalVisible,
    savedPages,
    loadPage,
    deletePage,
    // pageName, 
    // setPageName, 
    savePage,
    // savePageModalVisible,
    flowId
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
                    {/* <TouchableOpacity style={styles.modalButton} onPress={handleAddComponent}>
                        <Text>Add Button</Text>
                    </TouchableOpacity> */}
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
                    <Link href={`/flow/${flowId}`} asChild>
                        <Button title="Go back to Flow" onPress={() => {}} />
                    </Link>
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </View>
            {/* <SaveDesignModal
                modalVisible={savePageModalVisible}
                setModalVisible={setSavePageModalVisible}
                //pageName={pageName}
                //setPageName={setPageName}
                savePage={savePage}
            /> */}
        </Modal>
    );
};

export default MainMenuModal;
