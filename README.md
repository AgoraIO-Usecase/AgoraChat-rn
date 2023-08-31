_English | [中文](./README.zh.md)_

---

# Overview

Agora Chat UIKit for React-Native is a development kit with an user interface that enables an easy and fast integration of standard chat features into new or existing client apps. Agora Chat CallKit for React-Native is a development kit with an user interface that enables an easy and fast integration of RTC video/audio calling into new or existing client app.

The repository mainly includes the following sub-projects:

- `example`: This is a demo example of a relatively complete UIKit. Including user login, logout, session management, contact management, group management, chat management, basic settings, etc.
- `examples/callkit-example`: This is a demonstration example of audio and video calls. Including single-person and multi-person audio and video call functions.
- `packages/react-native-chat-uikit`: UIKit SDK project
- `packages/react-native-chat-callkit`: CallKit SDK project

Find out more about Agora Chat UIKit or CallKit for React-Native at [DOCS](./docs/v2/index.md). If you need any help in resolving any issues or have questions, [visit our community](https://github.com/AgoraIO-Usecase/AgoraChat-rn).

## Requirements

- operating system:
  - MacOS 10.15.7 or above
- Tools collection:
  - Xcode 13.4 or above (if developing iOS platform reference)
  - Android studio 2021.3.1 or above (if developing Android platform applications) (as for short)
  - Visual Studio Code latest (vscode for short)
- Compile and run environment:
  - Java JDK 1.8.0 or above (it is recommended to use Android studio's own)
  - Objective-C 2.0 or above (recommended to use Xcode comes with it)
  - Typescript 4.0 or above
  - Nodejs 16.18.0 or above (brew installation is recommended)
  - yarn 1.22.19 or above (brew installation is recommended)
  - React-Native 0.63.5 or above
  - npm and related tools (**not recommended**, please solve related problems by yourself)
  - expo 6.0.0 or above

⚑ More details, please see https://reactnative.dev/docs/environment-setup
⚑ we strongly recommend installing yarn using corepack

## Try the example app

**Download repository [from here](https://github.com/AgoraIO-Usecase/AgoraChat-rn).**

**Project initialization.**

```sh
yarn && yarn run example-env && yarn run sdk-version
```

**Configure the necessary parameters.**
In the `example` project, add `appKey` and other information to the `example/src/env.ts`. In the `examples/callkit-example` project, add `appKey` and other information to the `examples/callkit-example/src/env.ts` file.

**Configure FCM file.**
In the `example` project, for the Android platform, please put `google-services.json` under the `examples/android/app` folder, and for the iOS platform, please put `GoogleService-Info.plist` under the `example/iOS/ChatUikitExample` folder.
In the `examples/callkit-example` project, for the Android platform, please put `google-services.json` under the `examples/callkit-example/android/app` folder, for the iOS platform, please put `GoogleService-Info.plist` under the `examples/callkit-example/iOS/ChatCallkitExample` folder.

**Compile and Run example app.**

```sh
cd example && yarn run Android
# or
cd example && yarn run pods && yarn run iOS
```

## Development

We tried development on macOS systems. You might encounter problems in running sample or scripts like yarn build in Windows machines.

## Quick Start Examples

If you want to experience a simpler demo project, you can refer to other repositories.
[Quick Start UIKit Demo](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-rn)
[Quick Start CallKit Demo](https://github.com/AgoraIO-Usecase/AgoraChat-Callkit-rn)

## More Detail Development

More detailed development help can be found here.
[detail development helper](./docs/dev.md)

# More instructions

See the description of each sub-item for details.

[uikit example helper](./example/README.md)
[callkit example helper](./examples/callkit-example/README.md)
[uikit helper](./packages/react-native-chat-uikit/README.md)
[callkit helper](./packages/react-native-chat-callkit/README.md)

---

# Q & A

If you have more questions, please check here, and if you have more suggestions, please contribute here.

[skip to here](./QA.md)

---

# mind Mapping

The description of this dimension may increase your understanding of the project.

[skip to here](./swdt.md)
