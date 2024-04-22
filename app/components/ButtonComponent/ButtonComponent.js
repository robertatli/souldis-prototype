import React from 'react';
import { Button, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';

const ButtonComponent = ({ id, onPress, onLongPress, initialPosition, onPositionChange  }) => {
  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      // Store initial positions at the start of the gesture
      positionX.value += event.translationX;
      positionY.value += event.translationY;
    })
    .onUpdate((event) => {
      // Update the position by adding the translation since the gesture started
      positionX.value = initialPosition.x + event.translationX;
      positionY.value = initialPosition.y + event.translationY;
    })
    .onEnd(() => {
      // Call the callback to update the position in the parent's state
      runOnJS(onPositionChange)(id, { x: positionX.value, y: positionY.value });
    });

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      console.log('Single tap!');
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      console.log('Double tap!');
    });

  const LongPress = Gesture.LongPress()
    .runOnJS(true)
    .onEnd(() => {
      onLongPress(id);
    });

  const gesture = Gesture.Exclusive(panGesture, LongPress, doubleTap, singleTap);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionX.value }, { translateY: positionY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Button title={`Button ${id}`} onPress={() => onPress(id)} />
      </Animated.View>
    </GestureDetector>
  );
};

export default ButtonComponent;
