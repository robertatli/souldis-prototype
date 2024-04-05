import React from 'react';
import { Button, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

const ButtonComponent = ({ id, onPress, onLongPress }) => {
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      positionX.value = event.translationX;
      positionY.value = event.translationY;
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
