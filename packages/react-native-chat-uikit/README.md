# react-native-chat-uikit

Instant messaging connects people wherever they are and allows them to communicate with others in real time. With built-in user interfaces (UI) for the message list, the [Agora Chat UI Samples](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-rn) enables you to quickly embed real-time messaging into your app without requiring extra effort on the UI.

## Environment Requirements

- react-native: 0.66.0 or later
- nodejs: 16.18.0 or later

## Download link

```sh
git clone git@github.com:AgoraIO-Usecase/AgoraChat-rn.git
```

## Initialization

In the terminal, go to the project root directory.

```sh
cd react-native-chat-library
yarn && yarn run generate-source-env
```

## Introduction

The Agora Chat UIKit SDK is designed on the basis of the Agora Chat SDK. It provides UI components to achieve efficient application development. Also it encapsulates necessary modules of the Agora Chat SDK and some basic tools to facilitate application development.

<table>
  <tr>
    <td>Module</td>
    <td>Function</td>
    <td>Description</td>
  </tr>
  <tr>
    <td rowspan="5" style="font-weight: bold">Conversation List</td>
  </tr>
  <tr>
    <td>Conversation list</td>
    <td style="font-size: 10px">
      Presents the conversation information, including the user's avatar and nickname, content of the last message, unread message count, and the time when the last message is sent or received.
    </td>
  </tr>
  <tr>
    <td>Add conversation</td>
    <td style="font-size: 10px">
      Adds the conversation to the conversation list
    </td>
  </tr>
  <tr>
    <td>Update conversation</td>
    <td style="font-size: 10px">
      Updates the conversation in the conversation list
    </td>
  </tr>
  <tr>
    <td>Delete conversation</td>
    <td style="font-size: 10px">
      Deletes the conversation from the conversation list
    </td>
  </tr>
  <tr>
    <td rowspan="5" style="font-weight: bold">Chat</td>
  </tr>
  <tr>
    <td>Message Bubble</td>
    <td style="font-size: 10px">
      Provides built-in bubble styles for messages of some types and support custom 
      message bubble styles. 
    </td>
  </tr>
  <tr>
    <td>Send Message</td>
    <td style="font-size: 10px">Supports message sending.</td>
  </tr>
  <tr>
    <td>Message Bubble Event</td>
    <td style="font-size: 10px">
      Supports events for clicking and holding down message bubbles.
    </td>
  </tr>
  <tr>
    <td>emoji</td>
    <td style="font-size: 10px">Support ink emojis with Unicode codes.</td>
  </tr>
</table>

## Function list

### Conversation list component

- Provided APIs
  - update: Updates the conversation list item.
  - create: Creates a conversation list item.
  - remove: Removes a conversation list item.
  - updateRead: Sets the conversation as read.
  - updateExtension: Sets conversation custom fields.
- Provided properties or event callbacks
  - propsRef: Sets the conversation list controller.
  - onLongPress: Occurs when a conversation list item is held down.
  - onPress: Occurs upon a click on a conversation list item.
  - onUpdateReadCount: Occurs when a conversation list item is updated.
  - sortPolicy: Sets the rules of sorting out conversation list items.
  - RenderItem: Customizes the style of the conversation list items.

### Chat details component

- Provided APIs
  - sendTextMessage: Sends a text message.
  - sendImageMessage: Sends an image message.
  - sendVoiceMessage: Sends a voice message.
  - sendCustomMessage: Sends a custom message.
  - sendFileMessage: Sends a file message.
  - sendVideoMessage: Sends a video message.
  - sendLocationMessage: Sends a location message.
  - loadHistoryMessage: Loads historical messages.
  - deleteLocalMessage: Deletes local messages.
  - resendMessage: Resends a message that fails to be sent.
  - downloadAttachment: Downloads a message attachment.
- Provided properties or event callbacks
  - propsRef: Sets the chat component controller.
  - screenParams: Sets the parameters of the chat component.
  - messageBubbleList: Set the custom message bubble component.
  - onUpdateReadCount: Occurs when the count of unread messages is updated.
  - onClickMessageBubble: Occurs upon a click on the message bubble notification
  - onLongPressMessageBubble: Occurs when a message bubble is held down.
  - onClickInputMoreButton: Occurs when the More button is pressed.
  - onPressInInputVoiceButton: Occurs when the voice button is pressed.
  - onPressOutInputVoiceButton: Occurs when the voice button is released.
  - onSendMessage: Occurs when the message starts to be sent.
  - onSendMessageEnd: Occurs when the message sending is complete.
  - onVoiceRecordEnd: Occurs when the recording of a voice message is complete.

**Chat Bubble Component**

- Provided APIs
  - scrollToEnd: Scrolls to the bottom of the page.
  - scrollToTop: Scrolls to the top of the page.
  - addMessage: Adds a message.
  - updateMessageState: Updates the message state.
  - delMessage: Deletes a message bubble item.
  - resendMessage: Resends a message.
- Provided properties or event callbacks
  - onRequestHistoryMessage: pull down to refresh request history message notification
  - TextMessageItem: Customizes the style of text messages.
  - ImageMessageItem: Customizes the style of image messages.
  - VoiceMessageItem: Customizes the style of voice messages.
  - FileMessageItem: Customizes the style of file messages.
  - LocationMessageItem: Customizes the style of location messages.
  - VideoMessageItem: Customizes the style of video messages.
  - CustomMessageItem: Customizes the style of custom messages.

### Other components

Other components are in the experimental stage. If you are interested, you can try to use them.

- Basic UI components: Provide basic styles and usage. [Reference](./src/components).
- Internationalization tools: Provides UI language settings. [Reference](./src/I18n2).
- Modal component management tool: Provides unified display and hiding of modal windows. [Reference](./src/events/index.tsx)
- Tool class: Provide necessary functions. [Reference](./src/utils)
- Pasteboard service: Provides copy and paste services.
- Persistent storage service: Provides key-value service.
- Media service: Provides services like opening the media library and selecting pictures, videos, and files.
- Permission service: Provides services for applying for iOS or Android platform permissions.
- File service: Provides folder management service.

## Example Demo

[Reference](../../example/README.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
