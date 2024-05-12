import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';
import { ScrollView } from 'react-native-virtualized-view';

import LabeledInput from './LabeledInput';
import Toast from 'react-native-toast-message';

const RadioConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
    onSaveValue,
    variables,
    ButtonConfigurationComponent,
    setHapticNodes,
    hapticNodes,
    currentButtonId,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [hapticSequence, setHapticSequence] = useState(hapticNodes[currentButtonId] || []);
    // Convert the value to a string for use in TextInput
    // Initialize value safely by ensuring component and component.value are defined
    const [variableValues, setVariableValues] = useState({});


    useEffect(() => {
        if (component) {
        setLabel(component.label || '');
        setHapticSequence(hapticNodes[component.id] || []);
        // Initialize variable values
        const initialValues = {};
        variables.forEach(varItem => {
            initialValues[varItem.id] = varItem.value.toString();
        });
        setVariableValues(initialValues);
        }
    }, [component, variables, hapticNodes]);

    const handleVariableChange = (id, value) => {
        setVariableValues(prev => ({
        ...prev,
        [id]: value
        }));
    };

    const handleSave = () => {
        if (component) {
        onLabelChange(component.id, label);
        setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
        variables.forEach(varItem => {
            onSaveValue(varItem.id, parseInt(variableValues[varItem.id], 10));
        });
        }
        onClose();
    };

    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                        <Spacer height={32} />
                        <Text style={styles.modalTitleSection}>Radio Configuration</Text>
                    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={{...styles.section}}>
                            <Text style={styles.sectionHeader}>Radio Name</Text>
                            <Text style={styles.sectionDescription}>Set the radio's name as it will appear on the screen.</Text>
                            <LabeledInput
                                label="Name"
                                value={label}
                                onChangeText={setLabel}
                                placeholder="Enter name"
                            />
                        </View>
                        {variables.length > 0 && (
                            <View style={{...styles.section}}>
                                <Text style={styles.sectionHeader}>Variables</Text>
                                <Text style={styles.sectionDescription}>Assign a value for this radio button for the variables in the flow.</Text>
                                {variables.map(varItem => (
                                    <View key={varItem.id} style={styles.picker}>
                                        <LabeledInput
                                            label={varItem.name}
                                            value={variableValues[varItem.id]}
                                            onChangeText={(text) => handleVariableChange(varItem.id, text)}
                                            keyboardType="numeric"
                                            returnKeyType="done"
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                        <View style={{...styles.section}}>
                            <Text style={styles.sectionHeader}>Touch Feedback Sequence</Text>
                            <Text style={styles.sectionDescription}>Set up a sequence of feedbacks for interactions with the button.</Text>
                            {ButtonConfigurationComponent}
                        </View>
                        <FlexSpacer />
                    </ScrollView>
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};

export default RadioConfigOverlayModal;
