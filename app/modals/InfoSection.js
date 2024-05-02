import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BulletPoint from './BulletPoint';

const InfoSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Usage Information:</Text>
      <BulletPoint text="While in View mode you can interact with the application as a user." />
      <BulletPoint text="Disables dragging components." />
      <BulletPoint text="Disables editing components." />
      <BulletPoint text="Enables haptic feedback." />
      <BulletPoint text="Enables routing." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20, // Container padding
    width: '100%',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10, // Space below the header
  },
});

export default InfoSection;
