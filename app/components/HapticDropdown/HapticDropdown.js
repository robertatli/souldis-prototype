// HapticDropdown.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';

const HapticDropdown = ({ onHapticChange }) => {
    // Options for the haptic feedback types
    const hapticOptions = [
        { label: 'Selection', value: 'selectionAsync' },
        { label: 'Success Notification', value: 'notificationAsyncSuccess' },
        { label: 'Error Notification', value: 'notificationAsyncError' },
        { label: 'Warning Notification', value: 'notificationAsyncWarning' },
        { label: 'Light Impact', value: 'impactAsyncLight' },
        { label: 'Medium Impact', value: 'impactAsyncMedium' },
        { label: 'Heavy Impact', value: 'impactAsyncHeavy' },
    ];

    // Custom style for the picker
    const customPickerStyles = {
      inputIOS: {
          fontSize: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 4,
          color: 'black',
          textAlign: 'center',
          paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'purple',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30, // to ensure the text is never behind the icon
      },
      placeholder: {
          color: 'gray',
          fontSize: 16,
      },
      iconContainer: {
          top: 10,
          right: 15,
      },
  };

    return (
      <RNPickerSelect
          onValueChange={onHapticChange}
          items={hapticOptions}
          placeholder={{ label: "Select a haptic...", value: null }}
          style={customPickerStyles}
          useNativeAndroidPickerStyle={false} // this is to ensure consistent styling across platforms
          Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
      />
    );
  };

  export default HapticDropdown;