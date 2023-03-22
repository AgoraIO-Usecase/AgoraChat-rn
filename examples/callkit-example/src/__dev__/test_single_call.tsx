import * as React from 'react';
import { CallState, SingleCall } from 'react-native-chat-callkit';

// import { TestEnum } from '../../../../packages/react-native-chat-callkit/src/view/SingleCall';

export function test_all() {
  const isMinimize = false; // for test
  const peerNickName = 'NickName'; // for test
  const peerAvatarUrl = ''; // for test
  const elapsed = 10000; // for test
  const isInviter = true; // !!! must
  const callState = CallState.Calling; // for test
  const callType = 'video'; // !!! must
  const bottomButtonType = 'invitee-video-init'; // for test
  const muteVideo = true; // for test
  return (
    <SingleCall
      isMinimize={isMinimize}
      peerNickName={peerNickName}
      peerAvatarUrl={peerAvatarUrl}
      elapsed={elapsed}
      isInviter={isInviter}
      callState={callState}
      callType={callType}
      bottomButtonType={bottomButtonType}
      muteVideo={muteVideo}
    />
  );
}

export function test_default() {
  const peerNickName = 'NickName'; // for test
  const elapsed = 10000; // for test
  const isInviter = false; // !!! must
  const callType = 'audio'; // !!! must
  return (
    <SingleCall
      peerNickName={peerNickName}
      elapsed={elapsed}
      isInviter={isInviter}
      callType={callType}
    />
  );
}

export default function TestSingleCall() {
  return test_default();
}
