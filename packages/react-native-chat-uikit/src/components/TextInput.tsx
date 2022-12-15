import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import { useThemeContext } from '../contexts/ThemeContext';
import createStyleSheet from '../styles/createStyleSheet';

type TextInputProps = {} & RNTextInputProps;

function TextInput(
  { children, style, editable = true, ...props }: TextInputProps,
  ref: React.LegacyRef<RNTextInput>
) {
  const { colors } = useThemeContext();
  const input = editable ? colors.input.enabled : colors.input.disabled;

  return (
    <RNTextInput
      ref={ref}
      editable={editable}
      selectionColor={input.highlight}
      placeholderTextColor={input.placeholder}
      style={[
        styles.input,
        { color: input.text, backgroundColor: input.background },
        style,
      ]}
      {...props}
    >
      {children}
    </RNTextInput>
  );
}

const styles = createStyleSheet({
  input: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default React.forwardRef<RNTextInput, TextInputProps>(TextInput);
