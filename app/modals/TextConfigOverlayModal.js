// ConfigOverlayModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/stylesIndex';
import { ScrollView } from 'react-native-virtualized-view';

import LabeledInput from './LabeledInput';
import Toast from 'react-native-toast-message';

const TextConfigOverlayModal = ({
    visible,
    onClose,
    component,
    onLabelChange,
}) => {
    const [label, setLabel] = useState(component?.label || '');

    useEffect(() => {
        if (component) {
            setLabel(component.label || '');
        }
    }, [component]);

    const handleSave = () => {
        if (component) {
            onLabelChange(component.id, label);
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
                    <Text style={styles.modalTitleSection}>Text Configuration</Text>
                    <ScrollView style={styles.scrollView} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={{...styles.section}}>
                            <Text style={styles.sectionHeader}>Text</Text>
                            <Text style={styles.sectionDescription}>Choose the displayed text.</Text>
                            <LabeledInput
                                label="Label"
                                value={label}
                                onChangeText={setLabel}
                                placeholder="Enter component label"
                            />
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

export default TextConfigOverlayModal;
