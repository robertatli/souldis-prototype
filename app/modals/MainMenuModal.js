// MainMenuModal.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link, router } from 'expo-router';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/MaterialIcons';


import SaveDesignModal from './SaveDesignModal';
import ComponentsMenuModal from './ComponentsMenuModal';
import TutorialModal from './TutorialModal';

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
    isViewModeOn,
    tutorialModalVisible,
    setTutorialModalVisible,
}) => {
    const changeModes = () => {
        changeViewMode(!isViewModeOn);
    };

    const Spacer = ({ height }) => <View style={{ height }} />;

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
                    <TouchableOpacity style={styles.tutorialButton} onPress={() => setTutorialModalVisible(true)}>
                        <Icon name="help" size={40} /> 
                    </TouchableOpacity>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to Edit Mode</Text>
                        </TouchableOpacity>
                        <Spacer height={10} />
                        <TouchableOpacity style={styles.modalButton} onPress={() => router.push({ pathname: `/flow/${flowId}` }) }>
                            <Text>Go back to Flow</Text>
                        </TouchableOpacity>
                        <Spacer height={10} />
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false) }>
                            <Text>Close</Text>
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
                    <TutorialModal
                        isVisible={tutorialModalVisible}
                        onClose={() => setTutorialModalVisible(false)}
                    />
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
                    <TouchableOpacity style={styles.tutorialButton} onPress={() => setTutorialModalVisible(true)}>
                        <Icon name="help" size={40} color="#000" /> 
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
                        <Spacer height={10} />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
                    <TutorialModal
                        isVisible={tutorialModalVisible}
                        onClose={() => setTutorialModalVisible(false)}
                    />
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
