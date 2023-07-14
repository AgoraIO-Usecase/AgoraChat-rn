import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { LocalIcon, LocalIconName } from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';

const AVATAR_ASSETS = [
  'agora_avatar_1',
  'agora_avatar_2',
  'agora_avatar_3',
  'agora_avatar_4',
  'agora_avatar_5',
  'agora_avatar_6',
  'agora_avatar_7',
  'agora_avatar_8',
  'agora_avatar_9',
  'agora_avatar_10',
  'agora_avatar_11',
  'agora_avatar_12',
];

export default function TestAvatarPreviewList(): JSX.Element {
  const { width } = useWindowDimensions();
  const getSize = () => {
    return width / 2;
  };
  const getItemSize = getSize() * 0.9;
  const getSpaceSize = getSize() * 0.1;
  const [selected, setSelected] = React.useState<number | undefined>(undefined);
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}
    >
      <View
        style={{
          flex: 1,
          marginVertical: getSpaceSize,
          backgroundColor: 'black',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'space-between',
          justifyContent: 'space-evenly',
          height: (AVATAR_ASSETS.length / 2) * getSize() * 0.95,
        }}
      >
        {AVATAR_ASSETS.map((_, index) => {
          return (
            <View
              style={{
                width: getItemSize,
                height: getItemSize,
                // backgroundColor: 'yellow',
                borderRadius: 8,
                overflow: 'hidden',
              }}
              onTouchEnd={() => {
                setSelected(index);
              }}
            >
              <LocalIcon
                name={AVATAR_ASSETS[index] as LocalIconName}
                size={getItemSize}
              />
              {selected === index ? (
                <LocalIcon
                  containerStyle={{
                    position: 'absolute',
                  }}
                  name={'avatar_selected'}
                  size={getItemSize}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
