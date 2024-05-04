import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';

import VariableItem from '../components/VariableItem/VariableItem';
import LabeledInput from './LabeledInput';

import Toast from 'react-native-toast-message';

const FlowOverviewSettingsOverlayModal = ({
    visible,
    onClose,
    variables,
    onAddVariable,
    onRenameVariable,
    newVariableName,
    setNewVariableName,
    handleRemoveVariable
}) => {
    const handleSaveNewVariable = () => {
        if (newVariableName.trim() === '') return;
        console.log("Adding variable:", newVariableName);
        onAddVariable(newVariableName);
        setNewVariableName('');
    };

    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Spacer height={32} />
                    <Text style={styles.modalTitle}>Flow Settings</Text>
                    <LabeledInput
                        label="Variable"
                        value={newVariableName}
                        onChangeText={setNewVariableName}
                        placeholder="New Variable Name"
                    />
                    <TouchableOpacity style={styles.modalButton} onPress={handleSaveNewVariable}>
                        <Text>Add Variable</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={variables}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <VariableItem item={item} onRenameVariable={onRenameVariable} handleRemoveVariable={handleRemoveVariable} />}
                    />
                    <FlexSpacer />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={onClose}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};


export default FlowOverviewSettingsOverlayModal;
