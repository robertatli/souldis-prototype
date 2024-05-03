// ComponentsMenuModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleDot, faFileText, faFloppyDisk, faICursor, faSquareCheck, faSquarePlus, faT, faXmark } from '@fortawesome/free-solid-svg-icons'


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
                    <TouchableOpacity 
                        style={{
                            ...styles.modalButton, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} 
                        onPress={() => handleAddComponent('Button')}>
                        <FontAwesomeIcon icon={faSquarePlus} size={18} style={{
                            float: 'left',
                            zIndex: 200,
                            alignSelf: 'flex-start',}} />
                        <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add Button</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            ...styles.modalButton, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} 
                        onPress={() => handleAddComponent('Radio')}>
                        <FontAwesomeIcon icon={faCircleDot} size={18} style={{
                            float: 'left',
                            zIndex: 200,
                            alignSelf: 'flex-start',}} />
                        <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add Radio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            ...styles.modalButton, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} 
                        onPress={() => handleAddComponent('Checkbox')}>
                        <FontAwesomeIcon icon={faSquareCheck} size={18} style={{
                            float: 'left',
                            zIndex: 200,
                            alignSelf: 'flex-start',}} />
                        <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add Checkbox</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            ...styles.modalButton, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} 
                        onPress={() => handleAddComponent('Text')}>
                        <FontAwesomeIcon icon={faT} size={18} style={{
                            float: 'left',
                            zIndex: 200,
                            alignSelf: 'flex-start',}} />
                        <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            ...styles.modalButton, 
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} 
                        onPress={() => handleAddComponent('TextInput')}>
                        <FontAwesomeIcon icon={faICursor} size={18} style={{
                            float: 'left',
                            zIndex: 200,
                            alignSelf: 'flex-start',}} />
                        <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add TextInput</Text>
                    </TouchableOpacity>

                    <FlexSpacer />

                    <TouchableOpacity 
                            style={{
                                ...styles.modalButtonClose, 
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} 
                            onPress={() => setModalVisible(false) }>
                            <FontAwesomeIcon icon={faXmark} size={18} style={{
                                float: 'left',
                                zIndex: 200,
                                color: 'white',
                                alignSelf: 'flex-start',}} />
                            <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Close</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ComponentsMenuModal;
