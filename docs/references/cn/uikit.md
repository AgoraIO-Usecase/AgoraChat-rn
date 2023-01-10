# 库项目 `react-native-chat-uikit`

该项目主要提供了和界面相关的便捷工具。方便开发人员开发对应组件，提升开发效率。该项目是一整套的应用开发解决方案，提供了大量组件以及使用演示。

## 常用组件

## 基础 UI 组件

这里主要说一些重要组件。

[详细介绍](./uikit.ui.md)

## 数据共享

数据共享是所有技术架构的基础。例如：函数通过输入参数，返回参数进行数据传递，类方法还有额外的 this 参数。
`react-native` 的 UI 部分的组件主要有两种数据传递： 1.父组件传递给子组件的层层传递， 2.上下文的直接传递。
所以，这里讲述的主要是上下文的使用。

目前支持的上下文包括：界面安全区域、样式颜色主题、国际化、状态栏、模态窗口、toast。
同时，通过单实例方式提供服务。包括：媒体文件处理、权限处理、通知处理、存储服务。

为了让他们使用起来方便和统一，这里封装了统一的入口 `UIKitContainer`。

**注意** 任何上下文的使用前提是需要安装 `UIKitContainer` 组件。

```typescript
<UIKitContainer
  option={{ appKey: '', autoLogin: false }}
  theme={isLightTheme ? LightTheme : DarkTheme}
  localization={createStringSetEn2(new AppStringSet())}
  sdk={
    new AppChatSdkContext({
      client: ChatClient.getInstance(),
      autoLogin: false,
    })
  }
  header={{
    defaultTitleAlign: 'center',
    defaultStatusBarTranslucent: true,
    defaultHeight: 44,
    defaultTopInset: 44,
  }}
  services={{
    clipboard: Services.createClipboardService({
      clipboard: Clipboard,
    }),
    notification: Services.createNotificationService({
      firebaseMessage: FirebaseMessage,
      permission: permission,
    }),
    media: Services.createMediaService({
      videoModule: VideoComponent,
      videoThumbnail: CreateThumbnail,
      imagePickerModule: ImagePicker,
      documentPickerModule: DocumentPicker,
      mediaLibraryModule: MediaLibrary,
      fsModule: FileAccess,
      audioModule: Audio,
      permission: permission,
    }),
    permission: permission,
    storage: storage,
  }}
/>
```

[示例代码](../../../example/src/App.tsx)

## 主题

只要是包含界面的应用，就离不开颜色、样式、字体等设置。这些配置参数决定了应用的外观风格。所以，主题是应用开发不可缺少的一部分。

这里的主题主要针对 `UIKIT` 提供的组件的配置，并不包括 应用程序本身定制化开发的 UI 组件的主题。这样的选择，主要原因是应用开发定制化的组件并不会很多，而 `UIKIT` 随着完善和增加会包括几乎所有的需要的组件，所以，用户基本上不会使用自己的主题。如果真的需要，我想应该为这个 `UIKIT` 贡献组件更加合适。

[详细介绍](./uikit.theme.md)

## 国际化

如果考虑应用的多语言版本，那么就需要进行界面相关组件的内容进行国际化处理。

该 UIKIT 默认提供了英文版本。

[详细介绍](./uikit.i18n.md)

## 模态组件

模态组件本质是模态窗口，它和非模态窗口相比，需要处理完成才能进行下一个操作。所以，他有一些自己的特点。
原本模态组件可以采用简单直接的使用，但是这种原始的使用会带来多个模态组件出现如何处理？每次单独使用的冗余设计等问题，所以，才有了现在这个模态组件管理的上下文。

[详细介绍](./uikit.modal.md)

## toast

toast 组件主要进行提示信息的限时展示，他的限时性比较特殊，所以，单独出来。

[详细介绍](./uikit.toast.md)

## 持久存储

目前支持 `k-v` 存储，对于 日志存储 这类功能后续开发。
典型应用场景：保存上次登录记录。

[详细介绍](./uikit.service.storage.md)

## 媒体处理（语音、视频、文档、文件等）

媒体处理其实是一个比较大的内容，它包括了音频处理、视频处理、图片处理、文档处理、文件处理等。
**注意** 任何资源的使用都是需要权限的，所以，需要对权限服务有一定了解。由于服务内部已经自动提供了请求对应服务的能力，更多的需要开发者自行使用资源的时候注意权限请求。

[详细介绍](./uikit.service.media.md)

## 权限请求

应用程序需要正常运行需要相应的权限。这里提供了请求权限的服务。

[详细介绍](./uikit.service.permission.md)

## 离线通知

移动设备在应用 App 没有启动等请情况下收到的通知，通过该通知可以实现消息离线接收。
目前支持：`APNs(Apple)` 和 `FCM(Google)`。
**注意** `FCM` 消息服务通知也可以内含 `APNs` 服务。具体详见 `firebase#message` 介绍。

[详细介绍](./uikit.service.notification.md)

## hooks

`react-native` 技术里面的一大特色就是支持 `hooks` 工具的使用。 由于语言的特点， `react-native` 支持 `类组件` 和 `函数组件`。 目前 `react-native` 的接口是以类组件的形式使用的，源码部分应该是函数组件编写。 官方推荐开发者使用 比较轻量的 `函数组件`。相比 `类组件`的 `笨重`，函数组件有很多优势，当然缺点就是缺少了类方法以及状态管理，为了解决这些问题，就需要用 `hooks` 工具，常用的包括： `useState`, `useEffect`, `useLayoutEffect`, `useRef`, `forwardRef`, `useCallback`, `useMemo`, `useContext` 以及 `memo`。

虽然提供了很多，但是也需要根据业务需要额外提供一些。

[详细介绍](./uikit.hooks.md)

## 其它

单独的、但不可或缺的组件或者功能放在这里。其它说明也放在这里。

[详细介绍](./uikit.others.md)

---

[返回父文档](./index.md)
