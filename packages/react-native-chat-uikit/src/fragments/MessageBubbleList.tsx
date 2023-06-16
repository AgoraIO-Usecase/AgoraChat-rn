import * as React from 'react';
import {
  DeviceEventEmitter,
  // DeviceEventEmitter,
  Image as RNImage,
  ListRenderItem,
  ListRenderItemInfo,
  Pressable,
  StyleProp,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {
  ChatDownloadStatus,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';
import FastImage from 'react-native-fast-image';

import { DefaultAvatar } from '../components/DefaultAvatars';
import DynamicHeightList, {
  type DynamicHeightListRef,
} from '../components/DynamicHeightList';
import {
  LocalIcon,
  type LocalIconName,
  localLocalIcon,
} from '../components/Icon';
// import { IconSize } from '../components/Icon/LocalIcon';
import Image from '../components/Image';
import Loading from '../components/Loading';
import SimulateGif from '../components/SimulateGif';
import { Services } from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import createStyleSheet from '../styles/createStyleSheet';
import { messageTimeForChat } from '../utils/format';
import { wait } from '../utils/function';
import { seqId } from '../utils/generator';
import type { MessageItemStateType } from './types';
// import {
//   type DynamicHeightListRef,
//   type LocalIconName,
//   createStyleSheet,
//   // DataEventType,
//   DefaultAvatar,
//   DynamicHeightList,
//   getScaleFactor,
//   Image,
//   Loading,
//   LocalIcon,
//   wait,
// } from 'react-native-chat-uikit';

export interface MessageItemType {
  sender: string;
  timestamp: number;
  isSender?: boolean;
  key: string;
  msgId: string;
  type: ChatMessageType;
  state?: MessageItemStateType;
  onPress?: (data: MessageItemType) => void;
  onLongPress?: (data: MessageItemType) => void;
  ext?: any;
  isTip?: boolean;
}

export interface TextMessageItemType extends MessageItemType {
  text: string;
}

export interface ImageMessageItemType extends FileMessageItemType {
  localThumbPath?: string;
  remoteThumbPath?: string;
  width?: number;
  height?: number;
}
export interface VoiceMessageItemType extends FileMessageItemType {
  duration: number;
}
export interface CustomMessageItemType extends MessageItemType {
  // SubComponent: (props: React.PropsWithChildren<any>) => React.ReactElement;
  SubComponent: React.FunctionComponent<
    MessageItemType & { eventType: string; data: any }
  >;
  SubComponentProps: MessageItemType & { eventType: string; data: any };
}
export interface VideoMessageItemType extends FileMessageItemType {
  duration: number;
  thumbnailLocalPath?: string;
  thumbnailRemoteUrl?: string;
  width?: number;
  height?: number;
}
export interface LocationMessageItemType extends MessageItemType {
  address: string;
  latitude: string;
  longitude: string;
}
export interface FileMessageItemType extends MessageItemType {
  localPath: string;
  remoteUrl: string;
  fileSize?: number;
  displayName?: string;
  fileStatus: ChatDownloadStatus;
}

export const convertState = (state?: MessageItemStateType): LocalIconName => {
  let r = 'sent' as LocalIconName;
  switch (state) {
    case 'arrived':
      r = 'read';
      break;
    case 'failed':
      r = 'ex_mark';
      break;
    case 'sending':
      r = 'loading2';
      break;
    default:
      break;
  }
  return r;
};

export const StateLabel = React.memo(
  ({ state }: { state?: MessageItemStateType }) => {
    const sf = getScaleFactor();
    if (state === 'sending') {
      return <Loading name={convertState(state)} size={sf(12)} />;
    } else {
      return <LocalIcon name={convertState(state)} size={sf(12)} />;
    }
  }
);

export async function getImageExistedPath(
  msg: ImageMessageItemType
): Promise<string | undefined> {
  let isExisted = false;
  let ret: string | undefined;

  if (msg.localThumbPath && msg.localThumbPath.length > 0) {
    isExisted = await Services.ms.isExistedFile(msg.localThumbPath);
    if (isExisted === true) {
      ret = msg.localThumbPath;
    }
  }
  if (isExisted === false) {
    if (msg.localPath && msg.localPath.length > 0) {
      isExisted = await Services.ms.isExistedFile(msg.localPath);
      if (isExisted === true) {
        ret = msg.localPath;
      }
    }
  }
  return ret;
}

export function getImageInfo(
  msg: ImageMessageItemType,
  onResult: (params: { width?: number; height?: number; error?: any }) => void
): void {
  getImageExistedPath(msg)
    .then((ret) => {
      if (ret) {
        RNImage.getSize(
          ret,
          (width: number, height: number) => {
            onResult({ width, height });
          },
          (error: any) => {
            onResult({ error });
          }
        );
      } else {
        onResult({ error: 'local file is not existed.' });
      }
    })
    .catch((error) => {
      onResult({ error });
    });
}

const RenderRecallMessage = (props: MessageItemType): JSX.Element => {
  const { state, ext, ...others } = props;
  if (state === ('' as any)) console.log(others);
  if (state === 'recalled') {
    const tip = ext.recall.tip;
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>{tip}</Text>
      </View>
    );
  }
  return <View />;
};

const TextMessageRenderItemDefault: ListRenderItem<MessageItemType> =
  React.memo(
    (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
      const sf = getScaleFactor();
      const { width: screenWidth } = useWindowDimensions();
      const { item } = info;
      const msg = item as TextMessageItemType;
      if (item.state === 'recalled') {
        return <RenderRecallMessage {...item} />;
      }
      return (
        <View
          style={[
            styles.container,
            {
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              maxWidth: screenWidth * 0.9,
            },
          ]}
        >
          <View
            style={[
              {
                marginRight: msg.isSender ? undefined : sf(10),
                marginLeft: msg.isSender ? sf(10) : undefined,
              },
            ]}
          >
            <DefaultAvatar id={msg.sender} size={sf(24)} radius={sf(12)} />
          </View>
          <View
            style={[
              styles.innerContainer,
              {
                borderBottomRightRadius: msg.isSender ? undefined : sf(12),
                borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
                maxWidth: screenWidth * 0.7,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
                  color: msg.isSender ? 'white' : '#333333',
                },
              ]}
            >
              {msg.text}
            </Text>
          </View>
          <View
            style={[
              {
                marginRight: msg.isSender ? sf(10) : undefined,
                marginLeft: msg.isSender ? undefined : sf(10),
                opacity: 1,
              },
            ]}
          >
            <StateLabel state={msg.state} />
          </View>
        </View>
      );
    }
  );

export const FileMessageRenderItemDefault: ListRenderItem<MessageItemType> =
  React.memo(
    (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
      const sf = getScaleFactor();
      const { width: screenWidth } = useWindowDimensions();
      const { item } = info;
      const msg = item as FileMessageItemType;
      if (item.state === 'recalled') {
        return <RenderRecallMessage {...item} />;
      }

      return (
        <View
          style={[
            styles.container,
            {
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              maxWidth: screenWidth * 0.9,
            },
          ]}
        >
          <View
            style={[
              {
                marginRight: msg.isSender ? undefined : sf(10),
                marginLeft: msg.isSender ? sf(10) : undefined,
              },
            ]}
          >
            <DefaultAvatar id={msg.sender} size={sf(24)} radius={sf(12)} />
          </View>
          <View
            style={[
              styles.innerContainer,
              {
                borderBottomRightRadius: msg.isSender ? undefined : sf(12),
                borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
                maxWidth: screenWidth * 0.7,
              },
            ]}
          >
            <View style={styles.file}>
              {msg.isSender ? (
                <View>
                  <Image
                    source={localLocalIcon('file_doc')}
                    style={{ height: 36, width: 36 }}
                  />
                </View>
              ) : null}
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      fontSize: sf(15),
                      fontWeight: '600',
                      lineHeight: sf(22),
                      color: '#333333',
                      maxWidth: screenWidth * 0.6,
                    },
                  ]}
                >
                  {msg.displayName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      fontSize: sf(12),
                      fontWeight: '400',
                      lineHeight: sf(20),
                      color: '#666666',
                      maxWidth: screenWidth * 0.6,
                    },
                  ]}
                >
                  {msg.fileSize}
                </Text>
              </View>

              {msg.isSender ? null : (
                <View>
                  <Image
                    source={localLocalIcon('file_doc')}
                    style={{ height: 36, width: 36 }}
                  />
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              {
                marginRight: msg.isSender ? sf(10) : undefined,
                marginLeft: msg.isSender ? undefined : sf(10),
                opacity: 1,
              },
            ]}
          >
            <StateLabel state={msg.state} />
          </View>
        </View>
      );
    }
  );

