_English | [中文](./README.zh.md)_

---

# Overview

This is a multi-package managed repository. Includes uikit sdk and callkit sdk.

## Environmental Preparation

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

## Source Code Download

[download link](https://github.com/easemob/react-native-chat-library/)

```sh
git clone git@github.com:easemob/react-native-chat-library.git
```

## Project Structure

This is a multi-package management project managed by `lerna` and `yarn workspace`.

- `example`: A relatively complete example project, used for demonstration and test development.
- `examples/uikit-example`: uikit example project (to be developed)
- `examples/callkit-example`: callkit example project, mainly for demonstration of `callkit sdk`.
- `packages/react-native-chat-uikit`: uikit project
- `packages/react-native-chat-callkit`: callkit project

**Note** The commands run by the project are generally in the project root directory, not the corresponding package directory or example directory.

## Compile and Run

#### Project Initialization

1. Use `vscode` to open the project `react-native-chat-library`
2. Use `terminal` to initialize the project `yarn`
3. If it is the first project initialization, you also need to execute the command `yarn run generate-source-env` to generate the corresponding files. For example: `env.ts`.

**Note** `yarn` will execute additional commands. For developers who don’t understand commands, if they need to use `npm` command instead, they need to understand more trustworthy content.
**Note** When creating this project, the scaffolding has preset some `yarn` related commands, so it is recommended to use `yarn` to complete most of the work.
**Note** Because `example` uses `firebase cloud message (fcm)` related content, if users need to use related content, they need to set the corresponding file (GoogleService-Info.plist is required for ios platform, google-services is required for android platform .json), if you don’t need it, just delete the relevant content.

#### Universal Compilation

The operation steps are as follows:

1. Use `terminal` to change directory to `example`
2. Execute the command `yarn run ios` to compile and run the `iOS` application
3. Execute the command `yarn run android` to compile and run the `Android` application

**NOTE** This mode is deprecated for compilation.
**Modify Command** Please refer to `example/package.json` related content.
**Reference** For more information on compiling and running commands, please refer to `expo` related content.

#### Universal Operation

Running an application in development mode requires additional local services, which can dynamically detect file source code modifications and perform dynamic debugging.

1. Using the `terminal` tool, switch to `cd example/ios`
2. Using the `terminal` tool, execute the `yarn run start` command to start the service.

#### iOS Platform

**<span style="color:orange">compile and build the project</span>**

In the compilation phase, the `iOS` platform needs to execute the `pod install` command to generate the Xcode `xcworkspace` project file.

1. Using the `terminal` tool, switch to `cd example/ios`
2. Use the `terminal` tool to execute `pod install` to generate `example/ios/example.xcworkspace`.
3. Use the `Xcode` tool to open the project file `example/ios/example.xcworkspace`
4. If you use the simulator, you need to choose `iOS` 12.4 or below
5. If you use a real device, the developer mode needs to be enabled on the real device, and `singing & capabilities` related content needs to be set in the project
6. Use the `Xcode` tool to execute the compile operation.

**Note** For developers who do not use `Xcode` to compile, they can use the official recommended method to compile. If there is a problem, it is generally difficult to find the cause of the problem.
**Note** The `react-native` native service is automatically started, not the `expo` service, and an error will be reported. Just turn off the service.

**<span style="color:orange">run the project</span>**

Use the command provided by the `expo` tool to start the local service, refer to the `General Operation` chapter.

**Note** If the running application is not loaded correctly, you need to refresh the page, or close the application and restart it. For error reporting problems, you can generally solve them through corresponding prompts.

#### Android Platform

**<span style="color:orange">compile and build the project</span>**

During the compilation phase, the `Android` platform needs to execute the `sync` initialization project.

1. Start the `android studio (referred to as as)` tool, open the project file `example/android`,
2. Click the `sync project with gradle files` button to execute the `initialization` operation,
3. If using an emulator, please select or create an emulator of version 6.0 or above,
4. If it is a real device, you need to enable the developer mode of the device,
5. When `sync` is successful, click the `run app` button to compile and run the project.

**Note** If you use `as` for the first time, it may take a lot of downloading and the waiting time will be longer.
**Note** `Android platform devices need data forwarding. The command for data forwarding is `adb reverse tcp:8081 tcp:8081`. Since `example`uses the`expo` tool, it does it for you, so no manual work is required.

**<span style="color:orange">run the project</span>**

Use the command provided by the `expo` tool to start the local service, refer to the `General Operation` chapter.

**Note** If the running application is not loaded correctly, you need to refresh the page, or close the application and restart it. For error reporting problems, you can generally solve them through corresponding prompts.
**Note** `Android platform devices need data forwarding. The command for data forwarding is `adb reverse tcp:8081 tcp:8081`. Since `example`uses the`expo` tool, it does it for you, so no manual work is required.

# More instructions

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
