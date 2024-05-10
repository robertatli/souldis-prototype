// HapticDropdown.js
import React from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';

// import styles from '../../styles/stylesIndex';

const HapticDropdown = ({ selectedHaptic, onHapticChange, style }) => {
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

    return (
        <RNPickerSelect
            onValueChange={onHapticChange}
            items={hapticOptions}
            value={selectedHaptic}
            placeholder={{ label: "Select a haptic...", value: null }}
            useNativeAndroidPickerStyle={false} // this is to ensure consistent styling across platforms
            Icon={() => <View><Icon name="chevron-up" size={20} color="gray" style={{ position: 'relative', right: -30, top: 0,}} /><Icon name="chevron-down" size={20} color="gray" style={{ position: 'relative', right: -30, top: -10,}} /></View> }
            style={style}
        />
    );
  };



  export default HapticDropdown;