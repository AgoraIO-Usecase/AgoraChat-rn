import * as React from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import { createStyleSheet, SearchBar } from 'react-native-chat-uikit';

import { useAppI18nContext } from '../contexts/AppI18nContext';

export interface ListSearchHeaderProps {
  autoFocus: boolean;
  onChangeText?: (text: string) => void;
}
export const ListSearchHeader = (props: ListSearchHeaderProps) => {
  const { search } = useAppI18nContext();
  const searchRef = React.useRef<RNTextInput>(null);
  const [searchValue, setSearchValue] = React.useState('');
  const enableCancel = false;
  const enableClear = true;
  const autoFocus = props.autoFocus;
  return (
    <View style={styles.container}>
      <SearchBar
        ref={searchRef}
        autoFocus={autoFocus}
        enableCancel={enableCancel}
        enableClear={enableClear}
        placeholder={search.placeholder}
        onChangeText={(text) => {
          setSearchValue(text);
          props.onChangeText?.(text);
        }}
        value={searchValue}
        onClear={() => {
          setSearchValue('');
        }}
      />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    // backgroundColor: 'red',
    height: 36,
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});
