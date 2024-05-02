// MainMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link, router } from 'expo-router';

import SaveDesignModal from './SaveDesignModal';
import ComponentsMenuModal from './ComponentsMenuModal';
import InfoSection from './InfoSection';

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
    };

    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;

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
                        <Spacer height={32} />
                        <Text style={styles.modalTitle}>Main Menu</Text>
                        <InfoSection />
                        <FlexSpacer />
                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to Edit Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonClose} onPress={() => router.push({ pathname: `/flow/${flowId}` }) }>
                            <Text style={styles.whitetext}>Go back to Flow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonClose} onPress={() => setModalVisible(false) }>
                            <Text style={styles.whitetext}>Close</Text>
                        </TouchableOpacity>

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
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Spacer height={32} />

                        <Text style={styles.modalTitle}>Main Menu</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setComponentsPageModalVisible(true)}>
                            <Text>Add Component</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                            <Text>Set Background</Text>
                        </TouchableOpacity>

                        <Spacer height={0} /> 
                        {/* This Spacer is here because of a bug that was making the next element fade-in, now nothing fades in because this spacer is empty */}
    
                        <TouchableOpacity style={styles.modalButton} onPress={clearScreen}>
                            <Text>Clear The Screen</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity style={styles.modalButton} onPress={savePage}>
                            <Text>Save Current Setup</Text>
                        </TouchableOpacity>
                        
                        <FlexSpacer />

                        <TouchableOpacity style={styles.modalButton} onPress={() => changeModes() }>
                            <Text>Change to View Mode </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButtonClose} onPress={() => router.push({ pathname: `/flow/${flowId}` }) }>
                            <Text style={styles.whitetext}>Go back to Flow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonClose} onPress={() => setModalVisible(false) }>
                            <Text style={styles.whitetext}>Close</Text>
                        </TouchableOpacity>
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
