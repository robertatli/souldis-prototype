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
          selectedValue={item.value}
        />
      </TouchableOpacity>
    );
  };