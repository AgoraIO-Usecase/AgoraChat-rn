import * as React from 'react';
import { Text, View } from 'react-native';
import {
  CallState,
  InviteeListProps,
  MultiCall,
} from 'react-native-chat-callkit';
import { Button } from 'react-native-chat-uikit';

import { SelectListMemo } from '../components/SelectList';

const ContactList = (props: InviteeListProps): JSX.Element => {
  console.log('test:contactList:');
  const { onClose, selectedIds, maxCount } = props;
  const [count, setCount] = React.useState<number>(selectedIds.length);
  const addedIdsRef = React.useRef<string[]>([]);
  const content = () => {
    return `(${count}/${maxCount})`;
  };
  return (
    <View
      style={{
        flex: 1,
        top: 44,
        width: '100%',
        // height: 100,
        backgroundColor: 'white',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button
          style={{ height: 40, width: 60 }}
          onPress={() => {
            onClose(addedIdsRef.current);
          }}
        >
          done
        </Button>
        <View style={{ width: 10 }} />
        <View>
          <Text>{content()}</Text>
        </View>
      </View>
      <SelectListMemo
        selectedIds={selectedIds}
        maxCount={maxCount}
        onChangeCount={(c) => {
          setCount(c);
        }}
        onAddedIds={(ids: string[]) => {
          addedIdsRef.current = ids;
        }}
      />
    </View>
  );
};

export function test_all() {
  const isMinimize = false; // for test
  const elapsed = 10000; // for test
  const isInviter = true; // !!! must
  const callState = CallState.Calling; // for test
  const callType = 'audio'; // !!! must
  const bottomButtonType = 'invitee-video-init'; // for test
  const muteVideo = false; // for test
  const appKey = 'sdf';
  const inviterId = 'inviterId';
  const currentId = 'wo';
  const isTest = true;
  const agoraAppId = 'xxx';
  const inviteeIds = ['1', '2', '3', '4', '5', '6'];
  // const inviteeIds = ['1'];
  return (
    <MultiCall
      isMinimize={isMinimize}
      elapsed={elapsed}
      isInviter={isInviter}
      callState={callState}
      callType={callType}
      bottomButtonType={bottomButtonType}
      muteVideo={muteVideo}
      appKey={appKey}
      inviterId={inviterId}
      inviterName={inviterId}
      currentId={currentId}
      currentName={currentId}
      requestRTCToken={function (params: {
        appKey: string; // for test
        channelId: string;
        userId: string;
        onResult: (params: { data: any; error?: any }) => void;
      }): void {
        console.log(params);
      }}
      requestUserMap={function (params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data: any; error?: any }) => void;
      }): void {
        console.log(params);
      }}
      isTest={isTest}
      agoraAppId={agoraAppId}
      inviteeIds={inviteeIds}
      inviteeList={{
        InviteeList: ContactList,
      }}
    />
  );
}

export default function TestMultiCall() {
  React.useEffect(() => {}, []);
  return test_all();
}
