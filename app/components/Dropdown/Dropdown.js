// Dropdown.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const Dropdown = ({ savedSetups, currentButtonId, buttonConfigs, onConfigChange }) => {
  const items = savedSetups.map((setup) => ({
      label: setup.name,
      value: setup.name,
  }));

  const customPickerStyles = {
    inputIOS: {
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
          placeholder={{ label: "Select a setup...", value: null }}
          style={customPickerStyles}
          useNativeAndroidPickerStyle={false}
      />
  );
};

export default Dropdown;
