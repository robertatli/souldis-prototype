// MainMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link } from 'expo-router';

import SaveDesignModal from './SaveDesignModal';
import ComponentsMenuModal from './ComponentsMenuModal';

const MainMenuModal = ({
    modalVisible,
    setModalVisible,
    componentsPageModalVisible,
    setComponentsPageModalVisible,
    handleAddComponent,
    pickImage,
    clearScreen,
    // setSavePageModalVisible,
    // savedPages,
    // loadPage,
    // deletePage,
    // pageName, 
    // setPageName, 
    savePage,
    // savePageModalVisible,
    flowId,
    changeViewMode,
    isViewModeOn
}) => {

    const changeModes = () => {
        changeViewMode(!isViewModeOn);
        setModalVisible(false);
    };

    const Spacer = ({ height }) => <View style={{ height }} />;

    if (isViewModeOn) {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to Edit Mode </Text>
                        </TouchableOpacity>
                        
                        <Spacer height={10} />
                        <Link href={`/flow/${flowId}`} asChild>
                            <Button title="Go back to Flow" onPress={() => {}} />
                        </Link>
                        <Spacer height={10} />
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
                    <ComponentsMenuModal 
                        modalVisible={componentsPageModalVisible}
                        setModalVisible={setComponentsPageModalVisible}
                        handleAddComponent={handleAddComponent}
                    />
            </Modal>
        );
    }

    else {
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
                        <TouchableOpacity style={styles.modalButton} onPress={() => setComponentsPageModalVisible(true)}>
                            <Text>Add Component</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.modalButton} onPress={() => handleAddComponent('Button')}>
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
                        </TouchableOpacity> */}
    
                        
                        <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                            <Text>Set Background</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                            <Text>Clear The Screen</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.modalButton} onPress={savePage}>
                            <Text>Save Current Setup</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to View Mode </Text>
                        </TouchableOpacity>

                    
                        {/* <FlatList
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
                        /> */}
                        <Spacer height={10} />
                        <Link href={`/flow/${flowId}`} asChild>
                            <Button title="Go back to Flow" onPress={() => {}} />
                        </Link>
                        <Spacer height={10} />
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
                    <ComponentsMenuModal 
                        modalVisible={componentsPageModalVisible}
                        setModalVisible={setComponentsPageModalVisible}
                        handleAddComponent={handleAddComponent}
                    />
            </Modal>
        );

    }

};

export default MainMenuModal;