// const gph: number = localLocalIcon('img_ph', IconSize.ICON_MAX);
// const gphb: number = localLocalIcon('img_xmark', IconSize.ICON_MAX);

const ImageMessageRenderItemDefault: ListRenderItem<MessageItemType> =
  React.memo(
    (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
      const sf = getScaleFactor();
      const { item } = info;
      const msg = item as ImageMessageItemType;
      const { width: wWidth } = useWindowDimensions();
      const [width, setWidth] = React.useState(wWidth * 0.6);
      const [height, setHeight] = React.useState((wWidth * 0.6 * 4) / 3);
      // const [ph, setPh] = React.useState(gph);
      // const count = React.useRef(0);
      const isFastImage = true;

      const updateUrl = (url: string) => {
        let r = url;
        if (
          r.startsWith('http://') === false &&
          r.startsWith('https://') === false
        ) {
          if (r.length > 0) {
            r = r.includes('file://') ? r : `file://${r}`;
          }
        }
        return r;
      };
      const url = (msg: ImageMessageItemType) => {
        let r: string;
        if (
          msg.isSender === false &&
          msg.remoteThumbPath &&
          msg.remoteThumbPath.length > 0
        ) {
          return msg.remoteThumbPath;
        }
        if (msg.localThumbPath && msg.localThumbPath.length > 0) {
          r = msg.localThumbPath;
        } else if (msg.remoteThumbPath && msg.remoteThumbPath.length > 0) {
          r = msg.remoteThumbPath;
        } else if (msg.localPath && msg.localPath.length > 0) {
          r = msg.localPath;
        } else {
          r = msg.remoteUrl ?? '';
        }
        return updateUrl(r);
      };
      const urlAsync = async (msg: ImageMessageItemType) => {
        return getImageExistedPath(msg);
      };

      const [_url, setUrl] = React.useState(url(msg));

      const checked = React.useCallback((msg: ImageMessageItemType) => {
        setTimeout(async () => {
          const ret = await urlAsync(msg);
          if (ret) {
            setUrl(updateUrl(ret));
          }
        }, 3000);
      }, []);

      const hw = (params: {
        height: number;
        width: number;
      }): { width: number; height: number } => {
        const { height, width } = params;
        let ret = params;
        if (width / height >= 10) {
          const w = wWidth * 0.6;
          ret = {
            width: w,
            height: w * 0.1,
          };
        } else if (width * 4 >= 3 * height) {
          const w = wWidth * 0.6;
          ret = {
            width: w,
            height: w * (height / width),
          };
        } else if (width * 10 >= 1 * height) {
          const h = (wWidth * 0.6 * 4) / 3;
          ret = {
            width: (width / height) * h,
            height: h,
          };
        } else {
          // width / height < 1 / 10
          console.log('test:10:', width, height);
          const h = (wWidth * 0.6 * 4) / 3;
          ret = {
            width: 0.1 * h,
            height: h,
          };
        }
        return ret;
      };

      if (item.state === 'recalled') {
        return <RenderRecallMessage {...item} />;
      }

      return (
        <View
          style={[
            styles.container,
            {
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              // maxWidth: '80%',
            },
          ]}
        >
          <View
            style={[
              {
                marginRight: msg.isSender ? undefined : sf(10),
                marginLeft: msg.isSender ? sf(10) : undefined,
              },
            ]}
          >
            <DefaultAvatar id={msg.sender} size={sf(24)} radius={sf(12)} />
          </View>
          <View>
            {isFastImage ? (
              <FastImage
                style={{ height: height, width: width, borderRadius: 10 }}
                source={
                  _url.length === 0
                    ? 0
                    : {
                        uri: _url,
                      }
                }
                resizeMode={FastImage.resizeMode.cover}
                onLoad={(e) => {
                  console.log('test:onLoad:', e.nativeEvent);
                  const ret = hw(e.nativeEvent);
                  setHeight(ret.height);
                  setWidth(ret.width);
                }}
                onError={() => {
                  console.log('test:onError:');
                  setUrl('');
                  checked(msg);
                }}
              />
            ) : (
              <RNImage
                source={
                  _url.length === 0
                    ? 0
                    : {
                        uri: _url,
                      }
                }
                resizeMode="contain"
                resizeMethod="scale"
                style={{ height: height, width: width, borderRadius: 10 }}
                onLoad={(e) => {
                  console.log('test:onLoad:', e.nativeEvent);
                  const ret = hw(e.nativeEvent.source);
                  setHeight(ret.height);
                  setWidth(ret.width);
                }}
                onError={() => {
                  console.log('test:onError:');
                  setUrl('');
                  checked(msg);
                }}
              />
            )}
          </View>
          <View
            style={[
              {
                marginRight: msg.isSender ? sf(10) : undefined,
                marginLeft: msg.isSender ? undefined : sf(10),
                opacity: 1,
              },
            ]}
          >
            <StateLabel state={msg.state} />
          </View>
        </View>
      );
    }
  );

