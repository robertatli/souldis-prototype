import { saveFlowVariables } from './saveFlowVariables';

export const handleSelectVariableHandler = async (variableId, variables, setVariables, selectedId, setSelectedId, flowId) => {
    // Map through variables to update their values based on selection
    const updatedVariables = variables.map(variable => {
        if (variable.id === variableId) {
            variable.value = selectedId === variableId ? 0 : 1; // Toggle value
        }
        return variable;
    });
    setVariables(updatedVariables);
    setSelectedId(selectedId === variableId ? null : variableId);
    // Save updated variables back to AsyncStorage
    await saveFlowVariables(flowId, updatedVariables);
};