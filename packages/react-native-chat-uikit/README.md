_English | [中文](./README.zh.md)_

---

# react-native-chat-uikit

This is the documentation for agora uikit sdk.

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

The agora uikit sdk is designed on the basis of agora chat sdk. Application development can be realized more efficiently through these UI components. In addition to the UI components, it also provides the necessary packaging of agora chat sdk and some basic tools to provide the greatest possible convenience for developing applications.

## function list

### Session list component

- Provided interface
  - update: update the session list item
  - create: create a session list item
  - remove: remove session list item
  - updateRead: Set the session as read
  - updateExtension: set session custom fields
- Provided properties or event callbacks
  - propsRef: set the session list controller
  - onLongPress: Notify long press session list item
  - onPress: Notify click on session list item
  - onUpdateReadCount: Notifies the session list item update
  - sortPolicy: Set the sorting rules for session list items
  - RenderItem: Customize the style of the list item

### Chat details component

- Provided interface
  - sendTextMessage: send text message
  - sendImageMessage: send image message
  - sendVoiceMessage: send voice message
  - sendCustomMessage: send custom message
  - sendFileMessage: send file message
  - sendVideoMessage: send video message
  - sendLocationMessage: send location message
  - loadHistoryMessage: load history message
  - deleteLocalMessage: delete local message
  - resendMessage: resend failed message
  - downloadAttachment: download message attachment
- Provided properties or event callbacks
  - propsRef: set chat component controller
  - screenParams: set the parameters of the chat component
  - messageBubbleList: custom message bubble component
  - onUpdateReadCount: Notify that the update message has not been read
  - onClickMessageBubble: Click the message bubble notification
  - onLongPressMessageBubble: Long press the message bubble notification
  - onClickInputMoreButton: click the more button notification
  - onPressInInputVoiceButton: press the voice button notification
  - onPressOutInputVoiceButton: Push the voice button notification
  - onSendMessage: notification before sending a message
  - onSendMessageEnd: notification of the end of sending a message
  - onVoiceRecordEnd: Notification of the end of the recorded voice message

**Chat Bubble Component**

- Provided interface
  - scrollToEnd: Scroll to the bottom of the page
  - scrollToTop: scroll to the top of the page
  - addMessage: add message
  - updateMessageState: update message state
  - delMessage: delete message bubble item
  - resendMessage: resend message
- Provided properties or event callbacks
  - onRequestHistoryMessage: pull down to refresh request history message notification
  - TextMessageItem: Customize the style of the text message
  - ImageMessageItem: Customize the style of the image message
  - VoiceMessageItem: Customize the style of the voice message
  - FileMessageItem: Customize the style of the file message
  - LocationMessageItem: Customize the style of the location message
  - VideoMessageItem: Customize the style of the video message
  - CustomMessageItem: Customize the style of the custom message

### Other components

Other components are in the experimental stage, if you are interested, you can try to use them.

UI basic components: provide basic styles and usage. [Reference](./src/components)
Internationalization tools: Provide interface language settings. [Reference](./src/I18n2)
Modal component management tool: Provides unified display and hiding of modal windows. [Reference](./src/events/index.tsx)
Tool class: provide necessary functions. [Reference](./src/utils)
Pasteboard service: Provides copy and paste services.
Persistent storage service: Provide key-value service.
Media service: provide services for opening the media library and selecting pictures, videos, and files.
Permission service: Provide services for ios or android platform permission application.
File service: Provide folder management service.

## Example Demo

[Reference](../../example/README.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
