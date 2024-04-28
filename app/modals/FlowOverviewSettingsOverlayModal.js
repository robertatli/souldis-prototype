import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, FlatList } from 'react-native';
import styles from '../styles/stylesIndex';

import VariableItem from '../components/VariableItem/VariableItem';

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
        onAddVariable(newVariableName);
        setNewVariableName('');
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Flow Settings</Text>
                    <TextInput
                        style={styles.textInput}
                        value={newVariableName}
                        onChangeText={setNewVariableName}
                        placeholder="New Variable Name"
                    />
                    <Button title="Add Variable" onPress={handleSaveNewVariable} />
                    <FlatList
                        data={variables}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <VariableItem item={item} onRenameVariable={onRenameVariable} handleRemoveVariable={handleRemoveVariable} />}
                    />
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};


export default FlowOverviewSettingsOverlayModal;
