import * as React from 'react';
import { View } from 'react-native';
import {
  CallState,
  InviteeListProps,
  MultiCall,
} from 'react-native-chat-callkit';
import { Button } from 'react-native-chat-uikit';

// import { TestEnum } from '../../../../packages/react-native-chat-callkit/src/view/SingleCall';

const contactList = (props: InviteeListProps) => {
  console.log('test:contactList:', props);
  const { onClose, userIds } = props;
  return (
    <View style={{ top: 100, width: 100, height: 100, backgroundColor: 'red' }}>
      <Button
        onPress={() => {
          onClose(userIds);
        }}
      >
        close
      </Button>
    </View>
  );
};

export function test_all() {
  const isMinimize = false; // for test
  const elapsed = 10000; // for test
  const isInviter = true; // !!! must
  const callState = CallState.Calling; // for test
  const callType = 'video'; // !!! must
  const bottomButtonType = 'invitee-video-init'; // for test
  const muteVideo = false; // for test
  const appKey = 'sdf';
  const inviterId = 'inviterId';
  const currentId = 'wo';
  const isTest = true;
  const agoraAppId = 'xxx';
  const inviteeIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  // const inviteeIds = ['1', '2', '3', '4', '5', '6', '7'];
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
        InviteeList: contactList,
      }}
    />
  );
}

export function test_default() {
  const elapsed = 10000; // for test
  const isInviter = true; // !!! must
  const callType = 'video'; // !!! must
  const appKey = 'sdf';
  const inviterId = 'inviterId';
  const currentId = 'wo';
  const isTest = true;
  const agoraAppId = 'xxx';
  return (
    <MultiCall
      elapsed={elapsed}
      isInviter={isInviter}
      callType={callType}
      appKey={appKey}
      inviterId={inviterId}
      inviterName={inviterId}
      currentId={currentId}
      currentName={currentId}
      requestRTCToken={function (params: {
        appKey: string; // for test

        // for test
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
      inviteeIds={[]}
    />
  );
}

export default function TestMultiCall() {
  return test_all();
}
