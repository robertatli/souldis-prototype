import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import HapticDropdown from "../HapticDropdown/HapticDropdown";

import styles from "../../styles/stylesIndex";

export const HapticNodeItem = ({ item, drag, isActive, onValueChange }) => {
    // Assuming your `item` has a 'label' and 'value' that corresponds to the haptic feedback
    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.nodeItem,
          { backgroundColor: isActive ? "lightgrey" : "#f0f0f0" },
        ]}
      >
        <HapticDropdown
          selectedHaptic={item.selectedHaptic}
          onHapticChange={(value) => {
            onValueChange(item.key, value); // Update based on item.key
          }}
          style={pickerSelectStyles}
          selectedValue={item.value}
        />
      </TouchableOpacity>
    );
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '100%', // Ensure full width or a fixed width as needed
        height: 32, // Standardize height
        fontSize: 14,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: '#f0f0f0',
        borderRadius: 4,
        color: 'black',
        textAlign: 'center',
        marginRight: 8,
        backgroundColor: 'white',
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
  });