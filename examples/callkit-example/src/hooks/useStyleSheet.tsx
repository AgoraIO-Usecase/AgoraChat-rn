import {
  type ThemeContextType,
  createStyleSheetP,
  useThemeContext,
} from 'react-native-chat-uikit';

export const useStyleSheet = (): { safe: any } => {
  const styles = createStyleSheetP((theme: ThemeContextType) => {
    const { colors } = theme;
    return {
      safe: { flex: 1, backgroundColor: colors.background },
    };
  }, useThemeContext());
  return styles;
};
