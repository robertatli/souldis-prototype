import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, FlatList } from 'react-native';
import styles from '../../styles/stylesIndex';

const VariableItem = ({ item, onRenameVariable, handleRemoveVariable }) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(item.name);

    const handleSaveName = () => {
        onRenameVariable(item.id, name);
        setEditMode(false);
    };

    return (
        <View style={styles.variableItem}>
            {editMode ? (
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.variableInput}
                    onBlur={handleSaveName}
                    autoFocus={true}
                />
            ) : (
                <Text onPress={() => setEditMode(true)}>{item.name}: {item.value}</Text>
            )}
            <Button style={styles.variableItemButton} title="Remove" onPress={() => handleRemoveVariable(item.id)} />
        </View>
    );
};

export default VariableItem;
