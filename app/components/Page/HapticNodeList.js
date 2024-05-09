
import DraggableFlatList from 'react-native-draggable-flatlist';
import { HapticNodeItem } from './HapticNodeItem';

import styles from "../../styles/stylesIndex";

export const HapticNodeList = ({ nodes, setNodes }) => {
    const renderItem = ({ item, drag, isActive }) => {
      const onValueChange = (key, newValue) => {
        const updatedNodes = nodes.map((node) => 
          node.key === key ? { ...node, value: newValue, selectedHaptic: newValue } : node
        );
        setNodes(updatedNodes);
      };
  
      return (
        <HapticNodeItem
          item={item}
          drag={drag}
          isActive={isActive}
          onValueChange={onValueChange}
        />
      );
    };
  
    return (
      <DraggableFlatList
        data={nodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={({ data }) => setNodes(data)}
      />
    );
  };