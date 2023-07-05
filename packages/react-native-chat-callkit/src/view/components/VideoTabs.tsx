import { BlurView } from '@react-native-community/blur';
import { Tab, TabView } from '@rneui/themed';
import * as React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { RtcSurfaceView, VideoViewSetupMode } from 'react-native-agora';

import { calllog } from '../../call/CallConst';
import type { User } from '../../types';
import { DefaultAvatar, DefaultAvatarMemo } from './Avatar';
import { LocalIcon } from './LocalIcon';

const PageCount = 4;

type VideoTabProps = {
  users: User[];
  index: number;
  onPress?: (params: { userId: string; userChannelId?: number }) => void;
  setupMode: VideoViewSetupMode;
  isTest?: boolean;
};

type VideoTabState = {
  subUsers: User[];
};

export class VideoTab extends React.Component<VideoTabProps, VideoTabState> {
  constructor(props: VideoTabProps) {
    calllog.log('VideoTab:constructor:', props, props.isTest);
    super(props);
    this.state = {
      subUsers: props.users,
    };
  }

  componentDidMount?(): void {
    calllog.log('VideoTab:componentDidMount:');
  }

  shouldComponentUpdate?(
    nextProps: Readonly<VideoTabProps>,
    _: Readonly<VideoTabState>,
    __: any
  ): boolean {
    // calllog.log('VideoTab:shouldComponentUpdate:', nextProps, this.props);
    if (this.compare(nextProps) === false) {
      this.update(nextProps.users);
      return false;
    }
    return true;
  }

  componentWillUnmount?(): void {
    calllog.log('VideoTab:componentWillUnmount:');
  }

  private compare(nextProps: Readonly<VideoTabProps>): boolean {
    return JSON.stringify(nextProps) === JSON.stringify(this.props);
  }

  public update(users: User[]): void {
    this.setState({ subUsers: [...users] });
  }

