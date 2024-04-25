import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddComponentModal = ({ 
    isVisible, 
    onClose, 
    onAddComponent 
}) => {
  return (
    <Modal
      animationType="none"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Components Page</Text>
          {/* Each TouchableOpacity represents an option to add a component */}
          <TouchableOpacity onPress={() => onAddComponent('Button')}>
            <Text>Button</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddComponent('Radio')}>
            <Text>Radio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddComponent('Checkbox')}>
            <Text>Checkbox</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddComponent('Text')}>
            <Text>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onAddComponent('TextInput')}>
            <Text>Text Input</Text>
          </TouchableOpacity>
          {/* Close button */}
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  // Add styles for your buttons and text
});

export default AddComponentModal;
