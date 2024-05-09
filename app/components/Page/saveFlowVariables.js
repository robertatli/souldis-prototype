export const saveFlowVariables = async (flowId, updatedVariables) => {
    const storedFlows = await AsyncStorage.getItem('@flows');
    let flowsArray = JSON.parse(storedFlows);
    let flowIndex = flowsArray.findIndex(f => f.id === flowId);
    if (flowIndex !== -1) {
        flowsArray[flowIndex].variables = updatedVariables;
        await AsyncStorage.setItem('@flows', JSON.stringify(flowsArray));
    }
    console.log("flow Variables: ", flowsArray[flowIndex].variables);
};