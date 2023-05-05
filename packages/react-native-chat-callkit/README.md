_English | [中文](./README.zh.md)_

---

# react-native-chat-callkit

This is the documentation for agora callkit sdk.

## Environment Requirements

- react-native: 0.63.5 or above
- nodejs: 16.18.0 or later

## download link

```sh
git clone git@github.com:easemob/react-native-chat-library.git
```

## Initialization

In the terminal command tool, change to the project root directory.

```sh
cd react-native-chat-library
yarn && yarn run generate-source-env
```

## basic introduction

agora callkit sdk is designed on the basis of agora chat sdk. Through the chat sdk and callkit sdk, real-time audio and video calls of one or more people can be realized.

The sdk mainly provides manager, listener, and view to complete the call together.

### Manager

The `CallManager` manager is mainly for call management.

The provided interfaces include:

- addListener: add listener
- removeListener: remove the listener

### Listener

The `CallListener` listener can receive call invitations.

The provided interfaces include:

- onCallReceived: Received call invitation notification.
- onCallOccurError: An error notification was received.

### pages

`SingleCall` provides single-person audio and video page components, and `MultiCall` provides multi-person audio and video page components. These two components have common functions, so there is also the basic audio and video component `BasicCall`.

Properties or methods provided by common components:

- inviterId: inviter ID.
- inviterName: Inviter nickname.
- inviterUrl: inviter's avatar url.
- currentId: current user ID.
- currentName: current user nickname.
- currentUrl: current user avatar url.
- timeout: Timeout time. Automatically hang up after timeout.
- bottomButtonType: Button group style. It can be used for those who need to set the initial style.
- muteVideo: Whether to disable video.
- callType: audio type or video type.
- isInviter: Whether the current user is an inviter.
- callState: call state.
- isMinimize: Whether it is the minimized state.
- isTest: test default. It is not enabled by default.
- onHangUp: hang up call notification.
- onCancel: cancel call notification. Only the inviter receives it.
- onRefuse: reject call notification. Only invitees receive.
- onClose: Close call notification. Requires the user to close the component.
- onError: call error notification. The user chooses the method by himself.
- onInitialized: notification of completion of initialization. Users can handle accordingly at this stage.
- onSelfJoined: Self-joined call notification.

Attributes or callback methods provided by individual components:

- inviteeId: invitee ID.
- onPeerJoined: The peer joins the call notification.

Properties or callback methods provided by multiplayer components:

- inviteeIds: invitee list IDs.
- inviteeList: Custom invitee list component.

**Description** Multiplayer audio and video currently supports up to 18 channels of video and 128 channels of audio.

## Example Demo

[Reference](../../examples/callkit-example/README.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
