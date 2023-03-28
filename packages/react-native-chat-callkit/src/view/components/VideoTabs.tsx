import { Tab, TabView } from '@rneui/themed';
import * as React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { calllog } from '../../call/CallConst';
import { Avatar } from './Avatar';
import { LocalIcon } from './LocalIcon';

const PageCount = 4;

export type VideoUser = {
  userId: string;
  userName: string;
  userAvatar?: string;
  muteAudio?: boolean;
  muteVideo?: boolean;
  talking?: boolean;
};

type VideoTabProps = {
  subUsers: VideoUser[];
  index: number;
};

export function VideoTab(props: VideoTabProps): JSX.Element {
  // calllog.log('VideoTab:', props);
  const { subUsers, index } = props;
  const { width: screenWidth } = useWindowDimensions();
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
          width: screenWidth,
        }}
      >
        {subUsers.map((user) => {
          return (
            <View
              key={user.userId}
              style={{
                width: '50%',
                height: '50%',
                // backgroundColor: 'green',
                // margin: 1,
                // justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'white', // for test
                borderWidth: 1,
              }}
            >
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
                      backgroundColor: '#14FF72',
                      padding: 5,
                      borderRadius: 105,
                    }}
                  >
                    <Avatar uri="" size={100} radius={100} />
                  </View>
                  <View style={{ flex: 2 }} />
                </View>
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
                  {user.userName}
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
            </View>
          );
        })}
      </View>
    </TabView.Item>
  );
}

// type VideoTabBarProps = {};

// export function VideoTabBar(props: VideoTabBarProps): JSX.Element {
//   calllog.log('VideoTabBar:', props);
//   return (
//     <Tab.Item
//       active={true}
//       titleStyle={{}}
//       containerStyle={{ width: '10%' }}
//       buttonStyle={{ height: '10%' }}
//       iconPosition="bottom"
//       dense={true}
//       style={{ height: 1, backgroundColor: '#D8D8D8' }}
//     />
//   );
// }

type VideoTabsProps = {
  users: VideoUser[];
};

export function VideoTabs(props: VideoTabsProps): JSX.Element {
  calllog.log('VideoTabs:');
  const { users } = props;
  const [index, setIndex] = React.useState(0);
  const initUsers = () => {
    const tu = [] as VideoUser[][];
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
  const ret = initUsers();
  const [tabUsers] = React.useState(ret[1] as VideoUser[][]);
  // const [pageCount, setPageCount] = React.useState(ret[0] as number);
  // calllog.log('test:', ret[0], tabUsers);
  const onIndex = (value: number) => {
    // calllog.log('test:value:', value);
    setIndex(value);
  };
  return (
    <>
      <TabView value={index} onChange={onIndex}>
        {tabUsers.map((users, i) => {
          // console.log('test:users:', users[0]?.userId);
          return <VideoTab key={users[0]?.userId} index={i} subUsers={users} />;
        })}
      </TabView>

      <Tab
        value={index}
        onChange={(e: any) => onIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
        variant="primary"
      >
        {tabUsers.map((users) => {
          // console.log('test:users:2', users[0]?.userId);
          return (
            <Tab.Item
              key={users[0]?.userId}
              style={{ height: 1, backgroundColor: '#D8D8D8' }}
            />
          );
        })}
      </Tab>
    </>
  );
}
