import React from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal as RNModal,
  ModalProps as RNModalProps,
  PanResponder,
  PanResponderInstance,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';

import createStyleSheet from '../styles/createStyleSheet';
import useTheme from '../theme/useTheme';
import defaultHeaderHeight from '../utils/defaultHeaderHeight';

type ModalProps = {
  type?: 'slide' | 'fade';
  onClose: () => void;
  backgroundStyle?: StyleProp<ViewStyle>;
  disableBackgroundClose?: boolean;
  enableKeyboardAvoid?: boolean;
} & Omit<RNModalProps, 'animationType' | 'onRequestClose'>;

const useModalPanResponder = (
  type: 'slide' | 'fade',
  translateY: Animated.Value,
  show: () => void,
  hide: () => void
): PanResponderInstance => {
  const isHideGesture = React.useCallback(
    (distanceY: number, velocityY: number) => {
      return distanceY > 125 || (distanceY > 0 && velocityY > 0.1);
    },
    []
  );
  const r = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy }) => dy > 8,
      onPanResponderGrant: (_, __) =>
        // @ts-ignore
        translateY.setOffset(translateY.__getValue()),
      onPanResponderMove: (_, { dy }) => dy >= 0 && translateY.setValue(dy), // Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) hide();
        else show();
      },
    })
  ).current;
  if (type === 'fade') return { panHandlers: {} };
  else return r;
};

/**
 * Use custom animations.
 * Custom animation has two features:
 *  1. It can control the animation speed and
 *  2. It can prevent fast interaction.
 * For example, if the total length of the animation is 1 second, no interaction can be performed within 1 second.
 * @param type animate type
 * @returns animate object
 */
const useModalAnimation = (type: 'slide' | 'fade') => {
  const initialY = type === 'slide' ? Dimensions.get('window').height : 0;
  const baseAnimBackground = React.useRef(new Animated.Value(0)).current;
  const baseAnimContent = React.useRef(new Animated.Value(initialY)).current;

  const content = {
    opacity: baseAnimBackground.interpolate({
      inputRange: [0, 1],
      outputRange: [type === 'slide' ? 1 : 0, 1],
    }),
    translateY: baseAnimContent,
  };
  const backdrop = {
    opacity: baseAnimBackground.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const createTransition = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(baseAnimBackground, { toValue, ...config }),
      Animated.timing(baseAnimContent, {
        toValue: toValue === 0 ? initialY : 0,
        ...config,
      }),
    ]).start;
  };
  return {
    content,
    backdrop,
    showTransition: createTransition(1),
    hideTransition: createTransition(0),
  };
};

// NOTE: onDismiss is supports iOS only
const useOnDismiss = (visible: boolean, onDismiss?: () => void) => {
  const prevVisible = usePrevProp(visible);
  React.useEffect(() => {
    if (Platform.OS === 'ios') return;
    if (prevVisible && !visible) onDismiss?.();
  }, [onDismiss, prevVisible, visible]);
};

const usePrevProp = <T,>(prop: T) => {
  const prev = React.useRef(prop);
  const curr = React.useRef(prop);
  React.useEffect(() => {
    prev.current = curr.current;
    curr.current = prop;
  });
  return prev.current;
};

/**
 * Modal Open: Triggered by Modal.props.visible state changed to true
 * - visible true -> modalVisible true -> animation start
 *
 * Modal Close: Triggered by Modal.props.onClose() call
 * - Modal.props.onClose() -> visible false -> animation start -> modalVisible false
 * */
export default function Modal({
  children,
  onClose,
  backgroundStyle,
  onDismiss,
  type = 'fade',
  visible = false,
  disableBackgroundClose = false,
  enableKeyboardAvoid = false,
  statusBarTranslucent,
  ...props
}: ModalProps): JSX.Element {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const defaultHeight = defaultHeaderHeight(width > height);
  const [modalVisible, setModalVisible] = React.useState(false);
  const { content, backdrop, showTransition, hideTransition } =
    useModalAnimation(type);
  const panResponder = useModalPanResponder(
    type,
    content.translateY,
    showTransition,
    onClose
  );

  React.useEffect(() => {
    if (visible) setModalVisible(true);
    else hideTransition((_) => setModalVisible(false));
  }, [hideTransition, visible]);

  useOnDismiss(modalVisible, onDismiss);

  return (
    <RNModal
      transparent
      hardwareAccelerated
      visible={modalVisible}
      onRequestClose={onClose}
      onShow={() => showTransition()}
      onDismiss={onDismiss}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      animationType="none"
      {...props}
    >
      <TouchableWithoutFeedback
        onPress={disableBackgroundClose ? undefined : onClose}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: backdrop.opacity, backgroundColor: colors.background },
          ]}
        />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        // NOTE: This is trick for Android.
        //  When orientation is changed on Android, the offset that to avoid soft-keyboard is not updated normally.
        key={`${width}-${height}`}
        enabled={enableKeyboardAvoid}
        style={styles.background}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        pointerEvents="box-none"
        keyboardVerticalOffset={
          enableKeyboardAvoid && statusBarTranslucent ? -defaultHeight : 0
        }
      >
        <Animated.View
          style={[
            styles.background,
            backgroundStyle,
            {
              opacity: content.opacity,
              transform: [{ translateY: content.translateY }],
            },
          ]}
          pointerEvents="box-none"
          {...panResponder.panHandlers}
        >
          <Pressable
          // NOTE: https://github.com/facebook/react-native/issues/14295
          //  Due to 'Pressable', the width of the children must be explicitly specified as a number.
          >
            {children}
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = createStyleSheet({
  background: { flex: 1 },
});
