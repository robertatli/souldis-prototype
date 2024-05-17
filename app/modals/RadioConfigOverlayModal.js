// RadioConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/stylesIndex';
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
    const [variableValues, setVariableValues] = useState({});

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setHapticSequence(hapticNodes[component.id] || []);
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

    const renderSection = ({ item }) => (
        <View style={styles.section}>
            <Text style={styles.sectionHeader}>{item.header}</Text>
            <Text style={styles.sectionDescription}>{item.description}</Text>
            {item.content}
        </View>
    );

    const sections = [
        {
            key: 'name',
            header: 'Radio Name',
            description: "Set the radio's name as it will appear on the screen.",
            content: (
                <LabeledInput
                    label="Name"
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Enter name"
                />
            ),
        },
        variables.length > 0 && {
            key: 'variables',
            header: 'Variables',
            description: "Assign a value for this radio button for the variables in the flow.",
            content: variables.map(varItem => (
                <View key={varItem.id} style={styles.picker}>
                    <LabeledInput
                        label={varItem.name}
                        value={variableValues[varItem.id]}
                        onChangeText={(text) => handleVariableChange(varItem.id, text)}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                </View>
            )),
        },
        {
            key: 'sequenceFeedback',
            header: 'Touch Feedback Sequence',
            description: "Set up a sequence of feedbacks for interactions with the button.",
            content: ButtonConfigurationComponent,
        },
    ].filter(Boolean); // Remove falsy values (in case variables.length is 0)

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
                    <KeyboardAwareFlatList
                        data={sections}
                        renderItem={renderSection}
                        keyExtractor={item => item.key}
                        extraScrollHeight={100}
                        enableOnAndroid={true}
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity style={styles.modalButtonClose} onPress={handleSave}>
                        <Text style={styles.whitetext}>Save</Text>
                    </TouchableOpacity>
                    <Toast />
                </View>
            </View>
        </Modal>
    );
};

const Spacer = ({ height }) => <View style={{ height }} />;
const FlexSpacer = () => <View style={{ flex: 1 }} />;

export default RadioConfigOverlayModal;
