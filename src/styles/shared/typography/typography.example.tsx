import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { typography } from "./typography";

export const TypographyExample = () => {
  return (
    <View style={styles.container}>
      <Text style={typography.h1}>Heading 1</Text>
      <Text style={typography.h2}>Heading 2</Text>
      <Text style={typography.h3}>Heading 3</Text>
      
      <Text style={typography.subtitle1}>Subtitle 1</Text>
      <Text style={typography.subtitle2}>Subtitle 2</Text>
      
      <Text style={typography.body1}>
        Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      
      <Text style={typography.body2}>
        Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
      
      <Text style={typography.button}>Button Text</Text>
      
      <Text style={typography.caption}>Caption Text</Text>
      
      <Text style={typography.overline}>Overline Text</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
}); 