const VoiceMessageRenderItemDefault: ListRenderItem<MessageItemType> =
  React.memo(
    (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
      const sf = getScaleFactor();
      const { item } = info;
      const { width } = useWindowDimensions();
      const msg = item as VoiceMessageItemType;
      const isPlayingRef = React.useRef(false);
      const [isPlaying, setIsPlaying] = React.useState(isPlayingRef.current);
      const timeout = React.useRef<NodeJS.Timeout | null>(
        null
      ) as React.MutableRefObject<NodeJS.Timeout | null>;
      const _width = (duration: number) => {
        if (duration < 0) {
          throw new Error('The voice length cannot be less than 0.');
        }
        let r = width * 0.7 * (1 / 60) * (duration > 60 ? 60 : duration);
        r += 150;
        return r;
      };

      const stopPlayTimeout = React.useCallback(() => {
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }, msg.duration * 1000);
      }, [msg.duration]);

      React.useEffect(() => {
        const sub = DeviceEventEmitter.addListener(
          'uikit_click_voice_button',
          (data) => {
            if (data.key !== msg.key) {
              return;
            }
            if (isPlayingRef.current === false) {
              stopPlayTimeout();
            }
            isPlayingRef.current = !isPlayingRef.current;
            setIsPlaying(!isPlaying);
          }
        );
        return () => {
          sub.remove();
        };
      }, [isPlaying, msg.key, stopPlayTimeout]);

      if (item.state === 'recalled') {
        return <RenderRecallMessage {...item} />;
      }

      return (
        <View
          style={[
            styles.container,
            {
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              width: _width(msg.duration ?? 1),
            },
          ]}
        >
          <View
            style={[
              {
                marginRight: msg.isSender ? undefined : sf(10),
                marginLeft: msg.isSender ? sf(10) : undefined,
              },
            ]}
          >
            <DefaultAvatar id={msg.sender} size={sf(24)} radius={sf(12)} />
          </View>
          <View
            style={[
              styles.innerContainer,
              {
                flexDirection: msg.isSender ? 'row-reverse' : 'row',
                justifyContent: 'space-between',
                borderBottomRightRadius: msg.isSender ? undefined : sf(12),
                borderBottomLeftRadius: msg.isSender ? sf(12) : undefined,
                backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
                flexGrow: 1,
              },
            ]}
          >
            {isPlaying === true ? (
              <SimulateGif
                names={
                  msg.isSender
                    ? ['wave1_left', 'wave2_left', 'wave3_left']
                    : ['wave1_right', 'wave2_right', 'wave3_right']
                }
                size={sf(22)}
                color={msg.isSender ? 'white' : '#A9A9A9'}
                style={{ marginHorizontal: sf(8) }}
                interval={300}
              />
            ) : (
              <LocalIcon
                name={msg.isSender ? 'wave3_left' : 'wave3_right'}
                size={sf(22)}
                color={msg.isSender ? 'white' : '#A9A9A9'}
                style={{ marginHorizontal: sf(8) }}
              />
            )}

            <Text
              style={[
                styles.text,
                {
                  color: msg.isSender ? 'white' : 'black',
                  backgroundColor: msg.isSender ? '#0041FF' : '#F2F2F2',
                },
              ]}
            >
              {Math.round(msg.duration).toString() + "'"}
            </Text>
          </View>
          <View
            style={[
              {
                marginRight: msg.isSender ? sf(10) : undefined,
                marginLeft: msg.isSender ? undefined : sf(10),
                opacity: 1,
              },
            ]}
          >
            <StateLabel state={msg.state} />
          </View>
        </View>
      );
    }
  );