  protected renderBlur(params: {
    user: User;
    height: number;
    width: number;
  }): React.ReactNode {
    const { user, width, height } = params;
    if (user.muteVideo === true) {
      return (
        <View
          style={{
            position: 'absolute',
            flex: 1,
            height,
            width,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <DefaultAvatarMemo
            userId={user.userId}
            userAvatar={user.userAvatar}
            size={height > width ? height : width}
          />
          <BlurView
            style={{ position: 'absolute', flex: 1, height, width }}
            blurType="dark" // Values = dark, light, xlight .
            blurAmount={10}
            reducedTransparencyFallbackColor="red"
          />
        </View>
      );
    }
    return null;
  }

  public render(): React.ReactNode {
    const { index, onPress, users } = this.props;
    // const { subUsers } = this.state;
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    return (
      <TabView.Item
        key={index.toString()}
        style={{
          // backgroundColor: 'red',
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignContent: 'center',
            width: windowWidth,
          }}
        >
          {users.map((user, i) => {
            const count = users.length;
            const width =
              count === 1 || count === 2 || (count === 3 && i === 2)
                ? '100%'
                : '50%';
            const height = count === 1 ? windowHeight : windowHeight * 0.5;
            return (
              <Pressable
                onPress={() => {
                  if (user.userHadJoined === true) {
                    onPress?.({
                      userId: user.userId,
                      userChannelId: user.userChannelId,
                    });
                  }
                }}
                key={user.userId}
                style={{
                  width,
                  height,
                  // backgroundColor: 'green',
                  // margin: 1,
                  // justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: 'white', // for test
                  borderWidth: 1,
                }}
              >
                {this.renderBlur({
                  user,
                  height,
                  width: width === '50%' ? windowWidth * 0.5 : windowWidth,
                })}
                {user.muteVideo ? (
                  <View
                    style={{
                      height: '100%',
                      position: 'absolute',
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={{
                        // backgroundColor: '#14FF72',
                        padding: 5,
                        borderRadius: 105,
                      }}
                    >
                      <DefaultAvatar
                        userId={user.userId}
                        userAvatar={user.userAvatar}
                        size={100}
                        radius={100}
                      />
                    </View>
                    <View style={{ flex: 2 }} />
                  </View>
                ) : user.userHadJoined === true ? (
                  <RtcSurfaceView
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    canvas={{
                      uid: user.isSelf === true ? 0 : user.userChannelId,
                      setupMode: this.props.setupMode,
                    }}
                    key={user.userChannelId}
                  />
                ) : null}

                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    bottom: 0,
                    paddingBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '600',
                      lineHeight: 18,
                      fontSize: 14,
                      color: 'white',
                      paddingLeft: 5,
                    }}
                  >
                    {user.userName ?? user.userId}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingRight: 5,
                    }}
                  >
                    {user.muteVideo ? (
                      <LocalIcon name="video_slash" color="white" size={20} />
                    ) : null}
                    <View style={{ width: 5 }} />
                    {user.muteAudio ? (
                      <LocalIcon name="mic_slash" color="white" size={20} />
                    ) : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </TabView.Item>
    );
  }
}

type VideoTabsProps = {
  users: User[];
  onPress?: (params: { userId: string; userChannelId?: number }) => void;
  setupMode: VideoViewSetupMode;
  isTest?: boolean;
};

type VideoTabsState = {
  tabUsers: User[][];
  index: number;
};

export class VideoTabs extends React.Component<VideoTabsProps, VideoTabsState> {
  constructor(props: VideoTabsProps) {
    calllog.log('VideoTabs:constructor:', props);
    super(props);
    this.state = {
      tabUsers: this.initUsers(props.users)[1] as User[][],
      index: 0,
    };
  }

  componentDidMount?(): void {
    calllog.log('VideoTabs:componentDidMount:');
  }

  shouldComponentUpdate?(
    nextProps: Readonly<VideoTabsProps>,
    _: Readonly<VideoTabsState>,
    __: any
  ): boolean {
    // calllog.log('VideoTabs:shouldComponentUpdate:', nextProps, this.props);
    if (this.compare(nextProps) === false) {
      // this.update(nextProps.users);
      return false;
    }
    return true;
  }

  componentWillUnmount?(): void {
    calllog.log('VideoTabs:componentWillUnmount:');
  }

  private compare(nextProps: Readonly<VideoTabsProps>): boolean {
    return JSON.stringify(nextProps) === JSON.stringify(this.props);
  }

  public update(users: User[]): void {
    calllog.log('VideoTabs:update:', users.length);
    this.setState({ tabUsers: this.initUsers(users)[1] as User[][] });
  }

  private initUsers = (users: User[]) => {
    calllog.log('VideoTabs:initUsers:', users.length);
    const tu = [] as User[][];
    const pageCount = Math.ceil(users.length / PageCount);
    for (let index = 0; index < pageCount; index++) {
      tu[index] = [];
      for (
        let j = index * PageCount;
        j < PageCount * (index + 1) && j < users.length;
        j++
      ) {
        const user = users[j];
        if (user) {
          tu[index]?.push(user);
        }
      }
    }
    return [pageCount, tu];
  };

  private onIndex = (index: number) => {
    this.setState({ index });
  };

  public render(): React.ReactNode {
    const { onPress, users } = this.props;
    const { index } = this.state;
    const ret = this.initUsers(users);
    const tabUsersP = ret[1] as User[][];
    const pageCount = ret[0] as number;
    return (
      <>
        <TabView value={index} onChange={this.onIndex}>
          {tabUsersP.map((users, i) => {
            calllog.log('VideoTabs:render:map:', users[0]?.userId, i);
            return (
              <VideoTab
                key={users[0]?.userId}
                index={i}
                users={users}
                onPress={onPress}
                setupMode={this.props.setupMode}
                isTest={this.props.isTest}
              />
            );
          })}
        </TabView>

        {pageCount < 2 ? null : (
          <Tab
            value={index}
            onChange={(e: any) => this.onIndex(e)}
            indicatorStyle={{
              backgroundColor: 'white',
              height: 3,
            }}
            variant="primary"
          >
            {tabUsersP.map((users) => {
              calllog.log('VideoTabs:render:map:', users[0]?.userId);
              return (
                <Tab.Item
                  key={users[0]?.userId}
                  style={{ height: 1, backgroundColor: '#D8D8D8' }}
                />
              );
            })}
          </Tab>
        )}
      </>
    );
  }
}
