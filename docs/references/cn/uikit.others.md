# 其它

## 时间戳

获取时间戳
[源码](../../../packages/react-native-chat-uikit/src/utils/generator.tsx)
[示例](../../../example/src/__dev__/test_util.tsx);

## 生成随机 uuid

uuid 来自 `uuid` 库, 使用 `v4` .
示例和源码同上。

## 序列号

全局标识唯一的数字。
默认全局标识为 `_global`
也可以指定全局标识，这样就可以分别单独使用。
示例和源码同上。

## 格式化字符串

对于无法完全显示的内容，可能需要进行格式化，将不需要显示的部分用省略号代替。
示例和源码同上。
[源码](../../../packages/react-native-chat-uikit/src/utils/format.tsx)
[示例](../../../example/src/__dev__/test_util.tsx);

## 格式化未读数

对于超过最大数量的未读数进行限制。例如：超过 `99` 个未读消息，可以使用 `99+` 进行显示。
示例和源码同上。

## 格式化日期时间

典型应用场景，对于聊天消息，可以显示今天、昨天、半年前等时间。
示例和源码同上。

## 调色板

可以非常方便的找到需要的颜色，颜色通过系统自动生成，参考 `react-native-paper`。
[源码](../../../packages/react-native-chat-uikit/src/utils/defaultColorPalette.tsx)

## 版本

`UIKIT` 提供版本查询功能。
**注意** `version.ts` 是系统在 `prepare` 自动生成的。
[源码](../../../packages/react-native-chat-uikit/src/utils/const.tsx)

---

[返回父文档](./uikit.md)
