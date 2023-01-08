import * as React from 'react';
import {
  Animated,
  LayoutAnimation,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeContext } from '../contexts';
import createStyleSheet from '../styles/createStyleSheet';
import { asyncTask } from '../utils/function';
import type { TextInputProps } from './TextInputEx';
import { default as TextInput } from './TextInputEx';

export type SearchBarProps = Omit<
  TextInputProps,
  | 'leftIconName'
  | 'leftIconContainerStyle'
  | 'rightIconName'
  | 'rightIconContainerStyle'
  | 'rightIconOnPress'
> & {
  enableCancel: boolean;
  enableClear: boolean;
  searchIconStyle?: StyleProp<ViewStyle>;
  clearIconStyle?: StyleProp<ViewStyle>;
  cancel?: {
    buttonName?: string;
    buttonStyle?: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
    onCancel?: () => void;
  };
  onClear?: () => void;
};

function SearchBar(
  props: SearchBarProps,
  ref?: React.Ref<RNTextInput>
): JSX.Element {
  // console.log('test:SearchBar:');
  const { colors } = useThemeContext();
  const {
    containerStyle,
    disabled,
    disabledInputStyle,
    inputContainerStyle,
    inputStyle,
    inputStateColor,
    style,
    enableCancel,
    enableClear,
    searchIconStyle,
    clearIconStyle,
    cancel,
    onClear,
    onBlur,
    onFocus,
    onChangeText,
    value,
    clearButtonMode,
    placeholder,
    ...others
  } = props;

  // const inputRef = React.useRef<RNTextInput>(null);
  // const [_value, setValue] = React.useState('');
  const [hasFocus, setHasFocus] = React.useState(false);
  const [cancelButtonWidth, setCancelButtonWidth] = React.useState(0);
  const [isEmpty, setIsEmpty] = React.useState(
    value?.length === 0 ? true : false
  );

  const _onFocus = (e: any) => {
    setHasFocus(true);
    if (enableCancel) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    // if (onFocus) asyncTask(onFocus, e);
    onFocus?.(e);
  };

  const _onBlur = (e: any) => {
    setHasFocus(false);
    if (enableCancel) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    onBlur?.(e);
    // if (onBlur) asyncTask(onBlur, e);
  };

  const _onChangeText = (text: string) => {
    // console.log('test:_onChangeText:', text);
    onChangeText?.(text);
    setIsEmpty(text.length === 0);
  };

  const _onCancel = (e: any) => {
    _onClear();
    _onBlur(e);
    if (cancel?.onCancel) asyncTask(cancel?.onCancel);
  };

  const _onClear = () => {
    onChangeText?.('');
    setIsEmpty(true);
    onClear?.();
    // if (onClear) asyncTask(onClear);
    // if (onClear) process.nextTick(onClear);
    // inputRef.current?.blur();
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: colors.background },
        containerStyle,
      ])}
    >
      <TextInput
        ref={(instance) => {
          if (instance) {
            if (ref) {
              const s = ref as React.MutableRefObject<RNTextInput>;
              s.current = instance;
            }
            // const s = inputRef as React.MutableRefObject<RNTextInput>;
            // s.current = instance;
          }
        }}
        multiline={false}
        placeholder={placeholder}
        clearButtonMode={clearButtonMode}
        editable={!disabled}
        onFocus={_onFocus}
        onBlur={_onBlur}
        rightIconOnPress={_onClear}
        onChangeText={_onChangeText}
        value={value}
        inputStyle={StyleSheet.flatten([styles.input, inputStyle])}
        containerStyle={{
          paddingHorizontal: 0,
        }}
        inputContainerStyle={StyleSheet.flatten([
          styles.inputContainer,
          enableCancel &&
            hasFocus && {
              marginRight: cancelButtonWidth,
            },
          inputContainerStyle,
        ])}
        leftIconName="search"
        leftIconContainerStyle={StyleSheet.flatten([
          styles.leftIconContainerStyle,
          searchIconStyle,
        ])}
        rightIconName={
          enableClear && isEmpty === false ? 'deleteSearch' : undefined
        }
        rightIconContainerStyle={StyleSheet.flatten([
          styles.rightIconContainerStyle,
          clearIconStyle,
        ])}
        style={[disabled && disabledInputStyle, style]}
        inputStateColor={inputStateColor}
        {...others}
      />

      {enableCancel ? (
        <Animated.View
          style={StyleSheet.flatten([
            styles.cancelButtonContainer,
            {
              opacity: cancelButtonWidth === 0 ? 0 : 1,
              right: hasFocus ? 0 : -cancelButtonWidth,
            },
          ])}
          onLayout={(event) =>
            setCancelButtonWidth(event.nativeEvent.layout.width)
          }
        >
          <Pressable
            accessibilityRole="button"
            onPress={_onCancel}
            disabled={false}
          >
            <View style={StyleSheet.flatten([cancel?.buttonStyle])}>
              <Text
                style={StyleSheet.flatten([
                  styles.buttonTextStyle,
                  cancel?.buttonTextStyle,
                ])}
              >
                {cancel?.buttonName}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    paddingBottom: 2,
    paddingTop: 2,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  input: {
    marginLeft: 0,
    overflow: 'hidden',
  },
  inputContainer: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    borderRadius: 18,
    borderBottomWidth: 0,
    minHeight: 36,
    marginLeft: 0,
    marginRight: 0,
    overflow: 'hidden',
  },
  rightIconContainerStyle: {
    marginRight: 0,
  },
  leftIconContainerStyle: {
    marginLeft: 4,
  },
  buttonTextStyle: {
    color: '#007aff',
    textAlign: 'center',
    padding: 8,
    fontSize: 18,
  },
  cancelButtonContainer: {
    position: 'absolute',
  },
});

export const SearchBarRef = React.forwardRef<RNTextInput, SearchBarProps>(
  SearchBar
);

export default React.memo(SearchBarRef);
