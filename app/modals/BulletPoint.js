import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BulletPoint = ({ text }) => (
  <View style={styles.bulletPointContainer}>
    <Text style={styles.bulletPoint}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Adjust spacing between bullet points
  },
  bulletPoint: {
    width: 10, // Ensure the bullet and text are aligned nicely
    marginRight: 10, // Space between the bullet and the text
  },
  bulletText: {
    flex: 1, // Take the remaining space
    fontSize: 16, // Adjust text size
  },
});

export default BulletPoint;
