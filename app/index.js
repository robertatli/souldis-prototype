import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrash, faTree, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons'

import styles from './styles/stylesIndex';


const Home = () => {
    const [flows, setFlows] = useState([]);

    const Spacer = ({ height }) => <View style={{ height }} />;

    useEffect(() => {
        const loadFlows = async () => {
            const storedFlows = await AsyncStorage.getItem('@flows');
            if (storedFlows) {
                setFlows(JSON.parse(storedFlows));
            }
        };
        loadFlows();
    }, []);

    const handleCreateFlow = async () => {
        const newFlow = {
            id: `flow_${uuidv4()}`,
            name: `New Flow ${flows.length + 1}`,
            pages: [],
            variables: []
        };
        const updatedFlows = [...flows, newFlow];
        await AsyncStorage.setItem('@flows', JSON.stringify(updatedFlows));
        setFlows(updatedFlows);
        // Trigger re-rendering by updating the state
    };

    const handleRenameFlowUpdate = async (id, newName) => {
        const updatedFlows = flows.map(flow => {
            if (flow.id === id) {
                return { ...flow, name: newName };
            }
            return flow;
        });
        setFlows(updatedFlows);
    };

    const handleRenameFlow = async (id, newName) => {
        const updatedFlows = flows.map(flow => {
            if (flow.id === id) {
                return { ...flow, name: newName };
            }
            return flow;
        });
        setFlows(updatedFlows);
        await AsyncStorage.setItem('@flows', JSON.stringify(updatedFlows));
    };
    
    const handleDeleteFlow = async (flowId) => {
        const updatedFlows = flows.filter(flow => flow.id !== flowId);
        await AsyncStorage.setItem('@flows', JSON.stringify(updatedFlows));
        setFlows(updatedFlows);
    };

    const FlatListItem = React.memo(({ item, onStartDragging, onEndDragging }) => {
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
        <GestureDetector gesture={pan}>
            <Animated.View style={[animatedStyle]}>
                <Link href={`/flow/${item.id}`} asChild>
                    <TouchableOpacity activeOpacity={1} style={{
                        ...styles.pageDisplay,
                        backgroundColor: "white", // Change background color only for the dragging item
                        shadowColor: "#f0f0f0",
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
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
            onPress={() => handleDeleteFlow(item.id)}>
            <FontAwesomeIcon icon={faTrash} size={32} style={{position: 'relative', top: 14, right: -20, color: 'white'}} />
        </TouchableOpacity>
        </View>
        );
    }, (prevProps, nextProps) => {
        return prevProps.item.id === nextProps.item.id && prevProps.item.name === nextProps.item.name;
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View>
                <TouchableOpacity style={{...styles.modalButton, marginLeft: 20}} onPress={handleCreateFlow}>
                    <Text><FontAwesomeIcon icon={faTree} /> Create New Flow</Text>
                </TouchableOpacity>
                <FlatList
                    data={flows}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => ( <FlatListItem item={item} /> )}
                />
            </View>
        </GestureHandlerRootView>
    );
};

export default Home;
