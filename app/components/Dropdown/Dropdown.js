// Dropdown.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const Dropdown = ({ savedPages, currentButtonId, buttonConfigs, onConfigChange }) => {
  const items = savedPages.map((page) => ({
      label: page.name,
      value: page.id,
  }));

  const customPickerStyles = {
    inputIOS: {
      width: '100%', // Ensure full width or a fixed width as needed
      height: 40, // Standardize height
      fontSize: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      textAlign: 'center',
      marginTop: 8,
    },
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      color: 'black',
      textAlign: 'center',
    },
    placeholder: {
      color: 'gray',
      fontSize: 16,
      textAlign: 'center',
    },
  };

  const handleValueChange = (value) => {
    onConfigChange(currentButtonId, value);
  };

  return (
      <RNPickerSelect
          onValueChange={handleValueChange}
          items={items}
          value={buttonConfigs[currentButtonId]}
          placeholder={{ label: "Select a page...", value: null }}
          style={customPickerStyles}
          useNativeAndroidPickerStyle={false}
      />
  );
};

export default Dropdown;
