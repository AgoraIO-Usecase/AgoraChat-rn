import React from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeContext } from '../contexts';
import createStyleSheet from '../styles/createStyleSheet';
import type { InputStateColor } from '../types';
import { LocalIcon, LocalIconName } from './Icon';

// const renderNode = (Component: any, content: any, defaultProps: any = {}) => {
//   if (content == null || content === false) {
//     return null;
//   }
//   if (React.isValidElement(content)) {
//     return content;
//   }
//   if (typeof content === 'function') {
//     return content();
//   }
//   // Just in case
//   if (content === true) {
//     return <Component {...defaultProps} />;
//   }
//   if (typeof content === 'string') {
//     if (content.length === 0) {
//       return null;
//     }
//     return <Component {...defaultProps}>{content}</Component>;
//   }
//   if (typeof content === 'number') {
//     return <Component {...defaultProps}>{content}</Component>;
//   }
//   return <Component {...defaultProps} {...content} />;
// };

// const renderText = (content: any, defaultProps: any, style: StyleProp<any>) =>
//   renderNode(Text, content, {
//     ...defaultProps,
//     style: StyleSheet.flatten([style, defaultProps?.style]),
//   });

export type TextInputProps = RNTextInputProps & {
  /**
   * Style for container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * disables the input component
   */
  disabled?: boolean;
  /**
   * disabled styles that will be passed to the style props of the React Native TextInput
   */
  disabledInputStyle?: StyleProp<TextStyle>;
  /**
   * styling for Input Component Container
   */
  inputContainerStyle?: StyleProp<ViewStyle>;
  /**
   * displays an icon on the left
   */
  leftIconName?: LocalIconName;
  /**
   * styling for left Icon Component container
   */
  leftIconContainerStyle?: StyleProp<ViewStyle>;
  /**
   * displays an icon on the right
   */
  rightIconName?: LocalIconName;
  /**
   * styling for right Icon Component container
   */
  rightIconContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Called when the right button is pressed.
   */
  rightIconOnPress?: () => void;
  /**
   * Style for Input Component
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Input state colors.
   */
  inputStateColor?: Partial<InputStateColor>;
};

// export interface TextInputProps
//   extends React.ComponentPropsWithRef<typeof RNTextInput> {
//   /**
//    * Style for container
//    */
//   containerStyle?: StyleProp<ViewStyle>;
//   /**
//    * disables the input component
//    */
//   disabled?: boolean;
//   /**
//    * disabled styles that will be passed to the style props of the React Native TextInput
//    */
//   disabledInputStyle?: StyleProp<TextStyle>;
//   /**
//    * styling for Input Component Container
//    */
//   inputContainerStyle?: StyleProp<ViewStyle>;
//   /**
//    * displays an icon on the left
//    */
//   leftIconName?: LocalIconName;
//   /**
//    * styling for left Icon Component container
//    */
//   leftIconContainerStyle?: StyleProp<ViewStyle>;
//   /**
//    * displays an icon on the right
//    */
//   rightIconName?: LocalIconName;
//   /**
//    * styling for right Icon Component container
//    */
//   rightIconContainerStyle?: StyleProp<ViewStyle>;
//   /**
//    * Called when the right button is pressed.
//    */
//   rightIconOnPress?: () => void;
//   /**
//    * Style for Input Component
//    */
//   inputStyle?: StyleProp<TextStyle>;
//   /**
//    * Input state colors.
//    */
//   inputStateColor?: Partial<InputStateColor>;
// }

function TextInputEx(
  props: TextInputProps,
  ref: React.Ref<RNTextInput>
): JSX.Element {
  const { colors } = useThemeContext();
  const {
    containerStyle,
    disabled,
    disabledInputStyle,
    inputContainerStyle,
    leftIconName,
    leftIconContainerStyle,
    rightIconName,
    rightIconContainerStyle,
    rightIconOnPress,
    inputStyle,
    inputStateColor,
    clearButtonMode,
    style,
    ...others
  } = props;

  const getStateColor = (disabled?: boolean) => {
    if (disabled && disabled === true) {
      if (inputStateColor?.disabled) {
        return inputStateColor.disabled;
      }
      return colors.input.disabled;
    }
    if (inputStateColor?.enabled) {
      return inputStateColor.enabled;
    }
    return colors.input.enabled;
  };

  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      <Animated.View
        style={StyleSheet.flatten([
          {
            flexDirection: 'row',
            borderBottomWidth: 1,
            alignItems: 'center',
            // borderColor: getStateColor(disabled).background,
          },
          inputContainerStyle,
        ])}
      >
        {leftIconName && (
          <View
            style={StyleSheet.flatten([
              styles.iconContainer,
              leftIconContainerStyle,
            ])}
          >
            <LocalIcon name={leftIconName} color="#999999" />
          </View>
        )}

        <RNTextInput
          ref={ref}
          clearButtonMode={clearButtonMode ? 'never' : 'never'}
          underlineColorAndroid="transparent"
          editable={!disabled}
          selectionColor={getStateColor(disabled).highlight}
          placeholderTextColor={getStateColor(disabled).placeholder}
          style={StyleSheet.flatten([
            {
              color: getStateColor(disabled).text,
              backgroundColor: getStateColor(disabled).background,
              fontSize: 18,
              flex: 1,
              minHeight: 40,
            },
            inputStyle,
            disabled && styles.disabledInput,
            disabled && disabledInputStyle,
            style,
          ])}
          {...others}
        />

        {rightIconName && (
          <Pressable
            style={StyleSheet.flatten([
              styles.iconContainer,
              rightIconContainerStyle,
            ])}
            onPress={rightIconOnPress}
          >
            <LocalIcon name={rightIconName} color="#999999" />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  disabledInput: {
    opacity: 0.5,
  },
  iconContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 4,
    paddingLeft: 4,
    marginVertical: 4,
  },
});

export default React.forwardRef<RNTextInput, TextInputProps>(TextInputEx);
