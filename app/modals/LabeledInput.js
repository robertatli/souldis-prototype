import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  // Align children in a row
    alignItems: 'center',  // Center-align items vertically
    marginVertical: 10,    // Optional: add vertical spacing between rows
  },
  label: {
    marginRight: 10,       // Add some space between the label and the input
  },
  textInput: {
    flex: 1,               // TextInput takes up all available space
    borderWidth: 1,        // For visibility
    borderColor: '#ccc',
    padding: 8,
  }
});

// Component
const LabeledInput = ({ label, value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

export default LabeledInput;
