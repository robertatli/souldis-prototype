import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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

    return (
        <View style={styles.flowList}>
            <Button title="Create New Flow" onPress={handleCreateFlow} />
            <FlatList
                data={flows}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Link href={`/flow/${item.id}`} asChild>
                        <TouchableOpacity style={styles.flowName}>
                            <TextInput
                                style={styles.flowText}
                                onChangeText={(text) => handleRenameFlowUpdate(item.id, text)}
                                onEndEditing={(e) => handleRenameFlow(item.id, e.nativeEvent.text)}
                                value={item.name}
                            />
                            <Spacer height={16} />
                            <Button title="Delete" color="red" onPress={() => handleDeleteFlow(item.id)} />
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
};

export default Home;
