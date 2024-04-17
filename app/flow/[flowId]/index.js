import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, Link } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import styles from '../../styles/stylesIndex';

const FlowOverview = () => {
    const { flowId } = useLocalSearchParams();
    const [pages, setPages] = useState([]);
    const [flow, setFlow] = useState(null);

    // Load the flow data from storage
    useEffect(() => {
        const loadFlowData = async () => {
            const flows = await AsyncStorage.getItem('@flows');
            const flowsArray = flows ? JSON.parse(flows) : [];
            const currentFlow = flowsArray.find(f => f.id === flowId);
            if (currentFlow) {
                setFlow(currentFlow);
                setPages(currentFlow.pages);
            }
        };
        loadFlowData();
    }, [flowId]);

    // Add a new page
    const handleAddPage = () => {
        const newPage = {
            id: `page_${Date.now()}`,
            name: `New Page ${pages.length + 1}`,
            components: []
        };
        const updatedPages = [...pages, newPage];
        setPages(updatedPages);
        updateFlowInStorage(updatedPages);
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
                <Link href="/" asChild>
                    <Button title="Go back" onPress={() => {}} />
                </Link>
            </View>
        </GestureHandlerRootView>
    );
};

export default FlowOverview