const CustomMessageRenderItemDefault: ListRenderItem<MessageItemType> =
  React.memo(
    (info: ListRenderItemInfo<MessageItemType>): React.ReactElement | null => {
      const { item } = info;
      const { SubComponent, SubComponentProps } = item as CustomMessageItemType;

      if (item.state === 'recalled') {
        return <RenderRecallMessage {...item} />;
      }

      return <SubComponent {...SubComponentProps} />;
    }
  );

let GTextMessageItem: ListRenderItem<TextMessageItemType> | undefined;
let GImageMessageItem: ListRenderItem<ImageMessageItemType> | undefined;
let GVoiceMessageItem: ListRenderItem<VoiceMessageItemType> | undefined;
let GFileMessageItem: ListRenderItem<FileMessageItemType> | undefined;
let GLocationMessageItem: ListRenderItem<LocationMessageItemType> | undefined;
let GVideoMessageItem: ListRenderItem<VideoMessageItemType> | undefined;
let GCustomMessageItem: ListRenderItem<CustomMessageItemType> | undefined;

const MessageRenderItem: ListRenderItem<MessageItemType> = (
  info: ListRenderItemInfo<MessageItemType>
): React.ReactElement | null => {
  const { item } = info;
  let MessageItem: ListRenderItem<MessageItemType> | undefined;
  if (item.type === ChatMessageType.TXT) {
    MessageItem = GTextMessageItem ?? (TextMessageRenderItemDefault as any);
  } else if (item.type === ChatMessageType.IMAGE) {
    MessageItem = GImageMessageItem ?? (ImageMessageRenderItemDefault as any);
  } else if (item.type === ChatMessageType.VOICE) {
    MessageItem = GVoiceMessageItem ?? (VoiceMessageRenderItemDefault as any);
  } else if (item.type === ChatMessageType.CUSTOM) {
    MessageItem = GCustomMessageItem ?? (CustomMessageRenderItemDefault as any);
  } else if (item.type === ChatMessageType.VIDEO) {
    MessageItem = GVideoMessageItem as any;
  } else if (item.type === ChatMessageType.LOCATION) {
    MessageItem = GLocationMessageItem as any;
  } else if (item.type === ChatMessageType.FILE) {
    MessageItem = GFileMessageItem ?? (FileMessageRenderItemDefault as any);
  }
  if (MessageItem === null || MessageItem === undefined) {
    return null;
  }
  return (
    <Pressable
      onPress={() => {
        if (item.type === ChatMessageType.VOICE) {
          if (MessageItem === VoiceMessageRenderItemDefault) {
            DeviceEventEmitter.emit('uikit_click_voice_button', {
              key: item.key,
            });
          }
        }
        item.onPress?.(item);
      }}
      onLongPress={() => {
        item.onLongPress?.(item);
      }}
      style={{
        width: '100%',
        alignItems:
          item.isTip === true
            ? 'center'
            : item.isSender === true
            ? 'flex-end'
            : 'flex-start',
      }}
    >
      <MessageItem {...info} />
    </Pressable>
  );
};
export type InsertDirectionType = 'before' | 'after';
export type MessageBubbleListRef = {
  scrollToEnd: () => void;
  scrollToTop: () => void;
  addMessage: (params: {
    msgs: MessageItemType[];
    direction: InsertDirectionType;
  }) => void;
  updateMessageState: (params: {
    localMsgId: string;
    result: boolean;
    reason?: any;
    item?: MessageItemType;
  }) => void;
  delMessage: (params: { localMsgId?: string; msgId?: string }) => void;
  resendMessage: (localMsgId: string) => void;
  recallMessage: (msg: ChatMessage) => void;
};
export type MessageBubbleListProps = {
  /**
   * Click the message list, not the message item.
   */
  onPressed?: () => void;
  onRequestHistoryMessage?: (params: { earliestId: string }) => void;
  TextMessageItem?: ListRenderItem<TextMessageItemType>;
  ImageMessageItem?: ListRenderItem<ImageMessageItemType>;
  VoiceMessageItem?: ListRenderItem<VoiceMessageItemType>;
  FileMessageItem?: ListRenderItem<FileMessageItemType>;
  LocationMessageItem?: ListRenderItem<LocationMessageItemType>;
  VideoMessageItem?: ListRenderItem<VideoMessageItemType>;
  CustomMessageItem?: ListRenderItem<CustomMessageItemType>;
  showTimeLabel?: boolean;
  style?: StyleProp<ViewStyle>;
};
const MessageBubbleList = (
  props: MessageBubbleListProps,
  ref?: React.Ref<MessageBubbleListRef>
): JSX.Element => {
  const { showTimeLabel, style } = props;

  GTextMessageItem = props.TextMessageItem;
  GImageMessageItem = props.ImageMessageItem;
  GVoiceMessageItem = props.VoiceMessageItem;
  GFileMessageItem = props.FileMessageItem;
  GLocationMessageItem = props.LocationMessageItem;
  GVideoMessageItem = props.VideoMessageItem;
  GCustomMessageItem = props.CustomMessageItem;

  const enableRefresh = true;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const data1 = React.useMemo(() => [] as MessageItemType[], []);
  const data2 = React.useMemo(() => [] as MessageItemType[], []);
  const currentData = React.useRef(data1);
  const [items, setItems] = React.useState<MessageItemType[]>(data1);
  const listRef = React.useRef<DynamicHeightListRef>(null);
  if (loading) {
    setLoading(false);
  }

  const getEarliestItem = React.useCallback(() => {
    if (currentData.current === data1) {
      if (data1.length > 0) {
        return data1[0];
      }
    } else if (currentData.current === data2) {
      if (data2.length > 0) {
        return data2[0];
      }
    }
    return undefined;
  }, [data1, data2]);

  const updateDataInternal = React.useCallback(
    (data: MessageItemType[]) => {
      if (data === data1) {
        for (let index = 0; index < data1.length; index++) {
          const element = data1[index] as MessageItemType;
          data2[index] = element;
        }
        data2.splice(data1.length, data2.length);
        setItems(data2);
        currentData.current = data2;
      } else if (data === data2) {
        for (let index = 0; index < data2.length; index++) {
          const element = data2[index] as MessageItemType;
          data1[index] = element;
        }
        data1.splice(data2.length, data1.length);
        setItems(data1);
        currentData.current = data1;
      } else {
        throw new Error('This is impossible.');
      }
    },
    [data1, data2]
  );

  const insertTimeLabel = React.useCallback(
    ({
      type,
      list,
      direction,
    }: {
      type: 'add' | 'update-all' | 'update-part' | 'del-one';
      list: MessageItemType[];
      direction: InsertDirectionType;
    }) => {
      switch (type) {
        case 'add':
          {
            const createTip = (
              items: MessageItemType[],
              data: MessageItemType
            ) => {
              let ret: MessageItemType | undefined;
              let isCreated = false;
              if (data !== undefined) {
                if (items.length === 0) {
                  // TODO: add tip
                  isCreated = true;
                } else if (items.length > 0) {
                  const tip = items[items.length - 1] as MessageItemType;
                  const first = data as MessageItemType;
                  if (
                    tip.ext.type !== 'tip' &&
                    tip.timestamp + 60 * 1000 < first.timestamp
                  ) {
                    // TODO: add tip
                    isCreated = true;
                  }
                }
                if (isCreated === true) {
                  ret = {
                    sender: data.sender,
                    timestamp: data.timestamp,
                    key: seqId('__msg_').toString(),
                    msgId: data.msgId,
                    type: ChatMessageType.TXT,
                    ext: {
                      type: 'time',
                      time_content: messageTimeForChat(data.timestamp),
                    },
                    isTip: true,
                  } as MessageItemType;
                }
              }

              return ret;
            };
            const isExistedTip = (
              items: MessageItemType[],
              target?: MessageItemType
            ) => {
              let ret = false;
              for (const i of items) {
                if (
                  i?.ext?.time_content !== undefined &&
                  i.ext.time_content === target?.ext.time_content
                ) {
                  ret = true;
                  break;
                }
              }
              return ret;
            };
            const removeDuplicateTip = (items: MessageItemType[]) => {
              let length = items.length;
              for (let i = 0; i < length; i++) {
                for (let j = 0; j < length; j++) {
                  const elementI = items[i];
                  const elementJ = items[j];
                  if (
                    elementI?.ext?.time_content &&
                    elementJ?.ext?.time_content &&
                    elementI?.ext.time_content === elementJ?.ext.time_content &&
                    i !== j
                  ) {
                    items.splice(j, 1);
                    --length;
                    --j;
                  }
                }
              }
              return items;
            };
            if (direction === 'after') {
              for (const i of list) {
                const ret = createTip(items, i);
                if (ret && isExistedTip(items, ret) === false) {
                  items.push(ret);
                }
                items.push(i);
              }
              const tmp = [...items];
              items.length = 0;
              items.push(...removeDuplicateTip(tmp));
            } else {
              let arr = [] as MessageItemType[];
              for (const i of list) {
                const ret = createTip(arr, i);
                if (ret && isExistedTip(arr, ret) === false) {
                  arr.push(ret);
                }
                arr.push(i);
              }
              const tmp = arr.concat(items);
              items.length = 0;
              items.push(...removeDuplicateTip(tmp));
            }
          }
          break;

        default:
          break;
      }
    },
    [items]
  );

  const updateData = React.useCallback(
    ({
      type,
      list,
      direction,
      isAddTimeLabel,
    }: {
      type: 'add' | 'update-all' | 'update-part' | 'del-one';
      list: MessageItemType[];
      direction: InsertDirectionType;
      isAddTimeLabel?: boolean;
    }) => {
      switch (type) {
        case 'add':
          if (direction === 'after') {
            if (isAddTimeLabel === true) {
              insertTimeLabel({ type, list, direction });
            } else {
              items.push(...list);
            }
          } else {
            if (isAddTimeLabel === true) {
              insertTimeLabel({ type, list, direction });
            } else {
              const tmp = list.concat(items);
              items.length = 0;
              items.push(...tmp);
            }
          }
          break;
        case 'update-all':
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (item) {
              for (const i of list) {
                if (item.key === i.key) {
                  items[index] = i;
                }
              }
            }
          }
          break;
        case 'update-part':
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            for (const i of list) {
              if (item?.key === i.key) {
                const old = item;
                items[index] = (old ? { ...old, ...i } : i) as MessageItemType;
                break;
              }
            }
          }
          break;
        case 'del-one':
          {
            let hadDeleted = false;
            for (let index = 0; index < items.length; index++) {
              const item = items[index];
              if (item) {
                for (const i of list) {
                  if (i.key === undefined) {
                    if (item.msgId === i.msgId) {
                      items.splice(index, 1);
                      hadDeleted = true;
                      break;
                    }
                  } else {
                    if (item.key === i.key) {
                      items.splice(index, 1);
                      hadDeleted = true;
                      break;
                    }
                  }
                }
              }
              if (hadDeleted === true) {
                break;
              }
            }
          }
          break;
        default:
          return;
      }
      updateDataInternal(items);
    },
    [insertTimeLabel, items, updateDataInternal]
  );

  const updateMessageState = React.useCallback(
    (params: {
      localMsgId: string;
      result: boolean;
      reason?: any;
      item?: MessageItemType;
    }) => {
      if (params.result === true && params.item) {
        updateData({
          type: 'update-all',
          list: [params.item],
          direction: 'after',
        });
      } else {
        updateData({
          type: 'update-part',
          list: [
            {
              key: params.localMsgId,
              state: 'failed',
            } as MessageItemType,
          ],
          direction: 'after',
        });
      }
    },
    [updateData]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: () => {
        listRef.current?.scrollToEnd();
      },
      scrollToTop: () => {},
      addMessage: (params: {
        msgs: MessageItemType[];
        direction: InsertDirectionType;
      }) => {
        updateData({
          type: 'add',
          list: params.msgs,
          direction: params.direction,
          isAddTimeLabel: showTimeLabel,
        });
      },
      updateMessageState: (params: {
        localMsgId: string;
        result: boolean;
        reason?: any;
        item?: MessageItemType;
      }) => {
        updateMessageState(params);
      },
      delMessage: (params: { localMsgId?: string; msgId?: string }) => {
        updateData({
          type: 'del-one',
          list: [
            {
              key: params.localMsgId,
              msgId: params.msgId,
            } as MessageItemType,
          ],
          direction: 'after',
        });
      },
      resendMessage: (localMsgId: string) => {
        updateData({
          type: 'update-part',
          list: [{ key: localMsgId, state: 'sending' } as MessageItemType],
          direction: 'after',
        });
      },
      recallMessage: (msg: ChatMessage) => {
        updateData({
          type: 'update-part',
          list: [
            {
              isTip: true,
              key: msg.localMsgId,
              state: 'recalled',
              ext: msg.attributes,
            } as MessageItemType,
          ],
          direction: 'after',
        });
      },
    }),
    [showTimeLabel, updateData, updateMessageState]
  );

  const initList = React.useCallback(() => {}, []);

  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', MessageBubbleList.name);
      const unsubscribe = addListeners();
      initList();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', MessageBubbleList.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners, initList]);

  return (
    <View style={[{ flex: 1 }, style]}>
      <DynamicHeightList
        ref={listRef}
        items={items}
        extraData={items}
        RenderItemFC={MessageRenderItem}
        enableRefresh={enableRefresh}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          if (props.onRequestHistoryMessage) {
            const item = getEarliestItem();
            props.onRequestHistoryMessage({ earliestId: item?.msgId ?? '' });
          }
          // requestHistory();
          wait(1500)
            .then(() => {
              setRefreshing(false);
            })
            .catch();
        }}
        keyExtractor={(item: MessageItemType, _: number) => {
          return item.key;
          // return index.toString();
        }}
        // onTouchEnd={onPressed}
      />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 10,
  },
  innerContainer: {
    // flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // backgroundColor: 'red',
    overflow: 'hidden',
  },
  text: {
    backgroundColor: 'rgba(242, 242, 242, 1)',
    padding: 10,
    flexWrap: 'wrap',
  },
  file: {
    flexDirection: 'row',
    backgroundColor: 'rgba(242, 242, 242, 1)',
    padding: 10,
  },
});

export default React.forwardRef<MessageBubbleListRef, MessageBubbleListProps>(
  MessageBubbleList
);
