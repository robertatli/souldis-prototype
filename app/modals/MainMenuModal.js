// MainMenuModal.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import styles from '../styles/stylesIndex';
import { Link, router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faBoxOpen, faEye, faChevronLeft, faXmark, faImage, faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import Toast from 'react-native-toast-message';
import Modal from "react-native-modal";

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
                transparent={false}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                // presentationStyle="fullScreen"
                isVisible={modalVisible}
                useNativeDriver={true}
                // hasBackdrop={false}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >   
                <View style={styles.centeredView}>
                    <View style={styles.mainMenuModalView}>
                        <Spacer height={32} />
                        <Text style={styles.modalTitle}>Main Menu</Text>
                        <InfoSection />
                        <FlexSpacer />
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => changeModes() }>
                            <FontAwesomeIcon icon={faPen} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Change to Edit Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButtonClose, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => router.push({ pathname: `/flow/${flowId}` }) }>
                            <FontAwesomeIcon icon={faChevronLeft} size={18} style={{
                                
                                zIndex: 200,
                                color: 'white',
                                alignSelf: 'flex-start',}} />
                            <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Go back to Flow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButtonClose, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => setModalVisible(false) }>
                            <FontAwesomeIcon icon={faXmark} size={18} style={{
                                
                                zIndex: 200,
                                color: 'white',
                                alignSelf: 'flex-start',}} />
                            <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Close</Text>
                        </TouchableOpacity>
                        <Toast />
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
                // presentationStyle="fullScreen"
                isVisible={modalVisible}
                useNativeDriver={true}
                // hasBackdrop={false}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.mainMenuModalView}>
                        <Spacer height={32} />

                        <Text style={styles.modalTitle}>Main Menu</Text>

                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => setComponentsPageModalVisible(true)}>
                            <FontAwesomeIcon icon={faBoxOpen} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add Component</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={pickImage}>
                            <FontAwesomeIcon icon={faImage} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Set Background</Text>
                        </TouchableOpacity>

                        <Spacer height={0} /> 
                        {/* This Spacer is here because of a bug that was making the next element fade-in, now nothing fades in because this spacer is empty */}
                        
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={clearScreen}>
                            <FontAwesomeIcon icon={faEraser} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Clear The Screen</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={savePage}>
                            <FontAwesomeIcon icon={faFloppyDisk} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Save Page</Text>
                        </TouchableOpacity>
                        
                        <FlexSpacer />

                        <TouchableOpacity 
                            style={{
                                ...styles.modalButton, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => changeModes() }>
                            <FontAwesomeIcon icon={faEye} size={18} style={{
                                
                                zIndex: 200,
                                alignSelf: 'flex-start',}} />
                            <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Change to View Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButtonClose, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => router.push({ pathname: `/flow/${flowId}` }) }>
                            <FontAwesomeIcon icon={faChevronLeft} size={18} style={{
                                
                                zIndex: 200,
                                color: 'white',
                                alignSelf: 'flex-start',}} />
                            <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Go back to Flow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{
                                ...styles.modalButtonClose, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => setModalVisible(false) }>
                            <FontAwesomeIcon icon={faXmark} size={18} style={{
                                
                                zIndex: 200,
                                color: 'white',
                                alignSelf: 'flex-start',}} />
                            <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Close</Text>
                        </TouchableOpacity>
                        <Toast />
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
