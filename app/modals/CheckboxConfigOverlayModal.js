// ConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-virtualized-view';

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
                    <Text style={styles.modalTitleSection}>Checkbox Configuration</Text>
                    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={{...styles.section}}>
                            <Text style={styles.sectionHeader}>Checkbox Name</Text>
                            <Text style={styles.sectionDescription}>Set the checkbox's name as it will appear on the screen.</Text>
                            <LabeledInput
                                label="Name"
                                value={label}
                                onChangeText={setLabel}
                                placeholder="Enter name"
                            />
                        </View>
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

export default CheckboxConfigOverlayModal;
