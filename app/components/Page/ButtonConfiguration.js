import { TouchableOpacity, View, Text } from "react-native";
import { v4 as uuidv4 } from 'uuid';
import { HapticNodeList } from "./HapticNodeList";
import styles from "../../styles/stylesIndex";

export const ButtonConfiguration = ({ currentButtonId, hapticNodes, setHapticNodes }) => {
    //const [nodes, setNodes] = useState([]);
  
    // Function to add a new haptic node
    const addHapticNode = () => {
      const newNode = {
        key: `${uuidv4()}`, // Unique key for the new node
        value: 'selectionAsync', // Default value or some initial value
        selectedHaptic: 'selectionAsync',
      };
      const currentNodes = hapticNodes[currentButtonId] || [];
      const updatedNodes = [...currentNodes, newNode];
      setHapticNodes({ ...hapticNodes, [currentButtonId]: updatedNodes });
    };
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.modalButton} onPress={addHapticNode}>
            <Text>Add Haptic Node</Text>
        </TouchableOpacity>
        <HapticNodeList
          nodes={hapticNodes[currentButtonId] || []}
          setNodes={(newNodes) => {
            setHapticNodes({ ...hapticNodes, [currentButtonId]: newNodes });
          }}
        />
      </View>
    );
  }; 