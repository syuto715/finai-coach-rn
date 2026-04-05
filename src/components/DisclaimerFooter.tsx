import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Strings } from '../constants/strings';

export function DisclaimerFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{Strings.disclaimerFooter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  text: {
    color: Colors.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
