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
    backgroundColor: Colors.disclaimerBg,
    borderTopWidth: 0.5,
    borderTopColor: Colors.disclaimerBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  text: {
    color: Colors.disclaimerText,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
