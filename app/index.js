import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import styles from './styles/stylesIndex';


const Home = () => {
    const [flows, setFlows] = useState([]);

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

    return (
        <View style={styles.flowList}>
            <Button title="Create New Flow" onPress={handleCreateFlow} />
            <FlatList
                data={flows}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Link href={`/flow/${item.id}`} asChild>
                        <TouchableOpacity style={styles.flowName}>
                            <Text style={styles.flowText}>{item.name}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
};

export default Home;
