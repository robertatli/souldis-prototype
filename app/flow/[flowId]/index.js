import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, Link } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import styles from '../../styles/stylesIndex';

import FlowOverviewSettingsOverlayModal from '../../modals/FlowOverviewSettingsOverlayModal';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const FlowOverview = () => {
    const { flowId } = useLocalSearchParams();
    const [pages, setPages] = useState([]);
    const [flow, setFlow] = useState(null);
    const [flowSettingOverlayVisible, setFlowSettingOverlayVisible] = useState(false);
    const [variables, setVariables] = useState([]);
    const [newVariableName, setNewVariableName] = useState('');


    // Load the flow data from storage
    useEffect(() => {
        const loadFlowData = async () => {
            const flows = await AsyncStorage.getItem('@flows');
            const flowsArray = flows ? JSON.parse(flows) : [];
            const currentFlow = flowsArray.find(f => f.id === flowId);
            console.log('Current flow:', currentFlow);
            console.log('Pages:', currentFlow.pages);
            console.log('flowId: ', flowId);
            if (currentFlow) {
                setFlow(currentFlow);
                setPages(currentFlow.pages);
                setVariables(currentFlow.variables);
            }
        };
        loadFlowData();
    }, [flowId]);

    // Add a new page
    const handleAddPage = async () => {
        const newPageId = `page_${uuidv4()}`;
        const newPage = {
            id: newPageId,
            flowId: flowId,
            name: `New Page ${pages.length + 1}`,
            components: [],
            backgroundImageUri: null // Initial background image set to null or default
        };
    
        // Update the pages list for the flow
        const updatedPages = [...pages, newPage];
        setPages(updatedPages);
        await updateFlowInStorage(updatedPages);
    
        // Additionally, save the new page in the @pages storage
        const storedPagesJson = await AsyncStorage.getItem('@pages');
        const storedPages = storedPagesJson ? JSON.parse(storedPagesJson) : [];

        storedPages.push(newPage);
        //console.log("Stored Pages after: " + JSON.stringify(storedPages, null, 2));
    
        try {
            await AsyncStorage.setItem('@pages', JSON.stringify(storedPages));
        } catch (e) {
            console.error('Failed to create new page in @pages', e);
            alert('Failed to create new page.');
        }
    };
    
    // Function to handle adding a new variable
    const handleAddVariable = (varName) => {
        const newVariable = {
            id: uuidv4(), // Using Date.now() for simplicity
            name: varName,
            value: 0
        };
        
        const updatedVariables = [...variables, newVariable];
        setVariables(updatedVariables);
        updateFlowVariablesInStorage(updatedVariables);
        saveFlowData({ ...flow, variables: [...flow.variables, newVariable] }); // Assuming flow includes a variables array
    };

    const handleRenameVariable = (id, newName) => {
        const updatedVariables = variables.map(variable => {
            if (variable.id === id) {
                return { ...variable, name: newName };
            }
            return variable;
        });
        setVariables(updatedVariables);
        saveFlowData({ ...flow, variables: updatedVariables });
        updateFlowVariablesInStorage(updatedVariables);
    };
    
    // Function to save flow data to AsyncStorage
    const saveFlowData = async (flowData) => {
        try {
        const flows = await AsyncStorage.getItem('@flows');
        let flowsArray = flows ? JSON.parse(flows) : [];
        const flowIndex = flowsArray.findIndex(f => f.id === flowData.id);
        if (flowIndex !== -1) {
            flowsArray[flowIndex] = flowData;
        } else {
            flowsArray.push(flowData);
        }
        await AsyncStorage.setItem('@flows', JSON.stringify(flowsArray));
        } catch (error) {
        console.error('Failed to save flow data', error);
        }
    };

    // Update the flow in AsyncStorage
    const updateFlowInStorage = async (updatedPages) => {
        const storedFlows = await AsyncStorage.getItem('@flows');
        let flowsArray = storedFlows ? JSON.parse(storedFlows) : [];
        let flowIndex = flowsArray.findIndex(f => f.id === flowId);
        if (flowIndex !== -1) {
            flowsArray[flowIndex].pages = updatedPages;
            await AsyncStorage.setItem('@flows', JSON.stringify(flowsArray));
        }
    };

    const updateFlowVariablesInStorage = async (updatedVariables) => {
        const storedFlows = await AsyncStorage.getItem('@flows');
        let flowsArray = storedFlows ? JSON.parse(storedFlows) : [];
        let flowIndex = flowsArray.findIndex(f => f.id === flowId);
        if (flowIndex !== -1) {
            flowsArray[flowIndex].variables = updatedVariables;
            await AsyncStorage.setItem('@flows', JSON.stringify(flowsArray));
        }
    };

    const handleRemoveVariable = (variableId) => {
        const updatedVariables = variables.filter(variable => variable.id !== variableId);
        setVariables(updatedVariables);
        updateFlowVariablesInStorage(updatedVariables);
        saveFlowData({ ...flow, variables: updatedVariables });
    };

    // Handle deleting a page
    const handleDeletePage = (pageId) => {
        const updatedPages = pages.filter(page => page.id !== pageId);
        setPages(updatedPages);
        updateFlowInStorage(updatedPages);
    };

    // Render page item
    const renderItem = ({ item, drag, isActive }) => (
        <Link href={`/flow/${flowId}/page/${item.id}`} asChild>
            <TouchableOpacity
                onLongPress={drag}
                style={{
                    backgroundColor: isActive ? 'blue' : 'grey',
                    padding: 20,
                    margin: 5,
                    borderRadius: 5,
                }}>
                <Text style={{ color: 'white' }}>{item.name}</Text>
                <Button title="Delete" onPress={() => handleDeletePage(item.id)} />
            </TouchableOpacity>
        </Link>
    );


    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 50, marginBottom: 50 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Flow Overview - {flow?.name}</Text>
                <Button title="Add New Page" onPress={handleAddPage} />
                <DraggableFlatList
                    data={pages}
                    renderItem={renderItem}
                    keyExtractor={(item) => `draggable-item-${item.id}`}
                    onDragEnd={({ data }) => setPages(data)}
                />
                <Button title="Settings" onPress={() => setFlowSettingOverlayVisible(true)} />
                <Link href="/" asChild>
                    <Button title="Go back" onPress={() => {}} />
                </Link>
            </View>
            <FlowOverviewSettingsOverlayModal
                visible={flowSettingOverlayVisible}
                onClose={() => setFlowSettingOverlayVisible(false)}
                variables={variables}
                onAddVariable={handleAddVariable}
                onRenameVariable={handleRenameVariable}
                newVariableName={newVariableName}
                setNewVariableName={setNewVariableName}
                handleRemoveVariable={handleRemoveVariable}
            />
        </GestureHandlerRootView>
    );
};

export default FlowOverview
