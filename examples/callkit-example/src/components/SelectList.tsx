import * as React from 'react';
import {
  type ListRenderItemInfo,
  FlatList,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { RadioButton, SearchBar } from 'react-native-chat-uikit';

import { useAppChatSdkContext } from '../contexts/AppImSdkContext';

type DataType = {
  userId: string;
  userName?: string;
  isSelected?: boolean;
  enable?: boolean;
  onChecked?: ((checked: boolean) => boolean) | undefined;
};
const FlatListRenderItem = (
  info: ListRenderItemInfo<DataType>
): React.ReactElement | null => {
  const { item } = info;
  return (
    <View
      style={{
        height: 40,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 20,
        justifyContent: 'center',
        marginVertical: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18 }}>{item.userId}</Text>
        <RadioButton
          checked={item.isSelected}
          disabled={item.enable === false ? true : undefined}
          disabledColor={item.enable === false ? '#dcdcdc' : undefined}
          onChecked={item.onChecked}
        />
      </View>
    </View>
  );
};

type SelectListProps = {
  selectedIds: string[];
  maxCount: number;
  onChangeCount?: (count: number) => void;
  onAddedIds?: (ids: string[]) => void;
};
export function SelectList(props: SelectListProps): JSX.Element {
  console.log('test:SelectList:', props);
  const { selectedIds, maxCount, onChangeCount, onAddedIds } = props;
  const { client } = useAppChatSdkContext();
  const data = React.useMemo(() => [] as DataType[], []);
  const [_data, setData] = React.useState(data);
  const enableClear = true;
  const enableCancel = false;
  let inputRef = React.useRef<RNTextInput>(null);
  const selectedCount = React.useRef(selectedIds.length);

  const onChangeSelected = React.useCallback(
    (selectedIds: string[]) => {
      const r = [] as string[];
      for (const d of data) {
        if (d.isSelected === true) {
          let existed = false;
          for (const id of selectedIds) {
            if (d.userId === id) {
              existed = true;
              break;
            }
          }
          if (existed === false) {
            r.push(d.userId);
          }
        }
      }
      onAddedIds?.(r);
    },
    [data, onAddedIds]
  );

  const init = React.useCallback(() => {
    client.contactManager
      .getAllContactsFromServer()
      .then((result) => {
        data.length = 0;
        for (const i of result) {
          const user = {
            userId: i,
            userName: i,
            onChecked: (checked: boolean) => {
              if (checked === true) {
                // TODO: to add.
                if (selectedCount.current < maxCount) {
                  ++selectedCount.current;
                  user.isSelected = checked;
                  onChangeCount?.(selectedCount.current);
                  onChangeSelected(selectedIds);
                  return true;
                } else {
                  return false;
                }
              } else {
                // TODO: to del.
                if (selectedCount.current > 0) {
                  --selectedCount.current;
                  user.isSelected = checked;
                  onChangeCount?.(selectedCount.current);
                  onChangeSelected(selectedIds);
                  return true;
                } else {
                  return false;
                }
              }
            },
          } as DataType;
          data.push(user);
        }
        for (const d of data) {
          for (const id of selectedIds) {
            if (d.userId === id) {
              d.enable = false;
              d.isSelected = true;
            }
          }
        }
        setData([...data]);
      })
      .catch((error) => {
        console.warn('SelectList:init:error:', error);
      });
    return () => {};
  }, [
    client.contactManager,
    data,
    maxCount,
    onChangeCount,
    onChangeSelected,
    selectedIds,
  ]);

  const execClear = () => {
    inputRef.current?.blur();
    inputRef.current?.clear();
    setData([...data]);
  };

  const execSearch = (keyword: string) => {
    const r = [] as DataType[];
    for (const d of data) {
      if (d.userId.includes(keyword)) {
        r.push(d);
      }
    }
    setData([...r]);
  };

  React.useEffect(() => {
    const ret = init();
    return () => {
      ret();
    };
  }, [init]);

  return (
    <View>
      <SearchBar
        ref={inputRef}
        enableCancel={enableCancel}
        enableClear={enableClear}
        inputContainerStyle={{
          backgroundColor: 'rgba(242, 242, 242, 1)',
          borderRadius: 24,
        }}
        onChangeText={() => {}}
        onClear={execClear}
        returnKeyType="search"
        onSubmitEditing={(event) => {
          const c = event.nativeEvent.text;
          execSearch(c);
        }}
      />
      <FlatList
        data={_data}
        extraData={_data}
        renderItem={FlatListRenderItem}
      />
    </View>
  );
}

export const SelectListMemo = React.memo(SelectList);
