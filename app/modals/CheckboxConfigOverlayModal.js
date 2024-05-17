// ConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import styles from '../styles/stylesIndex';
import Toast from 'react-native-toast-message';
import LabeledInput from './LabeledInput';

const CheckboxConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
    ButtonConfigurationComponent,
    setHapticNodes,
    hapticNodes,
    currentButtonId,
}) => {
    const [label, setLabel] = useState(component?.label || '');
    const [hapticSequence, setHapticSequence] = useState(hapticNodes[currentButtonId] || []);

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
            setHapticSequence(hapticNodes[component.id] || []);
        }
    }, [component, hapticNodes]);

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
            setHapticNodes({ ...hapticNodes, [component.id]: hapticSequence });
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
            header: 'Checkbox Name',
            description: "Set the checkbox's name as it will appear on the screen.",
            content: (
                <LabeledInput
                    label="Name"
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Enter name"
                />
            ),
        },
        {
            key: 'sequenceFeedback',
            header: 'Touch Feedback Sequence',
            description: "Set up a sequence of feedbacks for interactions with the checkbox.",
            content: ButtonConfigurationComponent,
        },
    ];

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
                    <Text style={styles.modalTitleSection}>Checkbox Configuration</Text>
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

export default CheckboxConfigOverlayModal;
