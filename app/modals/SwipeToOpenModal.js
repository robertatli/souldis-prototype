import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const SwipeToOpenModal = ({ onOpen }) => {
  const translateX = useSharedValue(300); // Start off the screen, adjust if needed

  const swipeGesture = Gesture.Pan()
    .maxPointers(1)
    .minDistance(10)
    .onStart(() => {
      translateX.value = 200; // Start from the right edge of the screen
    })
    .onUpdate((event) => {
      // Ensure it doesn't go past the starting point
      translateX.value = Math.min(event.translationX + 300, 300); 
    })
    .onEnd(() => {
      // Threshold to decide if the gesture should open the modal
      if (translateX.value < 270) {
        runOnJS(onOpen)();
      }
      translateX.value = withSpring(300); // Animate back off the screen
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[styles.triggerArea, animatedStyle]} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  triggerArea: {
    width: 30, // Increased width for better interaction
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Visible for demonstration
    position: 'absolute',
    right: 300,
    zIndex: 999, // Make sure it's above other elements
  }
});

export default SwipeToOpenModal;
