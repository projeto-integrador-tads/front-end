import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { styles } from "./styles";

interface VerificationCodeProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export function VerificationCode({ 
  value, 
  onChange, 
  length = 6 
}: VerificationCodeProps) {
  const codeArray = value.split('').concat(Array(length - value.length).fill('-'));
  const inputRef = React.useRef<TextInput>(null);

  return (
    <Pressable 
      style={styles.container}
      onPress={() => inputRef.current?.focus()}
    >
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, '');
          if (cleaned.length <= length) {
            onChange(cleaned);
          }
        }}
        keyboardType="number-pad"
        maxLength={length}
      />
      <View style={styles.codeContainer}>
        {codeArray.map((digit, index) => (
          <View key={index} style={styles.codeInput}>
            <Text style={styles.codeText}>{digit}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
} 