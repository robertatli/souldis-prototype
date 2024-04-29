// MainMenuModal.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link } from 'expo-router';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialIcons';


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


    if (isViewModeOn) {
        return (
            <Modal
                transparent={false}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                presentationStyle="overFullscreen"
                isVisible={modalVisible}
                useNativeDriver={true}
                swipeDirection="right"
                hasBackdrop={false}
                onSwipeComplete={() => setModalVisible(false)}
                
            >
                <View style={styles.centeredView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icon name="chevron-left" size={40} color="#000" /> 
                    </TouchableOpacity>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setComponentsPageModalVisible(true)}>
                            <Text>Add Component</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                            <Text>Set Background</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                            <Text>Clear The Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to Edit Mode </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.otherModalButton} onPress={savePage}>
                            <Text style={styles.otherModalText}>Save Current Setup</Text>
                        </TouchableOpacity>
                    
                        <Link href={`/flow/${flowId}`} asChild>
                            <TouchableOpacity style={styles.otherModalButton} onPress={() => {}}>
                                <Text style={styles.otherModalText}>Go back to Flow Overview</Text>
                            </TouchableOpacity>
                        </Link>
                        
                    </View>
                </View>
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
                transparent={false}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                presentationStyle="overFullscreen"
                isVisible={modalVisible}
                useNativeDriver={true}
                swipeDirection="right"
                hasBackdrop={false}
                onSwipeComplete={() => setModalVisible(false)}
                
            >
                <View style={styles.centeredView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icon name="chevron-left" size={40} color="#000" /> 
                    </TouchableOpacity>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setComponentsPageModalVisible(true)}>
                            <Text>Add Component</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                            <Text>Set Background</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                            <Text>Clear The Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to View Mode </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.otherModalButton} onPress={savePage}>
                            <Text style={styles.otherModalText}>Save Current Setup</Text>
                        </TouchableOpacity>
                    
                        <Link href={`/flow/${flowId}`} asChild>
                            <TouchableOpacity style={styles.otherModalButton} onPress={() => {}}>
                                <Text style={styles.otherModalText}>Go back to Flow Overview</Text>
                            </TouchableOpacity>
                        </Link>
                        
                    </View>
                </View>
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
