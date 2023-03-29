import * as React from 'react';
import { CallState, SingleCall } from 'react-native-chat-callkit';

// import { TestEnum } from '../../../../packages/react-native-chat-callkit/src/view/SingleCall';

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
  const inviteeId = 'inviteeId';
  const isTest = true;
  const agoraAppId = 'xxx';
  return (
    <SingleCall
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
      inviteeId={inviteeId}
      isTest={isTest}
      agoraAppId={agoraAppId}
    />
  );
}

export default function TestSingleCall() {
  return test_all();
}
