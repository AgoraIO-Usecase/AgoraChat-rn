// todo: 该文档待完善。

# 持久存储

目前持久储存提供接口和创建持久存储对象的方法。默认提供异步持久存储。后续还会提供更多版本的存储。

接口： `LocalStorageService`
创建方式： `const storage = Services.createLocalStorageService();`

用户也可以实现接口 `LocalStorageService` 实现自定义的存储模块来使用。

异步存储目前封装了 `@react-native-async-storage/async-storage` 库，使用的时候需要注意同步处理问题。

[源码](../../../packages/react-native-chat-uikit/src/services/LocalStorageService.tsx)
[示例](?)

---

[返回父文档](./uikit.md)
