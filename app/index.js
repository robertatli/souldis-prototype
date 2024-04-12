import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

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
            id: `flow_${Date.now()}`,
            name: `New Flow ${flows.length + 1}`,
            pages: []
        };
        const updatedFlows = [...flows, newFlow];
        await AsyncStorage.setItem('@flows', JSON.stringify(updatedFlows));
        setFlows(updatedFlows);
        // Trigger re-rendering by updating the state
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Create New Flow" onPress={handleCreateFlow} />
            <FlatList
                data={flows}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Link href={`/flow/${item.id}`} asChild>
                        <TouchableOpacity>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
};

export default Home;
