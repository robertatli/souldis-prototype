import AsyncStorage from '@react-native-async-storage/async-storage';

export const onSaveValueHandler = async (variableId, newValue, setVariables, flowId) => {
    const storedFlows = await AsyncStorage.getItem('@flows');
    let flows = storedFlows ? JSON.parse(storedFlows) : [];
    let flowIndex = flows.findIndex(f => f.id === flowId);
    
    if (flowIndex !== -1) {
      let flow = flows[flowIndex];
      console.log("current flow: ", flow);
      let variableIndex = flow.variables.findIndex(v => v.id === variableId);
      
      if (variableIndex !== -1) {
        // Update the variable value
        flow.variables[variableIndex].value = newValue;
  
        // Update the flow in the array
        flows[flowIndex] = flow;
        
        // Save the updated flows array back to AsyncStorage
        await AsyncStorage.setItem('@flows', JSON.stringify(flows));
        
        // Optionally update the local state if you're also tracking changes there
        setVariables(flow.variables);
      }
    }
  };