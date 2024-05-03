import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useLocalSearchParams, Link, router } from 'expo-router';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrash, faTree, faGear, faChevronLeft, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons'


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
    const FlatListItem = React.memo(({ item, index, drag, isActive }) => {
        const [localName, setLocalName] = useState(item.name);

        useEffect(() => {
            setLocalName(item.name);
        }, [item.name]);
    
        const handleLocalChange = (text) => {
            setLocalName(text);
        };
    
        const handleLocalEndEditing = () => {
            handleRenameFlow(item.id, localName);
        };

        const startX = useSharedValue(0);
        const dragX = useSharedValue(0);

        const pan = Gesture.Pan()
            .activeOffsetX([-10, 10]) // Horizontal activation window
            .failOffsetY([-15, 15]) // Vertical fail window, increase if needed
            .onStart(() => {
                dragX.value = startX.value; // Start from the last known position
            })
            .onUpdate((event) => {
                const proposedX = startX.value + event.translationX;

                if (Math.abs(event.translationX) < Math.abs(event.translationY)) {
                    // If vertical movement is predominant, do not update horizontal position
                    return;
                }

                // Update the horizontal position only if it's a valid horizontal move
                if (proposedX < 0 && proposedX > -100) {
                    dragX.value = proposedX;
                }
            })
            .onEnd(() => {
                // Snap to either closed or open position
                if (dragX.value < -35) { // Halfway threshold to decide if it snaps open or closes
                    dragX.value = withTiming(-90);
                    startX.value = -90;
                } else {
                    dragX.value = withTiming(0);
                    startX.value = 0;
                }
            });

        const combinedGesture = Gesture.Race(pan);
        
        const animatedStyle = useAnimatedStyle(() => {
            const backgroundColor = interpolateColor(
                dragX.value,
                [-70, 0],
                ['#f8f8f8', 'white']
            );
            
            return {
                backgroundColor,
                transform: [{ translateX: dragX.value }],
            };
        });


        return (
        <View>
        <GestureDetector gesture={combinedGesture}>
            <Animated.View style={[animatedStyle]}>
                <Link href={`/flow/${flowId}/page/${item.id}`} asChild>
                    <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={drag}
                        style={{
                            ...styles.pageDisplay,
                            backgroundColor: isActive ? "#f0f0f0" : "white",
                            shadowColor: isActive ? "#f0f0f0" : "#f0f0f0",
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            marginBottom: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        >
                        <TextInput
                            style={{
                                ...styles.flowText, 
                                color: 'black', 
                                marginLeft: 20, 
                                fontSize: 18,
                            }}
                            onChangeText={(text) => handleLocalChange(text)}
                            onEndEditing={(e) => handleLocalEndEditing()}
                            value={localName}
                        />
                        <FontAwesomeIcon icon={faGripLinesVertical} size={48} style={{
                                zIndex: 200,
                                alignSelf: 'center',
                                color: '#f0f0f0',
                                }} />
                    </TouchableOpacity>
                </Link>
            </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={{ // This is the delete button
            ...styles.modalButtonClose, 
            maxWidth:120, 
            height: 90, 
            alignContent: 'center', 
            paddingVertical: 14, 
            position: 'absolute',  
            right: 0,
            zIndex: -1,
            backgroundColor: 'red',
            borderColor: 'red',
            }} 
            onPress={() => handleDeletePage(item.id)}>
            <FontAwesomeIcon icon={faTrash} size={32} style={{position: 'relative', top: 14, right: -20, color: 'white'}} />
        </TouchableOpacity>
        </View>
        );
    }, (prevProps, nextProps) => {
        return prevProps.item.id === nextProps.item.id && prevProps.item.name === nextProps.item.name;
    });

    const Spacer = ({ height }) => <View style={{ height }} />;
    const FlexSpacer = () => <View style={{ flex: 1 }} />;


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Spacer height={32} />
                <Text style={styles.modalTitle}>Flow Overview - {flow?.name}</Text>
                <TouchableOpacity 
                    style={{
                        ...styles.modalButton, 
                        marginLeft: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} 
                    onPress={handleAddPage}>
                    <FontAwesomeIcon icon={faTree} size={18} style={{
                        float: 'left',
                        zIndex: 200,
                        alignSelf: 'flex-start',}} />
                    <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Add New Page</Text>
                </TouchableOpacity>
                <DraggableFlatList
                    style={{ height: '83%', maxHeight: '83%' }}
                    data={pages}
                    renderItem={({ item, index, drag, isActive }) => (
                        <FlatListItem 
                            item={item} 
                            index={index} 
                            drag={drag} 
                            isActive={isActive}
                        />
                    )}
                    keyExtractor={(item) => `draggable-item-${item.id}`}
                    onDragEnd={({ data }) => setPages(data)}
                />
                {/* <TouchableOpacity style={{...styles.modalButton, position: 'absolute', bottom: 50, marginLeft: 20}} onPress={() => setFlowSettingOverlayVisible(true)}>
                    <Text><FontAwesomeIcon icon={faGear} /> Flow Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.modalButtonClose, position: 'absolute', bottom: 0, marginLeft: 20}} onPress={() => router.push({ pathname: `/` }) }>
                    <Text style={styles.whitetext}><FontAwesomeIcon icon={faChevronLeft} style={{color: 'white'}}/> Go Back</Text>
                </TouchableOpacity> */}
                <View style={{ flex: 1, position: 'relative' }}>
                <TouchableOpacity 
                    style={{
                        ...styles.modalButton, 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 20,  // Positioned on the left side
                        width: '40%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} 
                    onPress={() => setFlowSettingOverlayVisible(true)}
                >
                    <FontAwesomeIcon icon={faGear} size={18} style={{
                        float: 'left',
                        zIndex: 200,
                        alignSelf: 'flex-start',}} />
                    <Text style={{fontSize: 14, alignSelf: 'flex-end'}}> Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{
                        ...styles.modalButtonClose, 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 20,  // Positioned on the left side
                        width: '40%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} 
                    onPress={() => router.push({ pathname: `/` })}
                >
                <FontAwesomeIcon icon={faChevronLeft} size={18} style={{
                    float: 'left',
                    color: 'white',
                    zIndex: 200,
                    alignSelf: 'flex-start',
                    }} />
                <Text style={{...styles.whitetext, fontSize: 14, alignSelf: 'flex-end'}}> Go Back</Text>
                </TouchableOpacity>
                </View>
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
