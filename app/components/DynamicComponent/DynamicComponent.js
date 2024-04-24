import React from 'react';
import { Button, View, Text, TextInput, Switch } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import Checkbox from 'react-native-ui-lib/checkbox'

const DynamicComponent = ({ component, onPress, onLongPress, onPositionChange }) => {
    const positionX = useSharedValue(component.position.x);
    const positionY = useSharedValue(component.position.y);

    const panGesture = Gesture.Pan()
        .onStart((event) => {
            // Store initial positions at the start of the gesture
            positionX.value += event.translationX;
            positionY.value += event.translationY;
        })
        .onUpdate((event) => {
            'worklet'; // Indicates that this block should be executed on the UI thread
            // Update the position by adding the translation since the gesture started
            positionX.value = event.translationX + component.position.x;
            positionY.value = event.translationY + component.position.y;
        })
        .onEnd(() => {
            'worklet';
            // Call the callback to update the position in the parent's state
            runOnJS(onPositionChange)(component.id, { x: positionX.value, y: positionY.value });
        });

    const singleTap = Gesture.Tap()
        .onEnd(() => {
            return runOnJS(onPress)(component);
        });

    const longPressGesture = Gesture.LongPress()
        .onEnd(() => {
            runOnJS(onLongPress)(component.id, component.type);
        });

    const gesture = Gesture.Race(panGesture, singleTap, longPressGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: positionX.value }, { translateY: positionY.value }],
        };
      });

    const renderComponentContent = () => {
        switch (component.type) {
            case 'Button':
                return <Button title={`Button ${component.id}`} onPress={() => {}} />;
            case 'Radio':
                // Additional logic for Radio if needed
                return <Text>Radio {component.id}</Text>;
            case 'Checkbox':
                // Additional logic for Checkbox if needed
                return <Checkbox value={component.checked} onValueChange={() => {}} />;
            case 'Text':
                return <Text>{component.text}</Text>;
            case 'TextInput':
                return <TextInput value={component.value} onChangeText={() => {}} />;
            default:
                return null;
        }
    };

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyle, { padding: 10, backgroundColor: '#eee' }]}>
                {renderComponentContent()}
            </Animated.View>
        </GestureDetector>
    );
};

export default DynamicComponent;
