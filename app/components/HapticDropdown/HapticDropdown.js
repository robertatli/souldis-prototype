// HapticDropdown.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';

import styles from '../../styles/stylesIndex';

const HapticDropdown = ({ selectedHaptic, onHapticChange }) => {
    // Options for the haptic feedback types
    const hapticOptions = [
        { label: 'Selection', value: 'selectionAsync' },
        { label: 'Success Notification', value: 'notificationAsyncSuccess' },
        { label: 'Error Notification', value: 'notificationAsyncError' },
        { label: 'Warning Notification', value: 'notificationAsyncWarning' },
        { label: 'Light Impact', value: 'impactAsyncLight' },
        { label: 'Medium Impact', value: 'impactAsyncMedium' },
        { label: 'Heavy Impact', value: 'impactAsyncHeavy' },
        { label: 'Delay 100ms', value: 'delayAsync100' },
        { label: 'Delay 300ms', value: 'delayAsync300' },
        { label: 'Delay 500ms', value: 'delayAsync500' },
    ];

    // // Custom style for the picker
    // const customPickerStyles = {
    //     inputIOS: {
    //         width: '75%', // Ensure full width or a fixed width as needed
    //         fontSize: 16,
    //         paddingVertical: 8,
    //         borderWidth: 1,
    //         borderColor: 'gray',
    //         borderRadius: 4,
    //         color: 'black',
    //         textAlign: 'left',
    //     },
    //     inputAndroid: {
    //         width: '75%', // Ensure full width or a fixed width as needed
    //         fontSize: 16,
    //         paddingVertical: 8,
    //         borderWidth: 1,
    //         borderColor: 'gray',
    //         borderRadius: 8,
    //         color: 'black',
    //         textAlign: 'left',
    //     },
    //     placeholder: {
    //         color: 'gray',
    //         fontSize: 16,
    //         textAlign: 'left',
    //     },
    //     iconContainer: {
    //         top: 0,
    //         right: 88,
    //     },
    // };

    return (
        <RNPickerSelect
            onValueChange={onHapticChange}
            items={hapticOptions}
            value={selectedHaptic}
            placeholder={{ label: "Select a haptic...", value: null }}
            useNativeAndroidPickerStyle={false} // this is to ensure consistent styling across platforms
            Icon={() => <Icon name="chevron-down" size={20} color="gray" />}
        />
    );
  };

  export default HapticDropdown;